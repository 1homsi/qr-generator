import { memo, RefObject } from "react";
import { motion } from "motion/react";

export type PreviewSize = "sm" | "md" | "lg";
const SIZE_PX: Record<PreviewSize, number> = { sm: 240, md: 360, lg: 480 };

interface QRPreviewProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  phonePreview: boolean;
  backgroundImage: string | null;
  previewSize: PreviewSize;
  invertPreview: boolean;
}

const QRPreview = memo(function QRPreview({
  canvasRef,
  phonePreview,
  backgroundImage,
  previewSize,
  invertPreview,
}: QRPreviewProps) {
  const px = SIZE_PX[previewSize];

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
            style={{
              ...(phonePreview ? {} : { width: px, height: px }),
              ...(backgroundImage
                ? {
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 8,
                  }
                : {}),
              ...(invertPreview ? { filter: "invert(1)" } : {}),
            }}
          >
            <div ref={canvasRef} />
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default QRPreview;
