import { useDropzone } from 'react-dropzone';
import {
  TbSquare,
  TbSquareRounded,
  TbCircleDot,
  TbDiamond,
  TbHeart,
  TbSquareDot,
  TbBorderRadius,
  TbCornerUpLeft,
  TbCornerDownRight,
  TbBrandFramer
} from 'react-icons/tb';
import {
  RiSquareLine,
  RiCheckboxBlankLine,
  RiRadioButtonLine
} from 'react-icons/ri';

function CustomizationSection({ qrColors, setQrColors, qrStyles, setQrStyles }) {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setQrStyles(prev => ({ ...prev, logoFile: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    multiple: false
  });
  return (
    <div className="customization-wrapper">
      <h3 className="section-title">Customize QR Code</h3>


      {/* Frame Style (Corner Squares) */}
      <div className="customization-group">
        <div className="group-header">
          <h4>Frame Style</h4>
        </div>
        <div className="qr-types">
          {[
            { id: "square", name: "Square", icon: <TbSquare /> },
            { id: "dot", name: "Dot", icon: <TbCircleDot /> },
            { id: "rounded", name: "Rounded", icon: <TbSquareRounded /> },
            { id: "extra-rounded", name: "Extra Round", icon: <RiRadioButtonLine /> },
            { id: "classy", name: "Classy", icon: <TbDiamond /> },
            { id: "classy-rounded", name: "Classy Round", icon: <TbBorderRadius /> }
          ].map((style) => (
            <button
              key={style.id}
              className={`qr-type-btn ${qrStyles.cornerSquareStyle === style.id ? 'active' : ''}`}
              onClick={() => setQrStyles(prev => ({ ...prev, cornerSquareStyle: style.id }))}
            >
              <div className="qr-type-icon">{style.icon}</div>
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Corner Dots */}
      <div className="customization-group">
        <div className="group-header">
          <h4>Corner Dots</h4>
        </div>
        <div className="qr-types">
          {[
            { id: "square", name: "Square", icon: <TbSquare /> },
            { id: "dot", name: "Dot", icon: <TbCircleDot /> },
            { id: "rounded", name: "Rounded", icon: <TbSquareRounded /> }
          ].map((style) => (
            <button
              key={style.id}
              className={`qr-type-btn ${qrStyles.cornerDotStyle === style.id ? 'active' : ''}`}
              onClick={() => setQrStyles(prev => ({ ...prev, cornerDotStyle: style.id }))}
            >
              <div className="qr-type-icon">{style.icon}</div>
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dot Patterns */}
      <div className="customization-group">
        <div className="corner-section">
          <div className="corner-row">
            <label>Dot Pattern</label>
            <div className="custom-select-wrapper">
              <select
                value={qrStyles.dotStyle}
                onChange={(e) => setQrStyles(prev => ({ ...prev, dotStyle: e.target.value }))}
                className="custom-select"
              >
                <option value="square">Square</option>
                <option value="rounded">Rounded</option>
                <option value="dots">Dots</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
              <div className="select-arrow">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div className="customization-group">
        <div className="group-header">
          <h4>Colors & Gradients</h4>
        </div>
        <div className="color-section">
          <div className="gradient-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={qrStyles.useGradient}
                onChange={(e) => setQrStyles(prev => ({ ...prev, useGradient: e.target.checked }))}
              />
              <span>Use Gradient</span>
            </label>
          </div>

          {qrStyles.useGradient ? (
            <div className="gradient-controls">
              <div className="color-row">
                <label>Gradient Start</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={qrStyles.gradientColors[0]}
                    onChange={(e) => setQrStyles(prev => ({
                      ...prev,
                      gradientColors: [e.target.value, prev.gradientColors[1]]
                    }))}
                    className="color-picker"
                  />
                  <span className="color-hex">{qrStyles.gradientColors[0]}</span>
                </div>
              </div>
              <div className="color-row">
                <label>Gradient End</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={qrStyles.gradientColors[1]}
                    onChange={(e) => setQrStyles(prev => ({
                      ...prev,
                      gradientColors: [prev.gradientColors[0], e.target.value]
                    }))}
                    className="color-picker"
                  />
                  <span className="color-hex">{qrStyles.gradientColors[1]}</span>
                </div>
              </div>
              <div className="slider-row">
                <label>Rotation</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={qrStyles.gradientRotation}
                  onChange={(e) => setQrStyles(prev => ({ ...prev, gradientRotation: parseInt(e.target.value) }))}
                  className="gradient-slider"
                />
                <span>{qrStyles.gradientRotation}°</span>
              </div>
            </div>
          ) : (
            <div className="color-row">
              <label>Foreground</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={qrColors.foreground}
                  onChange={(e) => setQrColors(prev => ({ ...prev, foreground: e.target.value }))}
                  className="color-picker"
                />
                <span className="color-hex">{qrColors.foreground}</span>
              </div>
            </div>
          )}

          <div className="color-row">
            <label>Background</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={qrColors.background}
                onChange={(e) => setQrColors(prev => ({ ...prev, background: e.target.value }))}
                className="color-picker"
              />
              <span className="color-hex">{qrColors.background}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="customization-group">
        <div className="group-header">
          <h4>Logo</h4>
        </div>
        <div className="logo-section">
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''} ${qrStyles.logoFile ? 'has-file' : ''}`}
          >
            <input {...getInputProps()} />
            {qrStyles.logoFile ? (
              <div className="dropzone-content">
                <img src={qrStyles.logoFile} alt="Logo preview" className="logo-preview" />
                <p>Drop a new image or click to change</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQrStyles(prev => ({ ...prev, logoFile: null }));
                  }}
                  className="remove-logo-btn"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="dropzone-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="upload-icon">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>{isDragActive ? 'Drop image here' : 'Drop logo here or click to upload'}</p>
                <span>PNG, JPG, SVG up to 5MB</span>
              </div>
            )}
          </div>

          {qrStyles.logoFile && (
            <div className="logo-controls">
              <div className="slider-row">
                <label>Size</label>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={qrStyles.logoSize}
                  onChange={(e) => setQrStyles(prev => ({ ...prev, logoSize: parseFloat(e.target.value) }))}
                  className="logo-slider"
                />
                <span>{Math.round(qrStyles.logoSize * 100)}%</span>
              </div>
              <div className="slider-row">
                <label>Margin</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={qrStyles.logoMargin}
                  onChange={(e) => setQrStyles(prev => ({ ...prev, logoMargin: parseInt(e.target.value) }))}
                  className="logo-slider"
                />
                <span>{qrStyles.logoMargin}px</span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default CustomizationSection;