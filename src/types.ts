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
  url?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  text?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  website?: string;
  phone?: string;
  email?: string;
  subject?: string;
  body?: string;
  message?: string;
  ssid?: string;
  password?: string;
  security?: "WPA" | "WEP" | "nopass";
  latitude?: string;
  longitude?: string;
  eventTitle?: string;
  eventStart?: string;
  eventEnd?: string;
  eventLocation?: string;
  eventDescription?: string;
  cryptoCurrency?: "BTC" | "ETH" | "SOL" | "LTC";
  cryptoAddress?: string;
  cryptoAmount?: string;
  mecardAddress?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  appPlatform?: "ios" | "android";
  appUrl?: string;
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

export type FrameTemplate = "none" | "rounded" | "badge" | "banner";

export interface QrStyles {
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  useGradient: boolean;
  gradientType: GradientType;
  gradientRotation: number;
  gradientColors: string[];
  backgroundGradient: boolean;
  backgroundGradientColors: string[];
  logoFile: string | null;
  logoSize: number;
  logoMargin: number;
  // Background image
  backgroundImage: string | null;
  backgroundOpacity: number;
  // Frame / CTA
  frameTemplate: FrameTemplate;
  frameText: string;
  frameTextPosition: "top" | "bottom";
  frameColor: string;
  frameFontColor: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  qrType: QrType;
  qrData: QrData;
  qrColors: QrColors;
  qrStyles: QrStyles;
  thumbnail: string;
}
