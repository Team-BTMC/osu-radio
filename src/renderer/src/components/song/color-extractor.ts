import { extractColors } from "extract-colors";
import { lighten, darken, getContrast, parseToHsl, hslToColorString } from "polished";
import { Accessor, createSignal } from "solid-js";
import { Song } from "src/@types";

const MIN_CONTRAST_RATIO = 4.5;
const MIN_VIBRANCY_THRESHOLD = 0.3;
const VIBRANCY_WEIGHT = 0.7;
const AREA_WEIGHT = 0.3;

type UseColorExtractorResult = {
  primaryColor: Accessor<string | undefined>;
  secondaryColor: Accessor<string | undefined>;
  processImage(src: string): void;
};

export function useColorExtractor() {
  const extractColorFromImage = (song: Song): UseColorExtractorResult => {
    const [primaryColor, setPrimartColor] = createSignal<string | undefined>(song.primaryColor);
    const [secondaryColor, setSecondaryColor] = createSignal<string | undefined>(
      song.secondaryColor,
    );

    const processImage = async (src: string) => {
      if (primaryColor() || secondaryColor()) {
        return;
      }

      try {
        const colors = await extractColorsFromImage(src);
        console.log("colors", colors);
        if (!colors.primaryColor || !colors.secondaryColor) {
          return;
        }

        setPrimartColor(colors.primaryColor);
        setSecondaryColor(colors.secondaryColor);

        await window.api.request(
          "save::songColors",
          colors.primaryColor,
          colors.secondaryColor,
          song.audio,
        );
      } catch (err) {
        console.error("Error extracting color:", err);
      }
    };

    return { primaryColor, secondaryColor, processImage };
  };

  return { extractColorFromImage };
}

type ExtractColorsFromImageResult = { primaryColor: string; secondaryColor: string };
function extractColorsFromImage(src: string): Promise<ExtractColorsFromImageResult> {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = src;

  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        const colors = await extractColors(img.src);

        const validColors = colors.filter((color) => {
          const hsl = parseToHsl(color.hex);
          return hsl.lightness > 0.1 && hsl.lightness < 0.9;
        });

        const sortedColors = validColors.sort((a, b) => {
          const vibrancyA = getVibrancy(parseToHsl(a.hex));
          const vibrancyB = getVibrancy(parseToHsl(b.hex));
          const scoreA = vibrancyA * VIBRANCY_WEIGHT + a.area * AREA_WEIGHT;
          const scoreB = vibrancyB * VIBRANCY_WEIGHT + b.area * AREA_WEIGHT;
          return scoreB - scoreA;
        });

        let primaryColor = sortedColors[0]?.hex || "gray";

        // Find the first valid color that meets contrast and vibrancy thresholds
        for (const color of sortedColors) {
          const contrast = getContrast(color.hex, "#FFFFFF");
          if (
            contrast >= MIN_CONTRAST_RATIO &&
            getVibrancy(parseToHsl(color.hex)) >= MIN_VIBRANCY_THRESHOLD
          ) {
            primaryColor = color.hex;
            break;
          }
        }

        primaryColor = alterUnappealingColor(primaryColor);

        // Improve contrast if necessary
        if (getContrast(primaryColor, "#FFFFFF") < MIN_CONTRAST_RATIO) {
          primaryColor = improveContrast(primaryColor);
        }

        const { lightness } = parseToHsl(primaryColor);
        const secondaryColor =
          lightness < 0.2 ? lighten(0.1, primaryColor) : darken(0.1, primaryColor);

        document.documentElement.style.setProperty("--extracted-color-rgb", hexToRgb(primaryColor));
        resolve({ primaryColor, secondaryColor });
      } catch (err) {
        reject(err);
      }
    };
  });
}

// Helper function to improve contrast by darkening the color
function improveContrast(color: string): string {
  let darkenedColor = color;
  let contrast = getContrast(darkenedColor, "#FFFFFF");
  for (let i = 0; i < 7 && contrast < MIN_CONTRAST_RATIO; i++) {
    darkenedColor = darken(0.1, darkenedColor); // Darken the color by 10%
    contrast = getContrast(darkenedColor, "#FFFFFF");
  }
  return darkenedColor;
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

// Helper function to calculate vibrancy based on saturation and lightness
function getVibrancy(hsl: { hue: number; saturation: number; lightness: number }): number {
  return hsl.saturation * (1 - Math.abs(hsl.lightness - 0.5) * 2);
}

// Helper function to alter unappealing colors
function alterUnappealingColor(color: string): string {
  const { hue, saturation, lightness } = parseToHsl(color);
  // Alter brownish hues to red
  if (hue >= 20 && hue <= 45 && saturation < 0.6 && lightness > 0.3 && lightness < 0.6) {
    return hslToColorString({ hue: randomizeHue(0, 10), saturation: saturation + 0.3, lightness });
  }
  // Alter pickle green/yellowish greens to more vibrant yellow or green
  if (hue >= 70 && hue <= 100 && saturation > 0.2 && saturation < 0.4 && lightness > 0.3) {
    const newHue = Math.random() > 0.5 ? randomizeHue(50, 65) : randomizeHue(100, 120);
    return hslToColorString({ hue: newHue, saturation: saturation + 0.3, lightness });
  }
  // Alter tan to a more appealing golden color
  if (hue >= 35 && hue <= 50 && lightness > 0.7 && saturation < 0.5) {
    return hslToColorString({
      hue: randomizeHue(100, 190),
      saturation: saturation + 0.5,
      lightness: lightness - 0.2,
    });
  }
  // Alter grayish brown
  if (
    hue >= 20 &&
    hue <= 30 &&
    saturation >= 0.3 &&
    saturation <= 0.5 &&
    lightness >= 0.2 &&
    lightness <= 0.5
  ) {
    return hslToColorString({ hue: 75, saturation: saturation + 0.3, lightness: lightness + 0.3 });
  }
  // Alter muted purple
  if (hue >= 240 && hue <= 280 && saturation <= 0.5 && lightness >= 0.5 && lightness <= 0.7) {
    return hslToColorString({ hue: 260, saturation: saturation + 0.4, lightness: lightness + 0.1 });
  }
  return color;
}

// Helper function to add slight randomization to hue values
function randomizeHue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
