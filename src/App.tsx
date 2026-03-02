import { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import QRTypeSelector from "./components/QRTypeSelector";
import InputSection from "./components/InputSection";
import CustomizationSection from "./components/CustomizationSection";
import QRPreview from "./components/QRPreview";
import DownloadSection from "./components/DownloadSection";
import ThemeToggle from "./components/ThemeToggle";
import type { QrData, QrColors, QrStyles, QrType, GradientType } from "./types";

interface GradientConfig {
  type: GradientType;
  rotation: number;
  colorStops: { offset: number; color: string }[];
}

const getGradientConfig = (
  colors: [string, string],
  rotation = 0,
  type: GradientType = "linear"
): GradientConfig => ({
  type,
  rotation,
  colorStops: colors.map((color, index) => ({
    offset: index / (colors.length - 1),
    color,
  })),
});

function App() {
  const [isDark, setIsDark] = useState<boolean>(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const [qrData, setQrData] = useState<QrData>({});
  const [qrType, setQrType] = useState<QrType>("URL");
  const [qrColors, setQrColors] = useState<QrColors>({
    foreground: "#000000",
    background: "#ffffff",
  });
  const [qrStyles, setQrStyles] = useState<QrStyles>({
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

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateQRCode();
  }, [qrData, qrType, qrColors, qrStyles]);

  const generateQRContent = (): string => {
    switch (qrType) {
      case "URL":
        return qrData.url || "https://example.com";

      case "TEXT":
        return qrData.text || "";

      case "VCARD":
        return `BEGIN:VCARD
VERSION:3.0
FN:${qrData.firstName || ""} ${qrData.lastName || ""}
N:${qrData.lastName || ""};${qrData.firstName || ""};;;
ORG:${qrData.organization || ""}
TEL:${qrData.phone || ""}
EMAIL:${qrData.email || ""}
URL:${qrData.website || ""}
END:VCARD`;

      case "EMAIL": {
        const params = new URLSearchParams();
        if (qrData.subject) params.append("subject", qrData.subject);
        if (qrData.body) params.append("body", qrData.body);
        return `mailto:${qrData.email || ""}${params.toString() ? "?" + params.toString() : ""}`;
      }

      case "SMS":
        return `sms:${qrData.phone || ""}${qrData.message ? "?body=" + encodeURIComponent(qrData.message) : ""}`;

      case "WIFI":
        return `WIFI:T:${qrData.security || "WPA"};S:${qrData.ssid || ""};P:${qrData.password || ""};H:false;;`;
    }
  };

  const buildQRConfig = (size: number, content: string) => {
    const cornerGradient = qrStyles.useGradient
      ? {
          gradient: getGradientConfig(
            qrStyles.gradientColors,
            qrStyles.gradientRotation,
            qrStyles.gradientType
          ),
        }
      : { color: qrColors.foreground };

    return {
      width: size,
      height: size,
      type: "canvas" as const,
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
        typeNumber: 0 as const,
        mode: "Byte" as const,
        errorCorrectionLevel: "H" as const,
      },
      dotsOptions: {
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
      },
      backgroundOptions: {
        ...(qrStyles.backgroundGradient
          ? { gradient: getGradientConfig(qrStyles.backgroundGradientColors) }
          : { color: qrColors.background }),
      },
      cornersSquareOptions: {
        type: qrStyles.cornerSquareStyle,
        ...cornerGradient,
      },
      cornersDotOptions: { type: qrStyles.cornerDotStyle, ...cornerGradient },
    };
  };

  const generateQRCode = async (): Promise<void> => {
    const content = generateQRContent();
    if (!content || !canvasRef.current) return;
    try {
      canvasRef.current.innerHTML = "";
      const qrCode = new QRCodeStyling(buildQRConfig(320, content));
      qrCode.append(canvasRef.current);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const downloadQRCode = async (): Promise<void> => {
    const content = generateQRContent();
    if (!content) {
      alert("Please fill in the required fields");
      return;
    }
    try {
      const qrCode = new QRCodeStyling(buildQRConfig(512, content));
      qrCode.download({ name: "qr-code", extension: "png" });
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
        <QRPreview canvasRef={canvasRef} />
        <DownloadSection onDownload={downloadQRCode} />
      </div>
    </div>
  );
}

export default App;
