import { memo } from "react";
import {
  FiUser,
  FiFileText,
  FiMail,
  FiMessageSquare,
  FiWifi,
} from "react-icons/fi";
import { FaLink } from "react-icons/fa";
import type { QrType } from "../types";

interface QRTypeSelectorProps {
  qrType: QrType;
  setQrType: (type: QrType) => void;
}

const QR_TYPES: { id: QrType; label: string; icon: React.ReactNode }[] = [
  { id: "URL", label: "URL", icon: <FaLink /> },
  { id: "VCARD", label: "VCARD", icon: <FiUser /> },
  { id: "TEXT", label: "TEXT", icon: <FiFileText /> },
  { id: "EMAIL", label: "E-MAIL", icon: <FiMail /> },
  { id: "SMS", label: "SMS", icon: <FiMessageSquare /> },
  { id: "WIFI", label: "WIFI", icon: <FiWifi /> },
];

const QRTypeSelector = memo(function QRTypeSelector({
  qrType,
  setQrType,
}: QRTypeSelectorProps) {
  return (
    <div className="qr-types">
      {QR_TYPES.map((type) => (
        <button
          key={type.id}
          className={`qr-type-btn ${qrType === type.id ? "active" : ""}`}
          onClick={() => setQrType(type.id)}
          aria-label={`Select ${type.label} QR code type`}
          aria-pressed={qrType === type.id}
        >
          <div className="qr-type-icon">{type.icon}</div>
          {type.label}
        </button>
      ))}
    </div>
  );
});

export default QRTypeSelector;
