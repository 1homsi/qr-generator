function InputSection({ qrType, qrData, setQrData }) {
  const handleInputChange = (field, value) => {
    setQrData(prev => ({ ...prev, [field]: value }));
  };

  const renderInputs = () => {
    switch (qrType) {
      case "URL":
        return (
          <input
            type="url"
            placeholder="https://www.voxire.com"
            value={qrData.url || ''}
            onChange={(e) => handleInputChange('url', e.target.value)}
            className="url-input"
            required
          />
        );

      case "TEXT":
        return (
          <textarea
            placeholder="Enter your text here..."
            value={qrData.text || ''}
            onChange={(e) => handleInputChange('text', e.target.value)}
            className="url-input"
            rows={3}
          />
        );

      case "VCARD":
        return (
          <div className="form-grid">
            <input
              type="text"
              placeholder="First Name"
              value={qrData.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={qrData.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="url-input"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={qrData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="url-input"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={qrData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Organization"
              value={qrData.organization || ''}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              className="url-input"
            />
            <input
              type="url"
              placeholder="https://www.voxire.com"
              value={qrData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="url-input"
            />
          </div>
        );

      case "EMAIL":
        return (
          <div className="form-grid">
            <input
              type="email"
              placeholder="Recipient Email"
              value={qrData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Subject"
              value={qrData.subject || ''}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="url-input"
            />
            <textarea
              placeholder="Message body..."
              value={qrData.body || ''}
              onChange={(e) => handleInputChange('body', e.target.value)}
              className="url-input"
              rows={3}
            />
          </div>
        );

      case "SMS":
        return (
          <div className="form-grid">
            <input
              type="tel"
              placeholder="Phone Number"
              value={qrData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="url-input"
            />
            <textarea
              placeholder="Message..."
              value={qrData.message || ''}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="url-input"
              rows={3}
            />
          </div>
        );

      case "WIFI":
        return (
          <div className="form-grid">
            <input
              type="text"
              placeholder="Network Name (SSID)"
              value={qrData.ssid || ''}
              onChange={(e) => handleInputChange('ssid', e.target.value)}
              className="url-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={qrData.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="url-input"
            />
            <select
              value={qrData.security || 'WPA'}
              onChange={(e) => handleInputChange('security', e.target.value)}
              className="url-input"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (qrType) {
      case "URL":
        return "Enter your website";
      case "TEXT":
        return "Enter your text";
      case "VCARD":
        return "Enter contact information";
      case "EMAIL":
        return "Enter email details";
      case "SMS":
        return "Enter SMS details";
      case "WIFI":
        return "Enter WiFi details";
      default:
        return "Enter content";
    }
  };

  return (
    <div className="input-section">
      <h3>{getTitle()}</h3>
      <p>(Your QR Code will be generated automatically)</p>
      {renderInputs()}
    </div>
  );
}

export default InputSection;