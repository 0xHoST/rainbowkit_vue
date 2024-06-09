import type { ThemeVariables } from "@/css/sprinkles.css";

const systemFontStack =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
export const fonts = {
  rounded: `SFRounded, ui-rounded, "SF Pro Rounded", ${systemFontStack}`,
  system: systemFontStack,
} as const;

export type FontStack = keyof typeof fonts;
export type RadiusScale = 'large' | 'medium' | 'small' | 'none';
export type Blurs = 'large' | 'small' | 'none';
export type AccentColorPreset = 'blue' | 'green' | 'red' | 'purple' | 'pink' | 'orange';
export type Theme = { light: ThemeVariables, dark: ThemeVariables, midnight: ThemeVariables  };
export type ThemeOption = { theme: Theme, mode: 'light' | 'dark' | 'midnight' }; 
export interface BaseThemeOptions {
    borderRadius?: RadiusScale;
    fontStack?: FontStack;
    overlayBlur?: Blurs;
  }
export interface AccentColor {
  accentColor: string
  accentColorForeground: string
}
export interface ThemeOptions extends BaseThemeOptions {
  accentColor?: string
  accentColorForeground?: string
}

