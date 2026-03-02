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
  FiRotateCcw,
  FiShuffle,
  FiLink,
  FiMoon,
  FiHelpCircle,
  FiLayout,
  FiImage,
  FiActivity,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";
import type { PreviewSize } from "./QRPreview";

interface ExtraActionsProps {
  onCopyText: () => void;
  onShare: () => void;
  onEmbed: () => void;
  onPrint: () => void;
  onShowHistory: () => void;
  onShowBatch: () => void;
  onShowScan: () => void;
  onClearAll: () => void;
  onRandomize: () => void;
  onShareLink: () => void;
  onShowShortcuts: () => void;
  onShowTemplates: () => void;
  onShowSurface: () => void;
  onShowReliability: () => void;
  canShare: boolean;
  phonePreview: boolean;
  onTogglePhone: () => void;
  invertPreview: boolean;
  onToggleInvert: () => void;
  previewSize: PreviewSize;
  onSizeChange: (s: PreviewSize) => void;
}

const Btn = ({
  onClick,
  title,
  active,
  children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <motion.button
    className={`extra-btn ${active ? "active" : ""}`}
    onClick={onClick}
    title={title}
    whileTap={{ scale: 0.93 }}
  >
    {children}
  </motion.button>
);

const ExtraActions = memo(function ExtraActions(props: ExtraActionsProps) {
  const {
    onCopyText, onShare, onEmbed, onPrint, onShowHistory, onShowBatch, onShowScan,
    onClearAll, onRandomize, onShareLink, onShowShortcuts, onShowTemplates,
    onShowSurface, onShowReliability, canShare, phonePreview, onTogglePhone,
    invertPreview, onToggleInvert, previewSize, onSizeChange,
  } = props;

  return (
    <div className="extra-actions-panel">
      <h4 className="extra-actions-title">Actions</h4>

      {/* Preview controls */}
      <p className="extra-actions-group-label">Preview</p>
      <div className="extra-actions">
        <Btn onClick={onTogglePhone} title="Phone preview" active={phonePreview}>
          <FiSmartphone />
          Phone
        </Btn>
        <Btn onClick={onToggleInvert} title="Invert preview (dark background)" active={invertPreview}>
          <FiMoon />
          Dark bg
        </Btn>
      </div>

      {/* Preview size */}
      <div className="preview-size-row">
        <FiMaximize2 size={12} style={{ color: "var(--text-muted)" }} />
        {(["sm", "md", "lg"] as PreviewSize[]).map((s) => (
          <button
            key={s}
            className={`size-pill-btn ${previewSize === s ? "active" : ""}`}
            onClick={() => onSizeChange(s)}
            aria-label={`Preview size ${s}`}
          >
            {s.toUpperCase()}
          </button>
        ))}
        <FiMinimize2 size={12} style={{ color: "var(--text-muted)", transform: "rotate(180deg)" }} />
      </div>

      {/* Export */}
      <p className="extra-actions-group-label">Export</p>
      <div className="extra-actions">
        <Btn onClick={onCopyText} title="Copy encoded text">
          <FiCode />
          Copy text
        </Btn>
        {canShare && (
          <Btn onClick={onShare} title="Share QR image">
            <FiShare2 />
            Share
          </Btn>
        )}
        <Btn onClick={onEmbed} title="Get embed HTML snippet">
          <FiCode size={13} />
          Embed
        </Btn>
        <Btn onClick={onPrint} title="Print / Save as PDF">
          <FiPrinter />
          Print
        </Btn>
        <Btn onClick={onShareLink} title="Copy shareable URL with current design">
          <FiLink />
          Share link
        </Btn>
      </div>

      {/* Tools */}
      <p className="extra-actions-group-label">Tools</p>
      <div className="extra-actions">
        <Btn onClick={onShowScan} title="Decode QR code from image">
          <FiCamera />
          Scan
        </Btn>
        <Btn onClick={onShowBatch} title="Batch generate from CSV">
          <FiLayers />
          Batch
        </Btn>
        <Btn onClick={onShowHistory} title="View download history">
          <FiClock />
          History
        </Btn>
        <Btn onClick={onShowSurface} title="Preview on different surfaces">
          <FiImage />
          Surfaces
        </Btn>
        <Btn onClick={onShowReliability} title="Test scan reliability">
          <FiActivity />
          Reliability
        </Btn>
        <Btn onClick={onShowTemplates} title="Start from a template">
          <FiLayout />
          Templates
        </Btn>
      </div>

      {/* Design */}
      <p className="extra-actions-group-label">Design</p>
      <div className="extra-actions">
        <Btn onClick={onRandomize} title="Randomize style">
          <FiShuffle />
          Randomize
        </Btn>
        <Btn onClick={onClearAll} title="Reset everything to defaults">
          <FiRotateCcw />
          Reset all
        </Btn>
        <Btn onClick={onShowShortcuts} title="Keyboard shortcuts">
          <FiHelpCircle />
          Shortcuts
        </Btn>
      </div>
    </div>
  );
});

export default ExtraActions;
