import { createSignal } from "solid-js";
import { extractColors } from "extract-colors";
import { darken, lighten, getContrast, parseToHsl } from "polished";
import { setGradientColors } from "../Gradient"; // Import the setGradientColors function

// Minimum contrast ratio for readability (WCAG recommends at least 4.5:1 for normal text)
const MIN_CONTRAST_RATIO = 4.5;

// Minimum vibrancy to ensure visually appealing colors
const MIN_VIBRANCY_THRESHOLD = 0.3;

// Weight factors to prioritize dominant, vibrant colors
const VIBRANCY_WEIGHT = 0.7;
const AREA_WEIGHT = 0.3;

export function useSongColor() {
  const [averageColor, setAverageColor] = createSignal<string>("white");

  const handleImageLoad = (imageElement: HTMLImageElement) => {
    const src = imageElement.src;

    // Extract colors from the image
    extractColors(src)
      .then((colors) => {
        // Filter out colors that are too dark or too light
        const validColors = colors.filter((color) => {
          const hsl = parseToHsl(color.hex);
          return hsl.lightness > 0.1 && hsl.lightness < 0.9; // Exclude very dark or very light colors
        });

        // Sort colors based on a combination of vibrancy and area (dominance)
        const sortedColors = validColors.sort((a, b) => {
          const vibrancyA = getVibrancy(parseToHsl(a.hex));
          const vibrancyB = getVibrancy(parseToHsl(b.hex));

          // Calculate a weighted score based on vibrancy and area
          const scoreA = vibrancyA * VIBRANCY_WEIGHT + a.area * AREA_WEIGHT;
          const scoreB = vibrancyB * VIBRANCY_WEIGHT + b.area * AREA_WEIGHT;

          return scoreB - scoreA; // Sort descending by score
        });

        // Find the first valid color that meets both vibrancy and contrast threshold
        let selectedColor = sortedColors[0].hex;
        for (const color of sortedColors) {
          const contrast = getContrast(color.hex, "#FFFFFF");
          if (contrast >= MIN_CONTRAST_RATIO && getVibrancy(parseToHsl(color.hex)) >= MIN_VIBRANCY_THRESHOLD) {
            selectedColor = color.hex;
            break; // Pick the first valid color and exit loop
          }
        }

        // If no vibrant color hits the threshold, use improveContrast to adjust
        const contrast = getContrast(selectedColor, "#FFFFFF");
        if (contrast < MIN_CONTRAST_RATIO) {
          selectedColor = improveContrast(selectedColor);
        }

        // Set the gradient colors for top and bottom
        setGradientColors({
          top: selectedColor,               // Set the selected color as the top
          bottom: lighten(0.2, selectedColor), // Set a lighter shade as the bottom
        });

        const rgb = hexToRgb(selectedColor);

        document.documentElement.style.setProperty(
          "--extracted-color-rgb",
          `${rgb.r}, ${rgb.g}, ${rgb.b}`
        );
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
  for (let i = 0; i < 7 && contrast < MIN_CONTRAST_RATIO; i++) {
    darkenedColor = darken(0.1, darkenedColor); // Darken the color by 10%
    contrast = getContrast(darkenedColor, "#FFFFFF");
  }

  return contrast >= MIN_CONTRAST_RATIO ? darkenedColor : "gray";
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

// Helper function to calculate vibrancy based on saturation and lightness
function getVibrancy(hsl: { hue: number; saturation: number; lightness: number }): number {
  return hsl.saturation * (1 - Math.abs(hsl.lightness - 0.5) * 2);
}
