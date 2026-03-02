import { memo } from "react";
import { FiDownload, FiCopy } from "react-icons/fi";

type Fmt = "png" | "svg" | "jpeg";

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
          <button
            key={f.value}
            className={`format-btn ${format === f.value ? "active" : ""}`}
            onClick={() => onFormatChange(f.value)}
            aria-pressed={format === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="download-actions">
        <button
          className="download-button"
          onClick={onDownload}
          aria-label={`Download QR code as ${format.toUpperCase()}`}
        >
          <FiDownload />
          Download
        </button>
        <button
          className="copy-button"
          onClick={onCopy}
          aria-label="Copy QR code image to clipboard"
        >
          <FiCopy />
          Copy
        </button>
      </div>
    </div>
  );
});

export default DownloadSection;
