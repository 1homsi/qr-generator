import { memo, useState } from "react";
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
  onRename: (id: string, name: string) => void;
  onReorder: (designs: SavedDesign[]) => void;
}

const SavedDesigns = memo(function SavedDesigns({
  designs,
  onLoad,
  onRemove,
  onSave,
  onRename,
  onReorder,
}: SavedDesignsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const startEdit = (design: SavedDesign) => {
    setEditingId(design.id);
    setEditingName(design.name);
  };

  const commitEdit = () => {
    if (editingId && editingName.trim()) {
      onRename(editingId, editingName.trim());
    }
    setEditingId(null);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overIndex !== index) setOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const reordered = [...designs];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    onReorder(reordered);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

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
            {designs.map((design, index) => (
              <motion.div
                key={design.id}
                className={[
                  "saved-design-item",
                  dragIndex === index ? "sd-dragging" : "",
                  overIndex === index && dragIndex !== index ? "sd-drag-over" : "",
                ].join(" ").trim()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                layout
                draggable
                onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, index)}
                onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, index)}
                onDrop={(e) => handleDrop(e as unknown as React.DragEvent, index)}
                onDragEnd={handleDragEnd}
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
                  {editingId === design.id ? (
                    <input
                      className="saved-design-name-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") setEditingId(null);
                        e.stopPropagation();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="saved-design-name"
                      title="Click to rename"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(design);
                      }}
                    >
                      {design.name}
                    </span>
                  )}
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
