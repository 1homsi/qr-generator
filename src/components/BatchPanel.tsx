import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import JSZip from "jszip";
import QRCodeStyling from "qr-code-styling";
import { FiX, FiLayers, FiDownload } from "react-icons/fi";
import type { QrColors, QrStyles } from "../types";

interface BatchPanelProps {
  qrColors: QrColors;
  qrStyles: QrStyles;
  onClose: () => void;
}

interface BatchRow {
  label: string;
  content: string;
}

export default function BatchPanel({ qrColors, qrStyles, onClose }: BatchPanelProps) {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback((file: File) => {
    setError(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const headers = result.meta.fields ?? [];
        const contentField =
          headers.find((h) => /content|url|text|data/i.test(h)) ?? headers[0];
        const labelField = headers.find((h) => /label|name|title/i.test(h));

        if (!contentField) {
          setError("CSV must have at least one column.");
          return;
        }

        const parsed: BatchRow[] = result.data.slice(0, 100).map((row, i) => ({
          label: (labelField ? row[labelField] : "") || `QR ${i + 1}`,
          content: row[contentField] ?? "",
        })).filter((r) => r.content.trim() !== "");

        if (parsed.length === 0) {
          setError("No valid rows found.");
          return;
        }
        setRows(parsed);
      },
      error: () => setError("Failed to parse CSV."),
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && parseFile(files[0]),
    accept: { "text/csv": [".csv"], "text/plain": [".txt"] },
    multiple: false,
  });

  const generateAll = async () => {
    if (rows.length === 0) return;
    const zip = new JSZip();
    setProgress(0);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const qrCode = new QRCodeStyling({
        width: 512,
        height: 512,
        type: "canvas",
        data: row.content,
        margin: 16,
        qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "H" },
        dotsOptions: {
          type: qrStyles.dotStyle,
          color: qrColors.foreground,
        },
        backgroundOptions: { color: qrColors.background },
        cornersSquareOptions: {
          type: qrStyles.cornerSquareStyle,
          color: qrColors.foreground,
        },
        cornersDotOptions: {
          type: qrStyles.cornerDotStyle,
          color: qrColors.foreground,
        },
      });

      const blob = await qrCode.getRawData("png");
      if (blob) {
        const safe = row.label.replace(/[^a-z0-9_-]/gi, "_").substring(0, 40);
        zip.file(`${String(i + 1).padStart(3, "0")}_${safe}.png`, blob);
      }
      setProgress(Math.round(((i + 1) / rows.length) * 100));
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-codes.zip";
    a.click();
    URL.revokeObjectURL(url);
    setProgress(null);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal batch-modal">
        <div className="modal-header">
          <div className="modal-title-row">
            <FiLayers />
            <h2>Batch Generate</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <p className="modal-hint">
          Upload a CSV with a <code>content</code> (or <code>url</code>) column.
          Optionally add a <code>label</code> column for filenames. Max 100 rows.
        </p>

        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""} ${rows.length > 0 ? "has-file" : ""}`}
        >
          <input {...getInputProps()} aria-label="Upload CSV file" />
          <div className="dropzone-content">
            <FiLayers size={36} className="upload-icon" />
            <p>{isDragActive ? "Drop CSV here" : rows.length > 0 ? `${rows.length} rows loaded — drop to replace` : "Drop CSV or click to upload"}</p>
            <span>.csv or .txt</span>
          </div>
        </div>

        {error && <p className="scan-error">{error}</p>}

        {rows.length > 0 && (
          <>
            <div className="batch-preview">
              <table className="batch-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Label</th>
                    <th>Content</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{row.label}</td>
                      <td className="batch-content-cell">{row.content}</td>
                    </tr>
                  ))}
                  {rows.length > 5 && (
                    <tr>
                      <td colSpan={3} className="batch-more">
                        +{rows.length - 5} more rows
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {progress !== null ? (
              <div className="batch-progress">
                <div
                  className="batch-progress-bar"
                  style={{ width: `${progress}%` }}
                />
                <span>{progress}%</span>
              </div>
            ) : (
              <button className="download-button batch-generate-btn" onClick={generateAll}>
                <FiDownload />
                Generate {rows.length} QR codes &amp; download ZIP
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
