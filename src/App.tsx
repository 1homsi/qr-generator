import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import QRCodeStyling from "qr-code-styling";
import QRTypeSelector from "./components/QRTypeSelector";
import InputSection from "./components/InputSection";
import CustomizationSection from "./components/CustomizationSection";
import QRPreview from "./components/QRPreview";
import DownloadSection from "./components/DownloadSection";
import ThemeToggle from "./components/ThemeToggle";
import HistoryPanel from "./components/HistoryPanel";
import BatchPanel from "./components/BatchPanel";
import ScanPanel from "./components/ScanPanel";
import OnboardingTooltip from "./components/OnboardingTooltip";
import SavedDesigns from "./components/SavedDesigns";
import type { SavedDesign } from "./components/SavedDesigns";
import ExtraActions from "./components/ExtraActions";
import { useUndoRedo } from "./hooks/useUndoRedo";
import { useQrHistory } from "./hooks/useQrHistory";
import { applyPostProcessing } from "./utils/canvasUtils";
import { COLOR_THEMES } from "./constants/themes";
import type { QrData, QrColors, QrStyles, QrType, GradientType, DotStyle, CornerSquareStyle, CornerDotStyle } from "./types";
import type { Fmt } from "./components/DownloadSection";
import type { PreviewSize, ColorBlindMode } from "./components/QRPreview";
import ShortcutsPanel from "./components/ShortcutsPanel";
import TemplateGallery from "./components/TemplateGallery";
import type { QrTemplate } from "./components/TemplateGallery";
import SurfacePreview from "./components/SurfacePreview";
import ReliabilityPanel from "./components/ReliabilityPanel";

interface GradientConfig {
  type: GradientType;
  rotation: number;
  colorStops: { offset: number; color: string }[];
}

const getGradientConfig = (
  colors: string[],
  rotation = 0,
  type: GradientType = "linear"
): GradientConfig => ({
  type,
  rotation,
  colorStops: colors.map((color, index) => ({
    offset: index / Math.max(1, colors.length - 1),
    color,
  })),
});

