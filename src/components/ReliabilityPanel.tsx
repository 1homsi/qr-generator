import { motion } from "motion/react";
import { FiX, FiActivity } from "react-icons/fi";

const TESTS = [
  { name: "Normal", imgStyle: {} },
  { name: "Blurry", imgStyle: { filter: "blur(2.5px)" } },
  { name: "Low contrast", imgStyle: { filter: "contrast(0.35) brightness(1.4)" } },
  { name: "Tiny print", imgStyle: { width: 72, height: 72 } },
  { name: "Faded", imgStyle: { opacity: 0.35 } },
  { name: "Tilted", imgStyle: { transform: "perspective(180px) rotateY(28deg)" } },
];

interface ReliabilityPanelProps {
  snapshot: string;
  onClose: () => void;
}

export default function ReliabilityPanel({ snapshot, onClose }: ReliabilityPanelProps) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal reliability-modal"
        initial={{ scale: 0.94, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <FiActivity />
            <h2>Reliability Simulator</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <p className="modal-hint">
          Simulates degraded real-world conditions. Your QR should still scan cleanly in as many scenarios as possible.
        </p>

        <div className="reliability-grid">
          {TESTS.map((test) => (
            <div key={test.name} className="reliability-card">
              <div className="reliability-img-wrap">
                <img
                  src={snapshot}
                  alt={test.name}
                  className="reliability-img"
                  style={test.imgStyle}
                />
              </div>
              <span className="reliability-label">{test.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
