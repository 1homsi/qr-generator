import { motion } from "motion/react";
import { FiX, FiImage } from "react-icons/fi";

const SURFACES = [
  { name: "White Paper", bg: "#ffffff", labelColor: "#333333" },
  { name: "Dark Desk", bg: "#1c1c1e", labelColor: "#eeeeee" },
  { name: "Kraft Paper", bg: "#c8a96e", labelColor: "#3d2b1f" },
  { name: "Chalkboard", bg: "#2d4a3e", labelColor: "#e8f5e9" },
];

interface SurfacePreviewProps {
  snapshot: string;
  onClose: () => void;
}

export default function SurfacePreview({ snapshot, onClose }: SurfacePreviewProps) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal surface-modal"
        initial={{ scale: 0.94, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <FiImage />
            <h2>Surface Preview</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <p className="modal-hint">See how your QR looks on different backgrounds.</p>

        <div className="surface-grid">
          {SURFACES.map((surface) => (
            <div
              key={surface.name}
              className="surface-card"
              style={{ background: surface.bg }}
            >
              <img src={snapshot} alt={`QR on ${surface.name}`} className="surface-qr" />
              <span className="surface-label" style={{ color: surface.labelColor }}>
                {surface.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