const ADJS = ["Brave", "Cosmic", "Dizzy", "Epic", "Fuzzy", "Glowing", "Happy", "Icy", "Jade", "Kind"];
const NOUNS = ["Tiger", "Panda", "Falcon", "Orca", "Rhino", "Lynx", "Viper", "Crane"];
const randomName = () =>
  `${ADJS[Math.floor(Math.random() * ADJS.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;

const CRYPTO_SCHEMES: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  LTC: "litecoin",
};

const INITIAL_STYLE_STATE: { qrColors: QrColors; qrStyles: QrStyles } = {
  qrColors: {
    foreground: "#000000",
    background: "#ffffff",
  },
  qrStyles: {
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
    backgroundImage: null,
    backgroundOpacity: 0.8,
    frameTemplate: "none",
    frameText: "",
    frameTextPosition: "bottom",
    frameColor: "#4583c4",
    frameFontColor: "#ffffff",
  },
};

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
  const [format, setFormat] = useState<Fmt>("png");
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null);
  const [phonePreview, setPhonePreview] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>(() => {
    try {
      const raw = localStorage.getItem("qr-saved-designs");
      return raw ? (JSON.parse(raw) as SavedDesign[]) : [];
    } catch {
      return [];
    }
  });
  const [previewDesign, setPreviewDesign] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSurface, setShowSurface] = useState(false);
  const [showReliability, setShowReliability] = useState(false);
  const [previewSize, setPreviewSize] = useState<PreviewSize>("md");
  const [invertPreview, setInvertPreview] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>("none");
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [downloadSize, setDownloadSize] = useState(1024);
  const [currentSnapshot, setCurrentSnapshot] = useState<string | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("qr-recent-colors");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const {
    state: styleState,
    set: setStyleState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo(INITIAL_STYLE_STATE);

  const { qrColors, qrStyles } = styleState;

  const setQrColors = useCallback(
    (next: QrColors | ((prev: QrColors) => QrColors)) => {
      setStyleState((prev) => ({
        ...prev,
        qrColors: typeof next === "function" ? next(prev.qrColors) : next,
      }));
    },
    [setStyleState]
  );

  const setQrStyles = useCallback(
    (next: QrStyles | ((prev: QrStyles) => QrStyles)) => {
      setStyleState((prev) => ({
        ...prev,
        qrStyles: typeof next === "function" ? next(prev.qrStyles) : next,
      }));
    },
    [setStyleState]
  );

  useEffect(() => {
    localStorage.setItem("qr-saved-designs", JSON.stringify(savedDesigns));
  }, [savedDesigns]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { history, addEntry, removeEntry, clearHistory } = useQrHistory();

  // Keyboard shortcuts: Ctrl/Cmd+Z (undo), Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z (redo), ? (shortcuts)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
        if (canUndo) { e.preventDefault(); undo(); }
      }
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Z")
      ) {
        if (canRedo) { e.preventDefault(); redo(); }
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts((v) => !v);
      }
      if (e.key === "Escape") {
        setShowShortcuts(false);
        setShowTemplates(false);
        setShowSurface(false);
        setShowReliability(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, canUndo, canRedo]);

  // Restore design from share URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#share=")) return;
    try {
      const encoded = hash.slice(7);
      const config = JSON.parse(decodeURIComponent(escape(atob(encoded))));
      if (config.qrType) setQrType(config.qrType);
      if (config.qrData) setQrData(config.qrData);
      if (config.qrColors || config.qrStyles) {
        setStyleState((prev) => ({
          qrColors: config.qrColors ?? prev.qrColors,
          qrStyles: config.qrStyles
            ? { ...INITIAL_STYLE_STATE.qrStyles, ...config.qrStyles }
            : prev.qrStyles,
        }));
      }
      window.history.replaceState(null, "", window.location.pathname);
      setTimeout(() => showToast("Design loaded from share link!"), 300);
    } catch {
      // ignore malformed hash
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    generateQRCode();
  }, [qrData, qrType, qrColors, qrStyles]);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const generateQRContent = (): string => {
    switch (qrType) {
      case "URL": {
        let url = qrData.url || "https://example.com";
        const utmParams = new URLSearchParams();
        if (qrData.utmSource) utmParams.set("utm_source", qrData.utmSource);
        if (qrData.utmMedium) utmParams.set("utm_medium", qrData.utmMedium);
        if (qrData.utmCampaign) utmParams.set("utm_campaign", qrData.utmCampaign);
        if (qrData.utmContent) utmParams.set("utm_content", qrData.utmContent);
        if (qrData.utmTerm) utmParams.set("utm_term", qrData.utmTerm);
        const utmStr = utmParams.toString();
        if (utmStr) url += (url.includes("?") ? "&" : "?") + utmStr;
        return url;
      }

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

      case "PHONE":
        return `tel:${qrData.phone || ""}`;

      case "LOCATION":
        return `geo:${qrData.latitude || "0"},${qrData.longitude || "0"}`;

      case "EVENT": {
        const fmt = (dt: string) =>
          dt.replace(/-/g, "").replace(/:/g, "") + "00";
        return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${qrData.eventTitle || ""}
DTSTART:${fmt(qrData.eventStart || "")}
DTEND:${fmt(qrData.eventEnd || "")}
LOCATION:${qrData.eventLocation || ""}
DESCRIPTION:${qrData.eventDescription || ""}
END:VEVENT
END:VCALENDAR`;
      }

      case "CRYPTO": {
        const scheme = CRYPTO_SCHEMES[qrData.cryptoCurrency || "BTC"];
        const amount = qrData.cryptoAmount
          ? `?amount=${qrData.cryptoAmount}`
          : "";
        return `${scheme}:${qrData.cryptoAddress || ""}${amount}`;
      }

      case "MECARD":
        return `MECARD:N:${qrData.lastName || ""},${qrData.firstName || ""};TEL:${qrData.phone || ""};EMAIL:${qrData.email || ""};URL:${qrData.website || ""};ADR:${qrData.mecardAddress || ""};;`;

      case "WHATSAPP": {
        const phone = (qrData.phone || "").replace(/[^0-9]/g, "");
        const msg = qrData.message
          ? `?text=${encodeURIComponent(qrData.message)}`
          : "";
        return `https://wa.me/${phone}${msg}`;
      }

      case "ZOOM": {
        const pwd = qrData.zoomPassword ? `?pwd=${qrData.zoomPassword}` : "";
        return `https://zoom.us/j/${(qrData.zoomMeetingId || "").replace(/\s/g, "")}${pwd}`;
      }

      case "SPOTIFY":
        return qrData.spotifyUrl || "";

      case "YOUTUBE":
        return qrData.youtubeUrl || "";

      case "APPSTORE":
        return qrData.appUrl || "";

      case "UPI": {
        const params = new URLSearchParams();
        params.set("pa", qrData.upiId || "");
        if (qrData.upiName) params.set("pn", qrData.upiName);
        if (qrData.upiAmount) params.set("am", qrData.upiAmount);
        params.set("cu", "INR");
        if (qrData.upiNote) params.set("tn", qrData.upiNote);
        return `upi://pay?${params.toString()}`;
      }
    }
  };

  const buildQRConfig = (size: number, content: string) => {
    const useTransparentBg = !!qrStyles.backgroundImage;
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
        ...(useTransparentBg
          ? { color: "rgba(0,0,0,0)" }
          : qrStyles.backgroundGradient
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

  const getCompositeCanvas = async (size: number): Promise<HTMLCanvasElement | null> => {
    const content = generateQRContent();
    if (!content) return null;
    const qrCode = new QRCodeStyling(buildQRConfig(size, content));
    const blob = await qrCode.getRawData("png");
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    await new Promise<void>((resolve) => { img.onload = () => resolve(); });
    URL.revokeObjectURL(url);
    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = size;
    srcCanvas.height = size;
    srcCanvas.getContext("2d")!.drawImage(img, 0, 0);
    const qrCanvas = await applyPostProcessing(srcCanvas, qrStyles);
    if (!captionText.trim()) return qrCanvas;

    // Render caption below QR
    const fontSize = Math.max(14, Math.round(size * 0.032));
    const padding = Math.round(size * 0.04);
    const captionHeight = fontSize + padding * 2;
    const final = document.createElement("canvas");
    final.width = qrCanvas.width;
    final.height = qrCanvas.height + captionHeight;
    const ctx = final.getContext("2d")!;
    ctx.fillStyle = qrColors.background || "#ffffff";
    ctx.fillRect(0, 0, final.width, final.height);
    ctx.drawImage(qrCanvas, 0, 0);
    ctx.fillStyle = qrColors.foreground || "#000000";
    ctx.font = `${fontSize}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(captionText.trim(), final.width / 2, qrCanvas.height + padding + fontSize);
    return final;
  };

  const downloadQRCode = async (): Promise<void> => {
    const content = generateQRContent();
    if (!content) {
      showToast("Please fill in the required fields");
      return;
    }
    try {
      if (format === "svg" && !qrStyles.backgroundImage && qrStyles.frameTemplate === "none" && !captionText.trim()) {
        const qrCode = new QRCodeStyling(buildQRConfig(downloadSize, content));
        await qrCode.download({ name: "qr-code", extension: "svg" });
      } else if (format === "pdf") {
        const finalCanvas = await getCompositeCanvas(downloadSize);
        if (!finalCanvas) return;
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ unit: "px", format: [finalCanvas.width, finalCanvas.height] });
        const dataUri = finalCanvas.toDataURL("image/png");
        pdf.addImage(dataUri, "PNG", 0, 0, finalCanvas.width, finalCanvas.height);
        pdf.save("qr-code.pdf");
      } else {
        const finalCanvas = await getCompositeCanvas(downloadSize);
        if (!finalCanvas) return;
        const mimeType =
          format === "jpeg" ? "image/jpeg" :
          format === "webp" ? "image/webp" :
          "image/png";
        const ext = format === "jpeg" ? "jpg" : format;
        const blob = await new Promise<Blob>((resolve) =>
          finalCanvas.toBlob((b) => resolve(b!), mimeType, 0.95)
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `qr-code.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      }

      // Save to history on download
      const canvas = canvasRef.current?.querySelector("canvas");
      if (canvas) {
        addEntry(qrType, qrData, qrColors, qrStyles, canvas.toDataURL("image/png", 0.5));
      }
      showToast(`Downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      showToast("Download failed");
    }
  };

  const copyQRCode = async (): Promise<void> => {
    const content = generateQRContent();
    if (!content) {
      showToast("Please fill in the required fields");
      return;
    }
    try {
      const finalCanvas = await getCompositeCanvas(512);
      if (!finalCanvas) return;
      const blob = await new Promise<Blob>((resolve) =>
        finalCanvas.toBlob((b) => resolve(b!), "image/png")
      );
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      showToast("Copied to clipboard!");
    } catch {
      showToast("Copy failed — try downloading instead");
    }
  };

  const copyText = () => {
    const content = generateQRContent();
    if (!content) {
      showToast("Nothing to copy");
      return;
    }
    navigator.clipboard
      .writeText(content)
      .then(() => showToast("Text copied!"))
      .catch(() => showToast("Copy failed"));
  };

  const shareQR = async () => {
    const content = generateQRContent();
    if (!content) return;
    try {
      const finalCanvas = await getCompositeCanvas(512);
      if (!finalCanvas) return;
      const blob = await new Promise<Blob>((resolve) =>
        finalCanvas.toBlob((b) => resolve(b!), "image/png")
      );
      const file = new File([blob], "qr-code.png", { type: "image/png" });
      // Try file sharing first; fall back to URL sharing
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "QR Code" });
      } else {
        await navigator.share({ url: content, title: "QR Code" });
      }
    } catch (err) {
      // AbortError = user cancelled — not a real failure
      if ((err as Error)?.name !== "AbortError") {
        showToast("Share not supported on this browser");
      }
    }
  };

  const embedQR = async () => {
    const content = generateQRContent();
    if (!content) return;
    try {
      const finalCanvas = await getCompositeCanvas(320);
      if (!finalCanvas) return;
      const dataUri = finalCanvas.toDataURL("image/png");
      const html = `<img src="${dataUri}" alt="QR Code" width="${finalCanvas.width}" height="${finalCanvas.height}" />`;
      await navigator.clipboard.writeText(html);
      showToast("Embed code copied!");
    } catch {
      showToast("Failed to generate embed code");
    }
  };

  const printQR = async () => {
    const content = generateQRContent();
    if (!content) return;
    try {
      const finalCanvas = await getCompositeCanvas(512);
      if (!finalCanvas) return;
      const dataUri = finalCanvas.toDataURL("image/png");
      const win = window.open("", "_blank");
      if (!win) return;
      win.document.write(
        `<html><head><title>QR Code</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;}img{max-width:100%;}</style></head><body><img src="${dataUri}" onload="window.print()" /></body></html>`
      );
      win.document.close();
    } catch {
      showToast("Print failed");
    }
  };

  const saveDesign = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const snapshot = canvas.toDataURL("image/png", 0.7);
    const design: SavedDesign = {
      id: Date.now().toString(),
      name: randomName(),
      snapshot,
    };
    setSavedDesigns((prev) => [...prev, design]);
    showToast(`Saved as "${design.name}"`);
  };

  const loadDesign = (id: string) => {
    const design = savedDesigns.find((d) => d.id === id);
    if (design) setPreviewDesign(design.snapshot);
  };

  const removeDesign = (id: string) => {
    setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  const renameDesign = (id: string, name: string) => {
    setSavedDesigns((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name } : d))
    );
  };

  const reorderDesigns = (next: SavedDesign[]) => {
    setSavedDesigns(next);
  };

  const addRecentColor = useCallback((color: string) => {
    setRecentColors((prev) => {
      if (prev[0] === color) return prev;
      const next = [color, ...prev.filter((c) => c !== color)].slice(0, 8);
      localStorage.setItem("qr-recent-colors", JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => { addRecentColor(qrColors.foreground); }, [qrColors.foreground, addRecentColor]);
  useEffect(() => { addRecentColor(qrColors.background); }, [qrColors.background, addRecentColor]);

  const clearAll = () => {
    setQrData({});
    setQrType("URL");
    setStyleState(INITIAL_STYLE_STATE);
    showToast("Reset to defaults");
  };

  const randomizeStyle = () => {
    const theme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
    const DOT_STYLES: DotStyle[] = ["square", "rounded", "dots", "classy", "classy-rounded", "extra-rounded"];
    const CSQ_STYLES: CornerSquareStyle[] = ["square", "dot", "rounded", "extra-rounded", "classy", "classy-rounded"];
    const CDT_STYLES: CornerDotStyle[] = ["square", "dot", "rounded"];
    setStyleState((prev) => ({
      qrColors: theme.colors,
      qrStyles: {
        ...prev.qrStyles,
        dotStyle: DOT_STYLES[Math.floor(Math.random() * DOT_STYLES.length)],
        cornerSquareStyle: CSQ_STYLES[Math.floor(Math.random() * CSQ_STYLES.length)],
        cornerDotStyle: CDT_STYLES[Math.floor(Math.random() * CDT_STYLES.length)],
      },
    }));
    showToast("Style randomized!");
  };

  const shareViaUrl = () => {
    const config = {
      v: 1,
      qrType,
      qrData,
      qrColors,
      qrStyles: { ...qrStyles, logoFile: null, backgroundImage: null },
    };
    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
      const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("Share link copied! (logo & bg not included)"))
        .catch(() => showToast("Copy failed"));
    } catch {
      showToast("Failed to generate link");
    }
  };

  const captureSnapshot = (): string | null => {
    const canvas = canvasRef.current?.querySelector("canvas");
    return canvas ? canvas.toDataURL("image/png", 0.85) : null;
  };

  const openFullscreen = () => {
    const snap = captureSnapshot();
    if (!snap) { showToast("Generate a QR code first"); return; }
    setCurrentSnapshot(snap);
    setShowFullscreen(true);
  };

  const openSurface = () => {
    const snap = captureSnapshot();
    if (!snap) { showToast("Generate a QR code first"); return; }
    setCurrentSnapshot(snap);
    setShowSurface(true);
  };

  const openReliability = () => {
    const snap = captureSnapshot();
    if (!snap) { showToast("Generate a QR code first"); return; }
    setCurrentSnapshot(snap);
    setShowReliability(true);
  };

  const applyTemplate = (template: QrTemplate) => {
    setQrType(template.qrType);
    setQrData(template.qrData as QrData);
    setStyleState((prev) => ({
      ...prev,
      qrColors: template.qrColors,
    }));
    showToast(`Template "${template.name}" applied!`);
  };

  const contentByteLength = new TextEncoder().encode(generateQRContent()).length;

  return (
    <div className="app-container">
      <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
      <motion.div
        className={`left-panel${leftCollapsed ? " panel-collapsed" : ""}`}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <button
          className="panel-collapse-btn panel-collapse-btn--left"
          onClick={() => setLeftCollapsed((v) => !v)}
          title={leftCollapsed ? "Expand panel" : "Collapse panel"}
        >
          {leftCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
        </button>
        <div className="panel-inner">
          <h1 className="app-title">QR Generator</h1>
          <p className="app-subtitle">Generate &amp; customize QR codes</p>
          <QRTypeSelector qrType={qrType} setQrType={setQrType} />
          <InputSection
            qrType={qrType}
            qrData={qrData}
            setQrData={setQrData}
            onAutoDetect={(type, data) => {
              setQrType(type);
              setQrData(data as QrData);
              const labels: Partial<Record<typeof type, string>> = {
                SPOTIFY: "Spotify",
                YOUTUBE: "YouTube",
                WHATSAPP: "WhatsApp",
                ZOOM: "Zoom",
                APPSTORE: "App Store",
              };
              showToast(`Switched to ${labels[type] ?? type} QR`);
            }}
          />
          <CustomizationSection
            qrColors={qrColors}
            setQrColors={setQrColors}
            qrStyles={qrStyles}
            setQrStyles={setQrStyles}
            recentColors={recentColors}
            onColorUsed={addRecentColor}
          />
        </div>
      </motion.div>
      <motion.div
        className="center-panel"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
      >
        <div className="center-panel-content">
          <QRPreview
            canvasRef={canvasRef}
            phonePreview={phonePreview}
            backgroundImage={qrStyles.backgroundImage}
            previewSize={previewSize}
            invertPreview={invertPreview}
            colorBlindMode={colorBlindMode}
          />
          <DownloadSection
            format={format}
            onFormatChange={setFormat}
            onDownload={downloadQRCode}
            onCopy={copyQRCode}
            downloadSize={downloadSize}
            onSizeChange={setDownloadSize}
            captionText={captionText}
            onCaptionChange={setCaptionText}
          />
        </div>
      </motion.div>
      <motion.div
        className={`right-panel${rightCollapsed ? " panel-collapsed" : ""}`}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
      >
        <button
          className="panel-collapse-btn panel-collapse-btn--right"
          onClick={() => setRightCollapsed((v) => !v)}
          title={rightCollapsed ? "Expand panel" : "Collapse panel"}
        >
          {rightCollapsed ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
        </button>
        <div className="panel-inner">
        <ExtraActions
          onCopyText={copyText}
          onShare={shareQR}
          onEmbed={embedQR}
          onPrint={printQR}
          onShowHistory={() => setShowHistory(true)}
          onShowBatch={() => setShowBatch(true)}
          onShowScan={() => setShowScan(true)}
          onClearAll={clearAll}
          onRandomize={randomizeStyle}
          onShareLink={shareViaUrl}
          onShowShortcuts={() => setShowShortcuts(true)}
          onShowTemplates={() => setShowTemplates(true)}
          onShowSurface={openSurface}
          onShowReliability={openReliability}
          onShowFullscreen={openFullscreen}
          canShare={"share" in navigator}
          phonePreview={phonePreview}
          onTogglePhone={() => setPhonePreview((p) => !p)}
          invertPreview={invertPreview}
          onToggleInvert={() => setInvertPreview((v) => !v)}
          colorBlindMode={colorBlindMode}
          onColorBlindChange={setColorBlindMode}
          previewSize={previewSize}
          onSizeChange={setPreviewSize}
        />
        <SavedDesigns
          designs={savedDesigns}
          onLoad={loadDesign}
          onRemove={removeDesign}
          onSave={saveDesign}
          onRename={renameDesign}
          onReorder={reorderDesigns}
        />
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            className="toast"
            role="status"
            aria-live="polite"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <OnboardingTooltip />

      <AnimatePresence>
        {previewDesign && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDesign(null)}
          >
            <motion.div
              className="design-preview-modal"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={previewDesign} alt="Saved design preview" />
              <motion.button
                className="design-preview-close"
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewDesign(null)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && (
          <HistoryPanel
            history={history}
            onRestore={(type, data, colors, styles) => {
              setQrType(type);
              setQrData(data);
              setStyleState({ qrColors: colors, qrStyles: styles });
              setShowHistory(false);
            }}
            onRemove={removeEntry}
            onClear={clearHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBatch && (
          <BatchPanel
            qrColors={qrColors}
            qrStyles={qrStyles}
            onClose={() => setShowBatch(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScan && (
          <ScanPanel
            onUseContent={(content) => {
              setQrType("URL");
              setQrData({ url: content });
            }}
            onClose={() => setShowScan(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShortcuts && <ShortcutsPanel onClose={() => setShowShortcuts(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showTemplates && (
          <TemplateGallery
            onApply={applyTemplate}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSurface && currentSnapshot && (
          <SurfacePreview snapshot={currentSnapshot} onClose={() => setShowSurface(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReliability && currentSnapshot && (
          <ReliabilityPanel snapshot={currentSnapshot} onClose={() => setShowReliability(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFullscreen && currentSnapshot && (
          <motion.div
            className="modal-overlay fullscreen-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullscreen(false)}
          >
            <motion.img
              src={currentSnapshot}
              className="fullscreen-qr-img"
              alt="QR code fullscreen"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
