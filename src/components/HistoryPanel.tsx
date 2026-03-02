import { memo } from "react";
import { motion } from "motion/react";
import { FiX, FiTrash2, FiClock } from "react-icons/fi";
import type { HistoryEntry, QrData, QrColors, QrStyles, QrType } from "../types";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onRestore: (
    qrType: QrType,
    qrData: QrData,
    qrColors: QrColors,
    qrStyles: QrStyles
  ) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const HistoryPanel = memo(function HistoryPanel({
  history,
  onRestore,
  onRemove,
  onClear,
  onClose,
}: HistoryPanelProps) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal history-modal"
        initial={{ scale: 0.94, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <FiClock />
            <h2>History</h2>
          </div>
          <div className="modal-header-actions">
            {history.length > 0 && (
              <button
                className="modal-clear-btn"
                onClick={onClear}
                aria-label="Clear history"
              >
                Clear all
              </button>
            )}
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="modal-empty">
            <p>No saved QR codes yet.</p>
            <p className="modal-empty-hint">
              Download a QR code to save it here automatically.
            </p>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((entry) => (
              <div key={entry.id} className="history-item">
                <button
                  className="history-thumb-btn"
                  onClick={() =>
                    onRestore(
                      entry.qrType,
                      entry.qrData,
                      entry.qrColors,
                      entry.qrStyles
                    )
                  }
                  aria-label={`Restore ${entry.qrType} QR code`}
                >
                  <img
                    src={entry.thumbnail}
                    alt="QR thumbnail"
                    className="history-thumb"
                  />
                  <div className="history-meta">
                    <span className="history-type">{entry.qrType}</span>
                    <span className="history-time">{timeAgo(entry.timestamp)}</span>
                  </div>
                </button>
                <button
                  className="history-delete-btn"
                  onClick={() => onRemove(entry.id)}
                  aria-label="Remove"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});

export default HistoryPanel;
