import { memo, RefObject } from "react";

interface QRPreviewProps {
  canvasRef: RefObject<HTMLDivElement | null>;
}

const QRPreview = memo(function QRPreview({ canvasRef }: QRPreviewProps) {
  return (
    <div className="qr-preview">
      <div ref={canvasRef} />
    </div>
  );
});

export default QRPreview;
