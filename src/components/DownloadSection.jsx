function DownloadSection({ onDownload }) {
  return (
    <div className="download-section">
      <button className="download-button" onClick={onDownload}>
        Download
      </button>
    </div>
  );
}

export default DownloadSection;