import type { QrColors } from "../types";

export interface ColorTheme {
  name: string;
  colors: QrColors;
  gradientColors: [string, string];
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    name: "Classic",
    colors: { foreground: "#000000", background: "#ffffff" },
    gradientColors: ["#000000", "#333333"],
  },
  {
    name: "Ocean",
    colors: { foreground: "#0077b6", background: "#caf0f8" },
    gradientColors: ["#0077b6", "#023e8a"],
  },
  {
    name: "Sunset",
    colors: { foreground: "#d62828", background: "#fff3b0" },
    gradientColors: ["#f77f00", "#d62828"],
  },
  {
    name: "Forest",
    colors: { foreground: "#1b4332", background: "#d8f3dc" },
    gradientColors: ["#1b4332", "#40916c"],
  },
  {
    name: "Midnight",
    colors: { foreground: "#e0e0e0", background: "#1a1a2e" },
    gradientColors: ["#e0e0e0", "#a8dadc"],
  },
  {
    name: "Rose",
    colors: { foreground: "#c9184a", background: "#fff0f3" },
    gradientColors: ["#c9184a", "#ff4d6d"],
  },
  {
    name: "Slate",
    colors: { foreground: "#334155", background: "#f1f5f9" },
    gradientColors: ["#334155", "#64748b"],
  },
  {
    name: "Amber",
    colors: { foreground: "#92400e", background: "#fef3c7" },
    gradientColors: ["#92400e", "#d97706"],
  },
];
