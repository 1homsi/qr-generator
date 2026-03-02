import { memo } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface SavedDesign {
  id: string;
  name: string;
  snapshot: string;
}

interface SavedDesignsProps {
  designs: SavedDesign[];
  onLoad: (id: string) => void;
  onRemove: (id: string) => void;
  onSave: () => void;
}

const SavedDesigns = memo(function SavedDesigns({
  designs,
  onLoad,
  onRemove,
  onSave,
}: SavedDesignsProps) {
  return (
    <div className="saved-designs">
      <div className="saved-designs-header">
        <h4>Saved Designs</h4>
        <motion.button
          className="save-design-btn"
          onClick={onSave}
          whileTap={{ scale: 0.95 }}
        >
          + Save current
        </motion.button>
      </div>
      {designs.length === 0 ? (
        <p className="saved-designs-empty">No saved designs yet</p>
      ) : (
        <div className="saved-designs-grid">
          <AnimatePresence mode="popLayout">
            {designs.map((design) => (
              <motion.div
                key={design.id}
                className="saved-design-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                layout
              >
                <motion.button
                  className="saved-design-thumb-btn"
                  onClick={() => onLoad(design.id)}
                  title={`View "${design.name}"`}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={design.snapshot}
                    alt={design.name}
                    className="saved-design-thumb"
                  />
                  <span className="saved-design-name">{design.name}</span>
                </motion.button>
                <button
                  className="saved-design-delete-btn"
                  onClick={() => onRemove(design.id)}
                  title="Remove"
                  aria-label={`Remove "${design.name}"`}
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
});

export default SavedDesigns;
