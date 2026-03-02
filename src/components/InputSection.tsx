import { memo, useState, Dispatch, SetStateAction } from "react";
import { FiChevronDown, FiLink, FiEye, FiEyeOff } from "react-icons/fi";
import type { QrData, QrType } from "../types";

interface InputSectionProps {
  qrType: QrType;
  qrData: QrData;
  setQrData: Dispatch<SetStateAction<QrData>>;
  onAutoDetect?: (type: QrType, data: Partial<QrData>) => void;
}

const TITLES: Record<QrType, string> = {
  URL: "Enter your website URL",
  TEXT: "Enter your text",
  VCARD: "Enter contact information",
  MECARD: "Enter contact card details",
  EMAIL: "Enter email details",
  SMS: "Enter SMS details",
  PHONE: "Enter phone number",
  WHATSAPP: "Enter WhatsApp details",
  WIFI: "Enter WiFi details",
  LOCATION: "Enter location coordinates",
  EVENT: "Enter event details",
  ZOOM: "Enter Zoom meeting details",
  SPOTIFY: "Enter Spotify link",
  YOUTUBE: "Enter YouTube link",
  APPSTORE: "Enter app store link",
  CRYPTO: "Enter crypto wallet details",
  UPI: "Enter UPI payment details",
};

function detectQrType(url: string): { type: QrType; data: Partial<QrData> } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname;

    if (host === "open.spotify.com") return { type: "SPOTIFY", data: { spotifyUrl: url } };
    if (host === "youtube.com" && path.startsWith("/watch")) return { type: "YOUTUBE", data: { youtubeUrl: url } };
    if (host === "youtu.be") return { type: "YOUTUBE", data: { youtubeUrl: url } };
    if (host === "wa.me" || host === "api.whatsapp.com") {
      const phone = path.replace(/^\//, "");
      const text = u.searchParams.get("text") ?? "";
      return { type: "WHATSAPP", data: { phone, message: text } };
    }
    if (host === "zoom.us" && path.startsWith("/j/")) {
      const id = path.slice(3).replace(/\D/g, "");
      const pwd = u.searchParams.get("pwd") ?? "";
      return { type: "ZOOM", data: { zoomMeetingId: id, zoomPassword: pwd } };
    }
    if (host === "apps.apple.com") return { type: "APPSTORE", data: { appPlatform: "ios", appUrl: url } };
    if (host === "play.google.com" && path.startsWith("/store/apps")) return { type: "APPSTORE", data: { appPlatform: "android", appUrl: url } };
  } catch {
    // not a valid URL
  }
  return null;
}

