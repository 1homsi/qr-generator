import { memo, Dispatch, SetStateAction } from "react";
import type { QrData, QrType } from "../types";

interface InputSectionProps {
  qrType: QrType;
  qrData: QrData;
  setQrData: Dispatch<SetStateAction<QrData>>;
}

const TITLES: Record<QrType, string> = {
  URL: "Enter your website",
  TEXT: "Enter your text",
  VCARD: "Enter contact information",
  EMAIL: "Enter email details",
  SMS: "Enter SMS details",
  WIFI: "Enter WiFi details",
};

const InputSection = memo(function InputSection({
  qrType,
  qrData,
  setQrData,
}: InputSectionProps) {
  const handleChange = (field: keyof QrData, value: string) => {
    setQrData((prev) => ({ ...prev, [field]: value }));
  };

  const renderInputs = () => {
    switch (qrType) {
      case "URL":
        return (
          <input
            type="url"
            placeholder="https://www.example.com"
            value={qrData.url ?? ""}
            onChange={(e) => handleChange("url", e.target.value)}
            className="url-input"
          />
        );

      case "TEXT":
        return (
          <textarea
            placeholder="Enter your text here..."
            value={qrData.text ?? ""}
            onChange={(e) => handleChange("text", e.target.value)}
            className="url-input"
            rows={3}
          />
        );

      case "VCARD":
        return (
          <div className="form-grid">
            <input
              type="text"
              placeholder="First Name"
              value={qrData.firstName ?? ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={qrData.lastName ?? ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="url-input"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={qrData.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="url-input"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={qrData.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Organization"
              value={qrData.organization ?? ""}
              onChange={(e) => handleChange("organization", e.target.value)}
              className="url-input"
            />
            <input
              type="url"
              placeholder="https://www.example.com"
              value={qrData.website ?? ""}
              onChange={(e) => handleChange("website", e.target.value)}
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
              onChange={(e) => handleChange("email", e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Subject"
              value={qrData.subject ?? ""}
              onChange={(e) => handleChange("subject", e.target.value)}
              className="url-input"
            />
            <textarea
              placeholder="Message body..."
              value={qrData.body ?? ""}
              onChange={(e) => handleChange("body", e.target.value)}
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
              placeholder="Phone Number"
              value={qrData.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="url-input"
            />
            <textarea
              placeholder="Message..."
              value={qrData.message ?? ""}
              onChange={(e) => handleChange("message", e.target.value)}
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
              onChange={(e) => handleChange("ssid", e.target.value)}
              className="url-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={qrData.password ?? ""}
              onChange={(e) => handleChange("password", e.target.value)}
              className="url-input"
            />
            <select
              value={qrData.security ?? "WPA"}
              onChange={(e) =>
                handleChange(
                  "security",
                  e.target.value as QrData["security"] & string
                )
              }
              className="url-input"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </div>
        );
    }
  };

  return (
    <div className="input-section">
      <h3>{TITLES[qrType]}</h3>
      <p>(Your QR Code will be generated automatically)</p>
      {renderInputs()}
    </div>
  );
});

export default InputSection;
