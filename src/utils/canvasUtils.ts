import type { QrStyles } from "../types";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Apply background image and/or frame CTA to a QR canvas, returns composite canvas. */
export async function applyPostProcessing(
  sourceCanvas: HTMLCanvasElement,
  styles: QrStyles
): Promise<HTMLCanvasElement> {
  const hasFrame =
    styles.frameTemplate !== "none" && styles.frameText.trim() !== "";
  const hasBg = !!styles.backgroundImage;

  if (!hasFrame && !hasBg) return sourceCanvas;

  const FRAME_H = hasFrame ? Math.round(sourceCanvas.width * 0.13) : 0;
  const onTop = styles.frameTextPosition === "top";
  const outW = sourceCanvas.width;
  const outH = sourceCanvas.height + FRAME_H;

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;

  // Fill white base
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, outW, outH);

  const qrY = onTop ? FRAME_H : 0;

  // Background image under QR area
  if (hasBg && styles.backgroundImage) {
    try {
      const bgImg = await loadImage(styles.backgroundImage);
      ctx.save();
      ctx.globalAlpha = styles.backgroundOpacity;
      ctx.drawImage(bgImg, 0, qrY, outW, sourceCanvas.height);
      ctx.restore();
    } catch {
      // ignore load errors
    }
  }

  // Draw QR code
  ctx.drawImage(sourceCanvas, 0, qrY);

  // Draw frame bar
  if (hasFrame) {
    const frameY = onTop ? 0 : outH - FRAME_H;
    const r =
      styles.frameTemplate === "rounded" || styles.frameTemplate === "badge"
        ? 8
        : 0;

    ctx.fillStyle = styles.frameColor || "#4583c4";
    if (r > 0) {
      roundRect(ctx, 0, frameY, outW, FRAME_H, r);
      ctx.fill();
    } else {
      ctx.fillRect(0, frameY, outW, FRAME_H);
    }

    ctx.fillStyle = styles.frameFontColor || "#ffffff";
    const fontSize = Math.max(14, Math.round(outW * 0.05));
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      styles.frameText,
      outW / 2,
      frameY + FRAME_H / 2,
      outW - 24
    );
  }

  return canvas;
}

/** QR content capacity at error correction H (max ~1273 bytes). */
export function getQRCapacity(contentByteLength: number): {
  used: number;
  max: number;
  pct: number;
  level: "ok" | "warn" | "danger";
} {
  const max = 1273;
  const pct = Math.min(100, Math.round((contentByteLength / max) * 100));
  return {
    used: contentByteLength,
    max,
    pct,
    level: pct < 60 ? "ok" : pct < 90 ? "warn" : "danger",
  };
}
