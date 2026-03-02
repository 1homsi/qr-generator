import { memo } from "react";
import { motion } from "motion/react";
import { FiDownload, FiCopy } from "react-icons/fi";

export type Fmt = "png" | "svg" | "jpeg";

interface DownloadSectionProps {
  format: Fmt;
  onFormatChange: (f: Fmt) => void;
  onDownload: () => void;
  onCopy: () => void;
  downloadSize: number;
  onSizeChange: (size: number) => void;
}

const FORMATS: { value: Fmt; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "svg", label: "SVG" },
  { value: "jpeg", label: "JPEG" },
];

const SIZES: { value: number; label: string; sub: string }[] = [
  { value: 512, label: "Small", sub: "512px" },
  { value: 1024, label: "Standard", sub: "1024px" },
  { value: 2048, label: "High-DPI", sub: "2048px" },
  { value: 3000, label: "Print", sub: "3000px" },
];

const DownloadSection = memo(function DownloadSection({
  format,
  onFormatChange,
  onDownload,
  onCopy,
  downloadSize,
  onSizeChange,
}: DownloadSectionProps) {
  return (
    <div className="download-section">
      <div className="format-selector" role="group" aria-label="Download format">
        {FORMATS.map((f) => (
          <motion.button
            key={f.value}
            className={`format-btn ${format === f.value ? "active" : ""}`}
            onClick={() => onFormatChange(f.value)}
            aria-pressed={format === f.value}
            whileTap={{ scale: 0.95 }}
            style={{ position: "relative" }}
          >
            {format === f.value && (
              <motion.span
                layoutId="format-pill"
                className="format-pill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{f.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="size-selector" role="group" aria-label="Download size">
        {SIZES.map((s) => (
          <motion.button
            key={s.value}
            className={`size-btn ${downloadSize === s.value ? "active" : ""}`}
            onClick={() => onSizeChange(s.value)}
            aria-pressed={downloadSize === s.value}
            whileTap={{ scale: 0.95 }}
            style={{ position: "relative" }}
          >
            {downloadSize === s.value && (
              <motion.span
                layoutId="size-pill"
                className="size-pill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
              <span>{s.label}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{s.sub}</span>
            </span>
          </motion.button>
        ))}
      </div>

      <div className="download-actions">
        <motion.button
          className="download-button"
          onClick={onDownload}
          aria-label={`Download QR code as ${format.toUpperCase()}`}
          whileTap={{ scale: 0.97 }}
        >
          <FiDownload />
          Download
        </motion.button>
        <motion.button
          className="copy-button"
          onClick={onCopy}
          aria-label="Copy QR code image to clipboard"
          whileTap={{ scale: 0.97 }}
        >
          <FiCopy />
          Copy
        </motion.button>
      </div>
    </div>
  );
});

export default DownloadSection;
