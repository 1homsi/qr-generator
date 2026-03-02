import { motion, AnimatePresence } from "motion/react";
import { FiX, FiLayout } from "react-icons/fi";
import type { QrType, QrData, QrColors } from "../types";

export interface QrTemplate {
  name: string;
  description: string;
  emoji: string;
  qrType: QrType;
  qrData: Partial<QrData>;
  qrColors: QrColors;
}

const TEMPLATES: QrTemplate[] = [
  {
    name: "WiFi Login",
    description: "Share your WiFi password easily",
    emoji: "📶",
    qrType: "WIFI",
    qrData: { ssid: "", password: "", security: "WPA" },
    qrColors: { foreground: "#1e3a5f", background: "#e0f2fe" },
  },
  {
    name: "Business Card",
    description: "Share contact info instantly",
    emoji: "💼",
    qrType: "VCARD",
    qrData: { firstName: "", lastName: "", email: "", phone: "", organization: "" },
    qrColors: { foreground: "#1f2937", background: "#f9fafb" },
  },
  {
    name: "Restaurant Menu",
    description: "Link to your menu or website",
    emoji: "🍽️",
    qrType: "URL",
    qrData: { url: "https://" },
    qrColors: { foreground: "#7c2d12", background: "#fff7ed" },
  },
  {
    name: "YouTube Video",
    description: "Link to your YouTube content",
    emoji: "▶️",
    qrType: "YOUTUBE",
    qrData: { youtubeUrl: "https://youtube.com/watch?v=" },
    qrColors: { foreground: "#cc0000", background: "#ffffff" },
  },
  {
    name: "Zoom Meeting",
    description: "Share meeting details to join",
    emoji: "📹",
    qrType: "ZOOM",
    qrData: { zoomMeetingId: "", zoomPassword: "" },
    qrColors: { foreground: "#2d8cff", background: "#f0f7ff" },
  },
  {
    name: "Bitcoin Wallet",
    description: "Accept crypto payments",
    emoji: "₿",
    qrType: "CRYPTO",
    qrData: { cryptoCurrency: "BTC", cryptoAddress: "" },
    qrColors: { foreground: "#f7931a", background: "#1a1a1a" },
  },
  {
    name: "App Store",
    description: "Link to your iOS or Android app",
    emoji: "📱",
    qrType: "APPSTORE",
    qrData: { appPlatform: "ios", appUrl: "https://apps.apple.com/app/" },
    qrColors: { foreground: "#000000", background: "#ffffff" },
  },
  {
    name: "Event Invite",
    description: "Calendar invite with date & location",
    emoji: "🎉",
    qrType: "EVENT",
    qrData: { eventTitle: "", eventLocation: "", eventStart: "", eventEnd: "" },
    qrColors: { foreground: "#7c3aed", background: "#faf5ff" },
  },
  {
    name: "WhatsApp Chat",
    description: "Open a WhatsApp conversation",
    emoji: "💬",
    qrType: "WHATSAPP",
    qrData: { phone: "", message: "Hi! I scanned your QR code." },
    qrColors: { foreground: "#128c7e", background: "#dcf8c6" },
  },
  {
    name: "Email",
    description: "Pre-filled email with subject & body",
    emoji: "✉️",
    qrType: "EMAIL",
    qrData: { email: "", subject: "", body: "" },
    qrColors: { foreground: "#1d4ed8", background: "#eff6ff" },
  },
];

interface TemplateGalleryProps {
  onApply: (template: QrTemplate) => void;
  onClose: () => void;
}

export default function TemplateGallery({ onApply, onClose }: TemplateGalleryProps) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal template-modal"
        initial={{ scale: 0.94, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <FiLayout />
            <h2>Templates</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <p className="modal-hint">Pick a starting point — colors and content will be pre-filled.</p>

        <div className="template-grid">
          <AnimatePresence>
            {TEMPLATES.map((t, i) => (
              <motion.button
                key={t.name}
                className="template-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onApply(t);
                  onClose();
                }}
                style={{
                  borderColor: t.qrColors.foreground + "44",
                }}
              >
                <div
                  className="template-color-strip"
                  style={{
                    background: `linear-gradient(135deg, ${t.qrColors.background} 50%, ${t.qrColors.foreground} 50%)`,
                  }}
                />
                <div className="template-card-body">
                  <span className="template-emoji">{t.emoji}</span>
                  <div>
                    <p className="template-name">{t.name}</p>
                    <p className="template-desc">{t.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
