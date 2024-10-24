import { clsx, type ClassValue } from "clsx"
import { JSX } from "solid-js/jsx-runtime";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type Style = string | JSX.CSSProperties | undefined;
export function sn(...styles: Style[]): JSX.CSSProperties {
  return styles.reduce<JSX.CSSProperties>((acc, style) => {
    if (typeof style !== "object") {
      return acc;
    }

    return {
      ...acc,
      ...style,
    };
  }, {});
}
