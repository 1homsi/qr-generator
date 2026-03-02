import { memo, RefObject } from "react";
import { motion } from "motion/react";

interface QRPreviewProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  phonePreview: boolean;
  backgroundImage: string | null;
}

const QRPreview = memo(function QRPreview({
  canvasRef,
  phonePreview,
  backgroundImage,
}: QRPreviewProps) {
  return (
    <div className="preview-wrapper">
      <motion.div
        layout
        className={phonePreview ? "phone-frame-wrapper" : undefined}
        initial={false}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
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
      </motion.div>
    </div>
  );
});

export default QRPreview;
