import { memo } from "react";
import { motion } from "motion/react";
import { FiDownload, FiCopy } from "react-icons/fi";

export type Fmt = "png" | "svg" | "jpeg";

interface DownloadSectionProps {
  format: Fmt;
  onFormatChange: (f: Fmt) => void;
  onDownload: () => void;
  onCopy: () => void;
}

const FORMATS: { value: Fmt; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "svg", label: "SVG" },
  { value: "jpeg", label: "JPEG" },
];

const DownloadSection = memo(function DownloadSection({
  format,
  onFormatChange,
  onDownload,
  onCopy,
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
