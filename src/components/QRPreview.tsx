import { memo, RefObject } from "react";
import { getQRCapacity } from "../utils/canvasUtils";

interface QRPreviewProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  compareSnapshot: string | null;
  onSaveCompare: () => void;
  onLoadCompare: () => void;
  contentByteLength: number;
  phonePreview: boolean;
  onTogglePhone: () => void;
  backgroundImage: string | null;
}

const QRPreview = memo(function QRPreview({
  canvasRef,
  compareSnapshot,
  onSaveCompare,
  onLoadCompare,
  contentByteLength,
  phonePreview,
  onTogglePhone,
  backgroundImage,
}: QRPreviewProps) {
  const capacity = getQRCapacity(contentByteLength);

  const card = (
    <div
      className="qr-card"
      style={
        backgroundImage
          ? { background: "transparent", boxShadow: "none", border: "none" }
          : undefined
      }
    >
      <div
        className="qr-preview"
        style={
          backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 8,
              }
            : undefined
        }
      >
        <div ref={canvasRef} />
      </div>
    </div>
  );

  return (
    <div className="preview-wrapper">
      {phonePreview ? (
        <div className="phone-frame-wrapper">{card}</div>
      ) : (
        card
      )}

      {/* Validity indicator */}
      {contentByteLength > 0 && (
        <div className={`validity-bar validity-${capacity.level}`}>
          <div
            className="validity-fill"
            style={{ width: `${capacity.pct}%` }}
          />
          <span className="validity-label">
            {capacity.used} / {capacity.max} bytes
            {capacity.level === "warn" && " — getting long"}
            {capacity.level === "danger" && " — too long, may not scan"}
          </span>
        </div>
      )}

      {/* Preview toolbar */}
      <div className="preview-toolbar">
        <button
          className={`preview-tool-btn ${phonePreview ? "active" : ""}`}
          onClick={onTogglePhone}
          title="Phone preview"
        >
          📱
        </button>
        <button
          className="preview-tool-btn"
          onClick={onSaveCompare}
          title="Save as Design A for comparison"
        >
          Save A
        </button>
        {compareSnapshot && (
          <button
            className="preview-tool-btn"
            onClick={onLoadCompare}
            title="Load saved Design A"
          >
            Load A
          </button>
        )}
      </div>

      {/* Compare snapshot */}
      {compareSnapshot && (
        <div className="compare-section">
          <p className="compare-label">Design A</p>
          <img src={compareSnapshot} alt="Design A" className="compare-thumb" />
        </div>
      )}
    </div>
  );
});

export default QRPreview;
