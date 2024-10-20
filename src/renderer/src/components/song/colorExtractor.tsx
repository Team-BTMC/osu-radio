import { Accessor, createSignal, Setter } from "solid-js";
import { extractColors } from "extract-colors";
import { lighten, darken, getContrast, parseToHsl, hslToColorString } from "polished";
import { setGradientColors } from "../Gradient";

export type Song = {
  title: string;
  artist: string;
  bg?: string;
  duration: number;
  path: string;
  color?: string; // Optional color property to store extracted color
};

const MIN_CONTRAST_RATIO = 4.5;
const MIN_VIBRANCY_THRESHOLD = 0.3;
const VIBRANCY_WEIGHT = 0.7;
const AREA_WEIGHT = 0.3;

const colorCache = new Map<
  string,
  { color: string; signal: Accessor<string>; setter: Setter<string> }
>();

export function useColorExtractor() {
  const extractColorFromImage = (song: Song): Accessor<string> => {
    const songId = song.path;

    // Check the cache first
    if (colorCache.has(songId)) {
      const cached = colorCache.get(songId)!;
      song.color = cached.color; // Ensure song.color is set
      document.documentElement.style.setProperty('--extracted-color-rgb', hexToRgb(cached.color));
      return cached.signal;
    }

    // Create a signal for this song's color
    const [songColor, setSongColor] = createSignal<string>("gray");

    // Store in cache immediately with default color
    colorCache.set(songId, { color: "gray", signal: songColor, setter: setSongColor });

    if (!song.bg) {
      console.error("No background image found for color extraction.");
      setSongColor("gray");
      return songColor;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = song.bg;

    img.onload = () => {
      extractColors(img.src)
        .then((colors) => {
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

          let selectedColor = sortedColors[0]?.hex || "gray";

          // Find the first valid color that meets contrast and vibrancy thresholds
          for (const color of sortedColors) {
            const contrast = getContrast(color.hex, "#FFFFFF");
            if (
              contrast >= MIN_CONTRAST_RATIO &&
              getVibrancy(parseToHsl(color.hex)) >= MIN_VIBRANCY_THRESHOLD
            ) {
              selectedColor = color.hex;
              break;
            }
          }

          selectedColor = alterUnappealingColor(selectedColor);

          // Improve contrast if necessary
          if (getContrast(selectedColor, "#FFFFFF") < MIN_CONTRAST_RATIO) {
            selectedColor = improveContrast(selectedColor);
          }

          // Update the cache and song object
          song.color = selectedColor;
          setSongColor(selectedColor);
          colorCache.set(songId, { color: selectedColor, signal: songColor, setter: setSongColor });

          document.documentElement.style.setProperty('--extracted-color-rgb', hexToRgb(selectedColor));

          // Set gradient colors if needed
          setGradientColors({
            top: selectedColor,
            bottom: lighten(0.2, selectedColor),
          });
        })
        .catch((err) => {
          console.error("Error extracting color:", err);
          setSongColor("gray");
        });
    };

    return songColor;
  };

  return { extractColorFromImage };
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
    return hslToColorString({ hue: randomizeHue(100, 190), saturation: saturation + 0.5, lightness: lightness - 0.2 });
  }
  // Alter grayish brown
  if (hue >= 20 && hue <= 30 && saturation >= 0.3 && saturation <= 0.5 && lightness >= 0.2 && lightness <= 0.5) {
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
