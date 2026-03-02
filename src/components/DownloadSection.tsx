import { memo } from "react";
import {
  FiDownload,
  FiCopy,
  FiShare2,
  FiCode,
  FiPrinter,
  FiClock,
  FiLayers,
  FiCamera,
} from "react-icons/fi";

export type Fmt = "png" | "svg" | "jpeg";

interface DownloadSectionProps {
  format: Fmt;
  onFormatChange: (f: Fmt) => void;
  onDownload: () => void;
  onCopy: () => void;
  onCopyText: () => void;
  onShare: () => void;
  onEmbed: () => void;
  onPrint: () => void;
  onShowHistory: () => void;
  onShowBatch: () => void;
  onShowScan: () => void;
  canShare: boolean;
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
  onCopyText,
  onShare,
  onEmbed,
  onPrint,
  onShowHistory,
  onShowBatch,
  onShowScan,
  canShare,
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

      <div className="extra-actions">
        <button className="extra-btn" onClick={onCopyText} title="Copy encoded text">
          <FiCode />
          Copy text
        </button>
        {canShare && (
          <button className="extra-btn" onClick={onShare} title="Share">
            <FiShare2 />
            Share
          </button>
        )}
        <button className="extra-btn" onClick={onEmbed} title="Get embed code">
          <FiCode size={13} />
          Embed
        </button>
        <button className="extra-btn" onClick={onPrint} title="Print / Save as PDF">
          <FiPrinter />
          Print
        </button>
        <button className="extra-btn" onClick={onShowHistory} title="History">
          <FiClock />
          History
        </button>
        <button className="extra-btn" onClick={onShowBatch} title="Batch generate">
          <FiLayers />
          Batch
        </button>
        <button className="extra-btn" onClick={onShowScan} title="Decode QR code">
          <FiCamera />
          Scan
        </button>
      </div>
    </div>
  );
});

export default DownloadSection;
