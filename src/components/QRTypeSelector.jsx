import {
  FiUser,
  FiFileText,
  FiMail,
  FiMessageSquare,
  FiWifi
} from 'react-icons/fi';
import { FaLink } from 'react-icons/fa';

function QRTypeSelector({ qrType, setQrType }) {
  const qrTypes = [
    {
      id: "URL",
      label: "URL",
      icon: <FaLink />
    },
    {
      id: "VCARD",
      label: "VCARD",
      icon: <FiUser />
    },
    {
      id: "TEXT",
      label: "TEXT",
      icon: <FiFileText />
    },
    {
      id: "EMAIL",
      label: "E-MAIL",
      icon: <FiMail />
    },
    {
      id: "SMS",
      label: "SMS",
      icon: <FiMessageSquare />
    },
    {
      id: "WIFI",
      label: "WIFI",
      icon: <FiWifi />
    }
  ];

  return (
    <div className="qr-types">
      {qrTypes.map((type) => (
        <button
          key={type.id}
          className={`qr-type-btn ${qrType === type.id ? 'active' : ''}`}
          onClick={() => setQrType(type.id)}
        >
          <div className="qr-type-icon">{type.icon}</div>
          {type.label}
        </button>
      ))}
    </div>
  );
}

export default QRTypeSelector;