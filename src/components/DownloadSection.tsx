import { memo } from "react";

interface DownloadSectionProps {
  onDownload: () => void;
}

const DownloadSection = memo(function DownloadSection({
  onDownload,
}: DownloadSectionProps) {
  return (
    <div className="download-section">
      <button
        className="download-button"
        onClick={onDownload}
        aria-label="Download QR code as PNG"
      >
        Download
      </button>
    </div>
  );
});

export default DownloadSection;
