import { memo, ReactNode } from "react";
import {
  FiUser,
  FiFileText,
  FiMail,
  FiMessageSquare,
  FiWifi,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiCreditCard,
  FiVideo,
  FiYoutube,
  FiSmartphone,
  FiDollarSign,
} from "react-icons/fi";
import { FaLink, FaBitcoin, FaWhatsapp, FaSpotify } from "react-icons/fa";
import type { QrType } from "../types";

interface QRTypeSelectorProps {
  qrType: QrType;
  setQrType: (type: QrType) => void;
}

const QR_TYPES: { id: QrType; label: string; icon: ReactNode }[] = [
  { id: "URL", label: "URL", icon: <FaLink /> },
  { id: "TEXT", label: "Text", icon: <FiFileText /> },
  { id: "VCARD", label: "vCard", icon: <FiUser /> },
  { id: "MECARD", label: "MeCard", icon: <FiCreditCard /> },
  { id: "EMAIL", label: "Email", icon: <FiMail /> },
  { id: "SMS", label: "SMS", icon: <FiMessageSquare /> },
  { id: "PHONE", label: "Phone", icon: <FiPhone /> },
  { id: "WHATSAPP", label: "WhatsApp", icon: <FaWhatsapp /> },
  { id: "WIFI", label: "WiFi", icon: <FiWifi /> },
  { id: "LOCATION", label: "Location", icon: <FiMapPin /> },
  { id: "EVENT", label: "Event", icon: <FiCalendar /> },
  { id: "ZOOM", label: "Zoom", icon: <FiVideo /> },
  { id: "SPOTIFY", label: "Spotify", icon: <FaSpotify /> },
  { id: "YOUTUBE", label: "YouTube", icon: <FiYoutube /> },
  { id: "APPSTORE", label: "App Store", icon: <FiSmartphone /> },
  { id: "CRYPTO", label: "Crypto", icon: <FaBitcoin /> },
  { id: "UPI", label: "UPI Pay", icon: <FiDollarSign /> },
];

const QRTypeSelector = memo(function QRTypeSelector({
  qrType,
  setQrType,
}: QRTypeSelectorProps) {
  return (
    <div className="qr-type-strip" role="group" aria-label="QR code type">
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
