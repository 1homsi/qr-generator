import { motion } from "motion/react";
import { FiX, FiCommand } from "react-icons/fi";

const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);

const SHORTCUTS: { label: string; keys: string[] }[] = [
  { label: "Undo", keys: isMac ? ["⌘", "Z"] : ["Ctrl", "Z"] },
  { label: "Redo", keys: isMac ? ["⌘", "Y"] : ["Ctrl", "Y"] },
  { label: "Redo (alt)", keys: isMac ? ["⌘", "⇧", "Z"] : ["Ctrl", "⇧", "Z"] },
  { label: "Keyboard shortcuts", keys: ["?"] },
  { label: "Close modal", keys: ["Esc"] },
];

export default function ShortcutsPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal shortcuts-modal"
        initial={{ scale: 0.94, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <FiCommand />
            <h2>Keyboard Shortcuts</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="shortcuts-list">
          {SHORTCUTS.map((s) => (
            <div key={s.label} className="shortcut-row">
              <span className="shortcut-label">{s.label}</span>
              <div className="shortcut-keys">
                {s.keys.map((k, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <kbd className="kbd">{k}</kbd>
                    {i < s.keys.length - 1 && <span className="kbd-plus">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