const InputSection = memo(function InputSection({
  qrType,
  qrData,
  setQrData,
  onAutoDetect,
}: InputSectionProps) {
  const [showUtm, setShowUtm] = useState(false);
  const [shortening, setShortening] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (field: keyof QrData, value: string) =>
    setQrData((prev) => ({ ...prev, [field]: value }));

  const handleShorten = async () => {
    const url = qrData.url?.trim();
    if (!url) return;
    setShortening(true);
    try {
      const res = await fetch(
        `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
      );
      const text = await res.text();
      if (text.startsWith("https://is.gd/")) {
        set("url", text.trim());
      }
    } catch {
      // silently ignore CORS / network errors
    } finally {
      setShortening(false);
    }
  };

  const hasUtm =
    qrData.utmSource ||
    qrData.utmMedium ||
    qrData.utmCampaign ||
    qrData.utmContent ||
    qrData.utmTerm;

  const renderInputs = () => {
    switch (qrType) {
      case "URL":
        return (
          <div className="url-section">
            <input
              type="url"
              placeholder="https://example.com"
              value={qrData.url ?? ""}
              onChange={(e) => set("url", e.target.value)}
              onPaste={(e) => {
                if (!onAutoDetect) return;
                const pasted = e.clipboardData.getData("text").trim();
                const detected = detectQrType(pasted);
                if (detected) {
                  e.preventDefault();
                  onAutoDetect(detected.type, detected.data);
                }
              }}
              className="url-input"
            />

            <div className="url-tools-row">
              <button
                className={`url-tool-btn ${shortening ? "loading" : ""}`}
                onClick={handleShorten}
                disabled={shortening || !qrData.url?.trim()}
                title="Shorten URL with is.gd"
              >
                <FiLink size={12} />
                {shortening ? "Shortening…" : "Shorten URL"}
              </button>

              <button
                className={`url-tool-btn ${showUtm ? "open" : ""} ${hasUtm ? "has-values" : ""}`}
                onClick={() => setShowUtm((v) => !v)}
              >
                <span>UTM{hasUtm ? " •" : ""}</span>
                <FiChevronDown
                  size={12}
                  style={{
                    transform: showUtm ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
            </div>

            {showUtm && (
              <div className="utm-fields">
                <input
                  type="text"
                  placeholder="Source (e.g. google, newsletter)"
                  value={qrData.utmSource ?? ""}
                  onChange={(e) => set("utmSource", e.target.value)}
                  className="url-input"
                />
                <input
                  type="text"
                  placeholder="Medium (e.g. cpc, email, qr)"
                  value={qrData.utmMedium ?? ""}
                  onChange={(e) => set("utmMedium", e.target.value)}
                  className="url-input"
                />
                <input
                  type="text"
                  placeholder="Campaign (e.g. spring_sale)"
                  value={qrData.utmCampaign ?? ""}
                  onChange={(e) => set("utmCampaign", e.target.value)}
                  className="url-input"
                />
                <input
                  type="text"
                  placeholder="Content (optional)"
                  value={qrData.utmContent ?? ""}
                  onChange={(e) => set("utmContent", e.target.value)}
                  className="url-input"
                />
                <input
                  type="text"
                  placeholder="Term (optional)"
                  value={qrData.utmTerm ?? ""}
                  onChange={(e) => set("utmTerm", e.target.value)}
                  className="url-input"
                />
              </div>
            )}
          </div>
        );

      case "TEXT":
        return (
          <textarea
            placeholder="Enter your text here..."
            value={qrData.text ?? ""}
            onChange={(e) => set("text", e.target.value)}
            className="url-input"
            rows={4}
          />
        );

      case "VCARD":
        return (
          <div className="form-grid">
            <input
              type="text"
              placeholder="First Name"
              value={qrData.firstName ?? ""}
              onChange={(e) => set("firstName", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={qrData.lastName ?? ""}
              onChange={(e) => set("lastName", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Organization"
              value={qrData.organization ?? ""}
              onChange={(e) => set("organization", e.target.value)}
              className="url-input"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={qrData.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              className="url-input"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={qrData.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              className="url-input"
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={qrData.website ?? ""}
              onChange={(e) => set("website", e.target.value)}
              className="url-input"
            />
          </div>
        );

      case "MECARD":
        return (
          <div className="form-grid">
            <input
              type="text"
              placeholder="First Name"
              value={qrData.firstName ?? ""}
              onChange={(e) => set("firstName", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={qrData.lastName ?? ""}
              onChange={(e) => set("lastName", e.target.value)}
              className="url-input"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={qrData.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              className="url-input"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={qrData.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              className="url-input"
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={qrData.website ?? ""}
              onChange={(e) => set("website", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Address"
              value={qrData.mecardAddress ?? ""}
              onChange={(e) => set("mecardAddress", e.target.value)}
              className="url-input"
            />
          </div>
        );

      case "EMAIL":
        return (
          <div className="form-grid">
            <input
              type="email"
              placeholder="Recipient Email"
              value={qrData.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Subject"
              value={qrData.subject ?? ""}
              onChange={(e) => set("subject", e.target.value)}
              className="url-input"
            />
            <textarea
              placeholder="Message body..."
              value={qrData.body ?? ""}
              onChange={(e) => set("body", e.target.value)}
              className="url-input"
              rows={3}
            />
          </div>
        );

      case "SMS":
        return (
          <div className="form-grid">
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              value={qrData.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              className="url-input"
            />
            <textarea
              placeholder="Message (optional)..."
              value={qrData.message ?? ""}
              onChange={(e) => set("message", e.target.value)}
              className="url-input"
              rows={3}
            />
          </div>
        );

      case "PHONE":
        return (
          <input
            type="tel"
            placeholder="+1 234 567 8900"
            value={qrData.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            className="url-input"
          />
        );

      case "WHATSAPP":
        return (
          <div className="form-grid">
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              value={qrData.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              className="url-input"
            />
            <textarea
              placeholder="Pre-filled message (optional)..."
              value={qrData.message ?? ""}
              onChange={(e) => set("message", e.target.value)}
              className="url-input"
              rows={3}
            />
          </div>
        );

      case "WIFI":
        return (
          <div className="form-grid">
            <input
              type="text"
              placeholder="Network Name (SSID)"
              value={qrData.ssid ?? ""}
              onChange={(e) => set("ssid", e.target.value)}
              className="url-input"
            />
            <div className="password-field-row">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={qrData.password ?? ""}
                onChange={(e) => set("password", e.target.value)}
                className="url-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
            <select
              value={qrData.security ?? "WPA"}
              onChange={(e) =>
                set("security", e.target.value as QrData["security"] & string)
              }
              className="url-input"
            >
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </div>
        );

      case "LOCATION":
        return (
          <div className="form-grid">
            <input
              type="number"
              placeholder="Latitude (e.g. 37.7749)"
              step="any"
              value={qrData.latitude ?? ""}
              onChange={(e) => set("latitude", e.target.value)}
              className="url-input"
            />
            <input
              type="number"
              placeholder="Longitude (e.g. -122.4194)"
              step="any"
              value={qrData.longitude ?? ""}
              onChange={(e) => set("longitude", e.target.value)}
              className="url-input"
            />
          </div>
        );

      case "EVENT":
        return (
          <div className="form-grid">
            <input
              type="text"
              placeholder="Event Title"
              value={qrData.eventTitle ?? ""}
              onChange={(e) => set("eventTitle", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={qrData.eventLocation ?? ""}
              onChange={(e) => set("eventLocation", e.target.value)}
              className="url-input"
            />
            <input
              type="datetime-local"
              value={qrData.eventStart ?? ""}
              onChange={(e) => set("eventStart", e.target.value)}
              className="url-input"
              aria-label="Start date and time"
            />
            <input
              type="datetime-local"
              value={qrData.eventEnd ?? ""}
              onChange={(e) => set("eventEnd", e.target.value)}
              className="url-input"
              aria-label="End date and time"
            />
            <textarea
              placeholder="Description (optional)..."
              value={qrData.eventDescription ?? ""}
              onChange={(e) => set("eventDescription", e.target.value)}
              className="url-input"
              rows={2}
            />
          </div>
        );

      case "CRYPTO":
        return (
          <div className="form-grid">
            <select
              value={qrData.cryptoCurrency ?? "BTC"}
              onChange={(e) =>
                set(
                  "cryptoCurrency",
                  e.target.value as QrData["cryptoCurrency"] & string
                )
              }
              className="url-input"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="LTC">Litecoin (LTC)</option>
            </select>
            <input
              type="text"
              placeholder="Wallet Address"
              value={qrData.cryptoAddress ?? ""}
              onChange={(e) => set("cryptoAddress", e.target.value)}
              className="url-input"
            />
            <input
              type="number"
              placeholder="Amount (optional)"
              step="any"
              min="0"
              value={qrData.cryptoAmount ?? ""}
              onChange={(e) => set("cryptoAmount", e.target.value)}
              className="url-input"
            />
          </div>
        );

      case "ZOOM":
        return (
          <div className="form-grid">
            <input
              type="text"
              placeholder="Meeting ID (e.g. 123 456 7890)"
              value={qrData.zoomMeetingId ?? ""}
              onChange={(e) => set("zoomMeetingId", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Passcode (optional)"
              value={qrData.zoomPassword ?? ""}
              onChange={(e) => set("zoomPassword", e.target.value)}
              className="url-input"
            />
          </div>
        );

      case "SPOTIFY":
        return (
          <input
            type="url"
            placeholder="https://open.spotify.com/track/..."
            value={qrData.spotifyUrl ?? ""}
            onChange={(e) => set("spotifyUrl", e.target.value)}
            className="url-input"
          />
        );

      case "YOUTUBE":
        return (
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={qrData.youtubeUrl ?? ""}
            onChange={(e) => set("youtubeUrl", e.target.value)}
            className="url-input"
          />
        );

      case "APPSTORE":
        return (
          <div className="form-grid">
            <select
              value={qrData.appPlatform ?? "ios"}
              onChange={(e) =>
                set(
                  "appPlatform",
                  e.target.value as QrData["appPlatform"] & string
                )
              }
              className="url-input"
            >
              <option value="ios">iOS App Store</option>
              <option value="android">Google Play Store</option>
            </select>
            <input
              type="url"
              placeholder={
                (qrData.appPlatform ?? "ios") === "ios"
                  ? "https://apps.apple.com/app/id..."
                  : "https://play.google.com/store/apps/details?id=..."
              }
              value={qrData.appUrl ?? ""}
              onChange={(e) => set("appUrl", e.target.value)}
              className="url-input"
            />
          </div>
        );

      case "UPI":
        return (
          <div className="form-grid">
            <input
              type="text"
              placeholder="UPI ID (e.g. name@upi)"
              value={qrData.upiId ?? ""}
              onChange={(e) => set("upiId", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Payee Name"
              value={qrData.upiName ?? ""}
              onChange={(e) => set("upiName", e.target.value)}
              className="url-input"
            />
            <input
              type="number"
              placeholder="Amount (INR, optional)"
              step="0.01"
              min="0"
              value={qrData.upiAmount ?? ""}
              onChange={(e) => set("upiAmount", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Note (optional)"
              value={qrData.upiNote ?? ""}
              onChange={(e) => set("upiNote", e.target.value)}
              className="url-input"
            />
          </div>
        );
    }
  };

  return (
    <div className="input-section">
      <h3>{TITLES[qrType]}</h3>
      <p>
        <span className="live-dot" aria-hidden="true" />
        Updates as you type
      </p>
      {renderInputs()}
    </div>
  );
});

export default InputSection;
