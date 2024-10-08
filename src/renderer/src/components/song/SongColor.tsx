import { createSignal } from "solid-js";
import { FastAverageColor } from "fast-average-color";
import { darken, getContrast, parseToHsl, hslToColorString } from "polished";

// Minimum contrast ratio for readability (WCAG recommends at least 4.5:1 for normal text)
const MIN_CONTRAST_RATIO = 4.5;

export function useSongColor() {
  const [averageColor, setAverageColor] = createSignal<string>("white");

  const handleImageLoad = (imageElement: HTMLImageElement) => {
    const fac = new FastAverageColor();

    fac.getColorAsync(imageElement)
      .then((color) => {
        let selectedColor = color.hex;
        const dominantColor = color.hex;
        const contrast = getContrast(selectedColor, "#FFFFFF");

        selectedColor = alterUnappealingColor(selectedColor);
        if (contrast < MIN_CONTRAST_RATIO) {
          selectedColor = improveContrast(selectedColor);
        } else {
          selectedColor = prioritizeVibrantColor(selectedColor, dominantColor);
        }

        setAverageColor(selectedColor);
      })
      .catch((err) => {
        console.error("Error extracting color:", err);
        setAverageColor("gray");
      });
  };

  return { averageColor, handleImageLoad };
}

// Helper function to improve contrast by darkening the color
function improveContrast(color: string): string {
  let darkenedColor = color;
  let contrast = getContrast(darkenedColor, "#FFFFFF");
  for (let i = 0; i < 5 && contrast < MIN_CONTRAST_RATIO; i++) {
    darkenedColor = darken(0.1, darkenedColor); // Darken the color by 10%
    contrast = getContrast(darkenedColor, "#FFFFFF");
  }

  return contrast >= MIN_CONTRAST_RATIO ? darkenedColor : "gray";
}

// Helper function to prioritize more vibrant colors
function prioritizeVibrantColor(color: string, dominantColor: string): string {
  const colorHsl = parseToHsl(color);
  const dominantHsl = parseToHsl(dominantColor);
  const colorVibrancy = getVibrancy(colorHsl);
  const dominantVibrancy = getVibrancy(dominantHsl);

  // If dominant color is more vibrant and has acceptable contrast, prefer it
  if (dominantVibrancy > colorVibrancy && getContrast(dominantColor, "#FFFFFF") >= MIN_CONTRAST_RATIO) {
    return dominantColor;
  }

  return color;
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
    return hslToColorString({ hue: randomizeHue(0, 10), saturation: saturation + 0.3, lightness: lightness });
  }

  // Alter pickle green/yellowish greens to more vibrant yellow or green
  if (hue >= 70 && hue <= 100 && saturation > 0.2 && saturation < 0.4 && lightness > 0.3) {
    const newHue = Math.random() > 0.5 ? randomizeHue(50, 65) : randomizeHue(100, 120);
    return hslToColorString({ hue: newHue, saturation: saturation + 0.3, lightness: lightness });
  }

  // Alter tan to a more appealing golden color
  if (hue >= 35 && hue <= 50 && lightness > 0.7 && saturation < 0.5) {
    return hslToColorString({ hue: randomizeHue(100, 190), saturation: saturation + 0.5, lightness: lightness + -0.2});
  }

  // Alter grayish brown (dull brown tones)
  if (hue >= 20 && hue <= 30 && saturation >= 0.3 && saturation <= 0.5 && lightness >= 0.2 && lightness <= 0.5) {
    return hslToColorString({ hue: 75, saturation: saturation + 0.3, lightness: lightness + 0.3 });
  }

  // Alter muted purple (low saturation purple)
  if (hue >= 240 && hue <= 280 && saturation <= 0.5 && lightness >= 0.5 && lightness <= 0.7) {
    return hslToColorString({ hue: 260, saturation: saturation + 0.4, lightness: lightness + 0.1 });
  }
  
  // Alter brownish yellow (muddy colors)
  if (
    (hue >= 30 && hue <= 45 && saturation >= 0.2 && saturation <= 0.5 && lightness >= 0.3 && lightness <= 0.5) ||
    (hue >= 20 && hue <= 35 && saturation >= 0.4 && lightness >= 0.4 && lightness <= 0.6)
  ) {
    return hslToColorString({ hue: randomizeHue(10, 20), saturation: saturation + 0.3, lightness: lightness + 0.1 });
  }

  // Alter dark olive green (dirty greens)
  if (
    (hue >= 70 && hue <= 90 && saturation >= 0.4 && saturation <= 0.6 && lightness >= 0.2 && lightness <= 0.4) ||
    (hue >= 60 && hue <= 80 && saturation >= 0.2 && saturation <= 0.4 && lightness >= 0.2 && lightness <= 0.5)
  ) {
    return hslToColorString({ hue: randomizeHue(90, 100), saturation: saturation + 0.3, lightness: lightness + 0.2 });
  }

  // Alter pale yellow-grey (sickly yellow)
  if (hue >= 45 && hue <= 60 && saturation >= 0.1 && saturation <= 0.4 && lightness >= 0.5 && lightness <= 0.7) {
    return hslToColorString({ hue: randomizeHue(75, 100), saturation: saturation + 0.3, lightness: lightness + 0.1 });
  }

  return color;
}

// Helper function to add slight randomization to hue values
function randomizeHue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
