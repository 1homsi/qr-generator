export type QrType = "URL" | "TEXT" | "VCARD" | "EMAIL" | "SMS" | "WIFI";

export interface QrData {
  url?: string;
  text?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  phone?: string;
  email?: string;
  website?: string;
  subject?: string;
  body?: string;
  message?: string;
  ssid?: string;
  password?: string;
  security?: "WPA" | "WEP" | "nopass";
}

export interface QrColors {
  foreground: string;
  background: string;
}

export type DotStyle =
  | "square"
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type CornerSquareStyle =
  | "square"
  | "dot"
  | "rounded"
  | "extra-rounded"
  | "classy"
  | "classy-rounded";

export type CornerDotStyle = "square" | "dot" | "rounded";

export type GradientType = "linear" | "radial";

export interface QrStyles {
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  useGradient: boolean;
  gradientType: GradientType;
  gradientRotation: number;
  gradientColors: [string, string];
  backgroundGradient: boolean;
  backgroundGradientColors: [string, string];
  logoFile: string | null;
  logoSize: number;
  logoMargin: number;
}
