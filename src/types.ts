export type QrType =
  | "URL"
  | "TEXT"
  | "VCARD"
  | "EMAIL"
  | "SMS"
  | "WIFI"
  | "PHONE"
  | "LOCATION"
  | "EVENT"
  | "CRYPTO"
  | "MECARD"
  | "WHATSAPP"
  | "ZOOM"
  | "SPOTIFY"
  | "YOUTUBE"
  | "APPSTORE"
  | "UPI";

export interface QrData {
  // URL
  url?: string;
  // TEXT
  text?: string;
  // VCARD / MECARD shared fields
  firstName?: string;
  lastName?: string;
  organization?: string;
  website?: string;
  // VCARD / MECARD / EMAIL / SMS / WHATSAPP / PHONE shared fields
  phone?: string;
  email?: string;
  // EMAIL
  subject?: string;
  body?: string;
  // SMS / WHATSAPP shared
  message?: string;
  // WIFI
  ssid?: string;
  password?: string;
  security?: "WPA" | "WEP" | "nopass";
  // LOCATION
  latitude?: string;
  longitude?: string;
  // EVENT
  eventTitle?: string;
  eventStart?: string;
  eventEnd?: string;
  eventLocation?: string;
  eventDescription?: string;
  // CRYPTO
  cryptoCurrency?: "BTC" | "ETH" | "SOL" | "LTC";
  cryptoAddress?: string;
  cryptoAmount?: string;
  // MECARD
  mecardAddress?: string;
  // ZOOM
  zoomMeetingId?: string;
  zoomPassword?: string;
  // SPOTIFY
  spotifyUrl?: string;
  // YOUTUBE
  youtubeUrl?: string;
  // APPSTORE
  appPlatform?: "ios" | "android";
  appUrl?: string;
  // UPI
  upiId?: string;
  upiName?: string;
  upiAmount?: string;
  upiNote?: string;
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
