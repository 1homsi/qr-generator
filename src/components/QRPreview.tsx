import { memo, RefObject } from "react";
import { motion } from "motion/react";

export type PreviewSize = "sm" | "md" | "lg";
export type ColorBlindMode = "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";

const SIZE_PX: Record<PreviewSize, number> = { sm: 240, md: 360, lg: 480 };

interface QRPreviewProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  phonePreview: boolean;
  backgroundImage: string | null;
  previewSize: PreviewSize;
  invertPreview: boolean;
  colorBlindMode: ColorBlindMode;
}

// SVG color matrix filters for color blindness simulation
const SVG_FILTERS = (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id="cb-deuteranopia">
        <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
      </filter>
      <filter id="cb-protanopia">
        <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
      </filter>
      <filter id="cb-tritanopia">
        <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
      </filter>
    </defs>
  </svg>
);

const FILTER_MAP: Record<ColorBlindMode, string | undefined> = {
  none: undefined,
  deuteranopia: "url(#cb-deuteranopia)",
  protanopia: "url(#cb-protanopia)",
  tritanopia: "url(#cb-tritanopia)",
  achromatopsia: "grayscale(100%)",
};

const QRPreview = memo(function QRPreview({
  canvasRef,
  phonePreview,
  backgroundImage,
  previewSize,
  invertPreview,
  colorBlindMode,
}: QRPreviewProps) {
  const px = SIZE_PX[previewSize];
  const cbFilter = FILTER_MAP[colorBlindMode];

  const filters = [
    invertPreview ? "invert(1)" : undefined,
    cbFilter,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className="preview-wrapper">
      {SVG_FILTERS}
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
              ...(filters ? { filter: filters } : {}),
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
