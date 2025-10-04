function QRPreview({ url, canvasRef }) {
  return (
    <div className="qr-preview">
      <div ref={canvasRef} />
    </div>
  );
}

export default QRPreview;