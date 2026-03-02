import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import { FiX, FiCamera, FiCopy, FiCheck } from "react-icons/fi";

interface ScanPanelProps {
  onUseContent: (content: string) => void;
  onClose: () => void;
}

export default function ScanPanel({ onUseContent, onClose }: ScanPanelProps) {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const decode = useCallback((file: File) => {
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          setResult(code.data);
        } else {
          setError("No QR code found in this image.");
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && decode(files[0]),
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    multiple: false,
  });

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal scan-modal"
        initial={{ scale: 0.94, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <FiCamera />
            <h2>Decode QR Code</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`dropzone scan-dropzone ${isDragActive ? "active" : ""} ${result ? "has-file" : ""}`}
        >
          <input {...getInputProps()} aria-label="Upload QR code image" />
          <div className="dropzone-content">
            <FiCamera size={40} className="upload-icon" />
            <p>{isDragActive ? "Drop image here" : "Drop a QR image or click to upload"}</p>
            <span>PNG, JPG, WebP</span>
          </div>
        </div>

        {error && <p className="scan-error">{error}</p>}

        {result && (
          <div className="scan-result">
            <p className="scan-result-label">Decoded content:</p>
            <pre className="scan-result-content">{result}</pre>
            <div className="scan-result-actions">
              <button className="scan-copy-btn" onClick={copyResult}>
                {copied ? <FiCheck /> : <FiCopy />}
                {copied ? "Copied!" : "Copy text"}
              </button>
              <button
                className="scan-use-btn"
                onClick={() => {
                  onUseContent(result);
                  onClose();
                }}
              >
                Use as URL input
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
