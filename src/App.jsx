import { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import QRTypeSelector from "./components/QRTypeSelector";
import InputSection from "./components/InputSection";
import CustomizationSection from "./components/CustomizationSection";
import QRPreview from "./components/QRPreview";
import DownloadSection from "./components/DownloadSection";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const [qrData, setQrData] = useState({});
  const [qrType, setQrType] = useState("URL");
  const [qrColors, setQrColors] = useState({
    foreground: "#000000",
    background: "#ffffff",
  });
  const [qrStyles, setQrStyles] = useState({
    dotStyle: "square",
    cornerSquareStyle: "square",
    cornerDotStyle: "square",
    useGradient: false,
    gradientType: "linear",
    gradientRotation: 0,
    gradientColors: ["#000000", "#333333"],
    backgroundGradient: false,
    backgroundGradientColors: ["#ffffff", "#f0f0f0"],
    logoFile: null,
    logoSize: 0.3,
    logoMargin: 10,
  });
  const canvasRef = useRef(null);
  const qrCodeInstance = useRef(null);

  useEffect(() => {
    generateQRCode();
  }, [qrData, qrType, qrColors, qrStyles]);

  const generateQRContent = () => {
    switch (qrType) {
      case "URL":
        return qrData.url || "https://voxire.com";

      case "TEXT":
        return qrData.text || "";

      case "VCARD": {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${qrData.firstName || ""} ${qrData.lastName || ""}
N:${qrData.lastName || ""};${qrData.firstName || ""};;;
ORG:${qrData.organization || ""}
TEL:${qrData.phone || ""}
EMAIL:${qrData.email || ""}
URL:${qrData.website || ""}
END:VCARD`;
        return vcard;
      }

      case "EMAIL": {
        const emailParams = new URLSearchParams();
        if (qrData.subject) emailParams.append("subject", qrData.subject);
        if (qrData.body) emailParams.append("body", qrData.body);
        return `mailto:${qrData.email || ""}${
          emailParams.toString() ? "?" + emailParams.toString() : ""
        }`;
      }

      case "SMS":
        return `sms:${qrData.phone || ""}${
          qrData.message ? "?body=" + encodeURIComponent(qrData.message) : ""
        }`;

      case "WIFI": {
        const security = qrData.security || "WPA";
        const ssid = qrData.ssid || "";
        const password = qrData.password || "";
        const hidden = "false";
        return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
      }

      default:
        return "https://voxire.com";
    }
  };

  const getGradientConfig = (colors, rotation = 0, type = "linear") => ({
    type,
    rotation,
    colorStops: colors.map((color, index) => ({
      offset: index / (colors.length - 1),
      color,
    })),
  });

  const generateQRCode = async () => {
    const content = generateQRContent();
    if (!content || !canvasRef.current) return;

    try {
      // Clear previous QR code
      canvasRef.current.innerHTML = "";

      const dotsConfig = {
        type: qrStyles.dotStyle,
        ...(qrStyles.useGradient
          ? {
              gradient: getGradientConfig(
                qrStyles.gradientColors,
                qrStyles.gradientRotation,
                qrStyles.gradientType
              ),
            }
          : { color: qrColors.foreground }),
      };

      const backgroundConfig = {
        ...(qrStyles.backgroundGradient
          ? { gradient: getGradientConfig(qrStyles.backgroundGradientColors) }
          : { color: qrColors.background }),
      };

      const qrCode = new QRCodeStyling({
        width: 320,
        height: 320,
        type: "canvas",
        data: content,
        margin: 16,
        ...(qrStyles.logoFile && {
          image: qrStyles.logoFile,
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: qrStyles.logoSize,
            margin: qrStyles.logoMargin,
            crossOrigin: "anonymous",
          },
        }),
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "H",
        },
        dotsOptions: dotsConfig,
        backgroundOptions: backgroundConfig,
        cornersSquareOptions: {
          type: qrStyles.cornerSquareStyle,
          ...(qrStyles.useGradient
            ? {
                gradient: getGradientConfig(
                  qrStyles.gradientColors,
                  qrStyles.gradientRotation,
                  qrStyles.gradientType
                ),
              }
            : { color: qrColors.foreground }),
        },
        cornersDotOptions: {
          type: qrStyles.cornerDotStyle,
          ...(qrStyles.useGradient
            ? {
                gradient: getGradientConfig(
                  qrStyles.gradientColors,
                  qrStyles.gradientRotation,
                  qrStyles.gradientType
                ),
              }
            : { color: qrColors.foreground }),
        },
      });

      qrCodeInstance.current = qrCode;
      qrCode.append(canvasRef.current);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const downloadQRCode = async () => {
    const content = generateQRContent();
    if (!content) {
      alert("Please fill in the required fields");
      return;
    }

    try {
      const dotsConfig = {
        type: qrStyles.dotStyle,
        ...(qrStyles.useGradient
          ? {
              gradient: getGradientConfig(
                qrStyles.gradientColors,
                qrStyles.gradientRotation,
                qrStyles.gradientType
              ),
            }
          : { color: qrColors.foreground }),
      };

      const backgroundConfig = {
        ...(qrStyles.backgroundGradient
          ? { gradient: getGradientConfig(qrStyles.backgroundGradientColors) }
          : { color: qrColors.background }),
      };

      const qrCode = new QRCodeStyling({
        width: 512,
        height: 512,
        type: "canvas",
        data: content,
        margin: 16,
        ...(qrStyles.logoFile && {
          image: qrStyles.logoFile,
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: qrStyles.logoSize,
            margin: qrStyles.logoMargin,
            crossOrigin: "anonymous",
          },
        }),
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "H",
        },
        dotsOptions: dotsConfig,
        backgroundOptions: backgroundConfig,
        cornersSquareOptions: {
          type: qrStyles.cornerSquareStyle,
          ...(qrStyles.useGradient
            ? {
                gradient: getGradientConfig(
                  qrStyles.gradientColors,
                  qrStyles.gradientRotation,
                  qrStyles.gradientType
                ),
              }
            : { color: qrColors.foreground }),
        },
        cornersDotOptions: {
          type: qrStyles.cornerDotStyle,
          ...(qrStyles.useGradient
            ? {
                gradient: getGradientConfig(
                  qrStyles.gradientColors,
                  qrStyles.gradientRotation,
                  qrStyles.gradientType
                ),
              }
            : { color: qrColors.foreground }),
        },
      });

      qrCode.download({
        name: "qr-code",
        extension: "png",
      });
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  return (
    <div className="app-container">
      <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
      <div className="left-panel">
        <h1 className="app-title">QR Generator</h1>
        <QRTypeSelector qrType={qrType} setQrType={setQrType} />
        <InputSection qrType={qrType} qrData={qrData} setQrData={setQrData} />
        <CustomizationSection
          qrColors={qrColors}
          setQrColors={setQrColors}
          qrStyles={qrStyles}
          setQrStyles={setQrStyles}
        />
      </div>

      <div className="right-panel">
        <QRPreview url={generateQRContent()} canvasRef={canvasRef} />
        <DownloadSection onDownload={downloadQRCode} />
      </div>
    </div>
  );
}

export default App;
