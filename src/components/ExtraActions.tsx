import { memo } from "react";
import { motion } from "motion/react";
import {
  FiCode,
  FiShare2,
  FiPrinter,
  FiClock,
  FiLayers,
  FiCamera,
  FiSmartphone,
} from "react-icons/fi";

interface ExtraActionsProps {
  onCopyText: () => void;
  onShare: () => void;
  onEmbed: () => void;
  onPrint: () => void;
  onShowHistory: () => void;
  onShowBatch: () => void;
  onShowScan: () => void;
  canShare: boolean;
  phonePreview: boolean;
  onTogglePhone: () => void;
}

const ExtraActions = memo(function ExtraActions({
  onCopyText,
  onShare,
  onEmbed,
  onPrint,
  onShowHistory,
  onShowBatch,
  onShowScan,
  canShare,
  phonePreview,
  onTogglePhone,
}: ExtraActionsProps) {
  return (
    <div className="extra-actions-panel">
      <h4 className="extra-actions-title">Actions</h4>
      <div className="extra-actions">
        <motion.button
          className={`extra-btn ${phonePreview ? "active" : ""}`}
          onClick={onTogglePhone}
          title="Phone preview"
          whileTap={{ scale: 0.93 }}
        >
          <FiSmartphone />
          Phone
        </motion.button>
        <motion.button
          className="extra-btn"
          onClick={onCopyText}
          title="Copy encoded text"
          whileTap={{ scale: 0.93 }}
        >
          <FiCode />
          Copy text
        </motion.button>
        {canShare && (
          <motion.button
            className="extra-btn"
            onClick={onShare}
            title="Share"
            whileTap={{ scale: 0.93 }}
          >
            <FiShare2 />
            Share
          </motion.button>
        )}
        <motion.button
          className="extra-btn"
          onClick={onEmbed}
          title="Get embed code"
          whileTap={{ scale: 0.93 }}
        >
          <FiCode size={13} />
          Embed
        </motion.button>
        <motion.button
          className="extra-btn"
          onClick={onPrint}
          title="Print / Save as PDF"
          whileTap={{ scale: 0.93 }}
        >
          <FiPrinter />
          Print
        </motion.button>
        <motion.button
          className="extra-btn"
          onClick={onShowHistory}
          title="History"
          whileTap={{ scale: 0.93 }}
        >
          <FiClock />
          History
        </motion.button>
        <motion.button
          className="extra-btn"
          onClick={onShowBatch}
          title="Batch generate"
          whileTap={{ scale: 0.93 }}
        >
          <FiLayers />
          Batch
        </motion.button>
        <motion.button
          className="extra-btn"
          onClick={onShowScan}
          title="Decode QR code"
          whileTap={{ scale: 0.93 }}
        >
          <FiCamera />
          Scan
        </motion.button>
      </div>
    </div>
  );
});

export default ExtraActions;
