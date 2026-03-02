import { memo, useState, Dispatch, SetStateAction, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDropzone } from "react-dropzone";
import { FiChevronDown } from "react-icons/fi";
import {
  TbSquare,
  TbSquareRounded,
  TbCircleDot,
  TbDiamond,
  TbBorderRadius,
} from "react-icons/tb";
import { RiRadioButtonLine } from "react-icons/ri";
import type {
  QrColors,
  QrStyles,
  CornerSquareStyle,
  CornerDotStyle,
  FrameTemplate,
} from "../types";
import { COLOR_THEMES } from "../constants/themes";

// ── Contrast ratio helpers ─────────────────────────────
function hexToLinear(hex: string): number {
  const c = parseInt(hex.slice(1), 16);
  const r = (c >> 16) & 255;
  const g = (c >> 8) & 255;
  const b = c & 255;
  return [r, g, b].reduce((sum, ch) => {
    const s = ch / 255;
    return sum + (s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4));
  }, 0) / 3; // simplified luminance
}
function contrastRatio(fg: string, bg: string): number {
  try {
    const l1 = hexToLinear(fg);
    const l2 = hexToLinear(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 0;
  }
}

interface CustomizationSectionProps {
  qrColors: QrColors;
  setQrColors: Dispatch<SetStateAction<QrColors>>;
  qrStyles: QrStyles;
  setQrStyles: Dispatch<SetStateAction<QrStyles>>;
  recentColors: string[];
  onColorUsed: (color: string) => void;
}

const FRAME_STYLES: { id: CornerSquareStyle; name: string; icon: ReactNode }[] =
  [
    { id: "square", name: "Square", icon: <TbSquare /> },
    { id: "dot", name: "Dot", icon: <TbCircleDot /> },
    { id: "rounded", name: "Rounded", icon: <TbSquareRounded /> },
    { id: "extra-rounded", name: "Extra Round", icon: <RiRadioButtonLine /> },
    { id: "classy", name: "Classy", icon: <TbDiamond /> },
    { id: "classy-rounded", name: "Classy Round", icon: <TbBorderRadius /> },
  ];

const CORNER_DOT_STYLES: {
  id: CornerDotStyle;
  name: string;
  icon: ReactNode;
}[] = [
  { id: "square", name: "Square", icon: <TbSquare /> },
  { id: "dot", name: "Dot", icon: <TbCircleDot /> },
  { id: "rounded", name: "Rounded", icon: <TbSquareRounded /> },
];

const FRAME_TEMPLATES: { id: FrameTemplate; name: string }[] = [
  { id: "none", name: "None" },
  { id: "rounded", name: "Rounded" },
  { id: "badge", name: "Badge" },
  { id: "banner", name: "Banner" },
];

const sliderFill = (value: number, min: number, max: number) => ({
  background: `linear-gradient(to right, var(--primary-color) ${((value - min) / (max - min)) * 100}%, var(--border) ${((value - min) / (max - min)) * 100}%)`,
});

const CustomizationSection = memo(function CustomizationSection({
  qrColors,
  setQrColors,
  qrStyles,
  setQrStyles,
  recentColors,
  onColorUsed,
}: CustomizationSectionProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    themes: false,
    frame: true,
    corners: false,
    dots: false,
    colors: true,
    background: false,
    cta: false,
    logo: false,
  });

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  // Logo dropzone
  const onDropLogo = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setQrStyles((prev) => ({ ...prev, logoFile: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const {
    getRootProps: getLogoRootProps,
    getInputProps: getLogoInputProps,
    isDragActive: isLogoDragActive,
  } = useDropzone({
    onDrop: onDropLogo,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"] },
    multiple: false,
  });

  // Background image dropzone
  const onDropBg = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setQrStyles((prev) => ({
        ...prev,
        backgroundImage: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const {
    getRootProps: getBgRootProps,
    getInputProps: getBgInputProps,
    isDragActive: isBgDragActive,
  } = useDropzone({
    onDrop: onDropBg,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"] },
    multiple: false,
  });

  const AccordionSection = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: ReactNode;
  }) => (
    <div className="customization-group">
      <button
        className="accordion-btn"
        onClick={() => toggle(id)}
        aria-expanded={open[id]}
      >
        <h4>{title}</h4>
        <motion.span
          animate={{ rotate: open[id] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex", color: "var(--text-faint)" }}
        >
          <FiChevronDown />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open[id] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingTop: 16 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="customization-wrapper">
      <h3 className="section-title">Customize QR Code</h3>

      {/* Color Themes */}
      <AccordionSection id="themes" title="Color Themes">
        <div className="themes-grid">
          {COLOR_THEMES.map((theme) => (
            <button
              key={theme.name}
              className="theme-swatch"
              title={theme.name}
              onClick={() => {
                setQrColors(theme.colors);
                setQrStyles((prev) => ({
                  ...prev,
                  gradientColors: [...theme.gradientColors],
                }));
              }}
              aria-label={`Apply ${theme.name} theme`}
            >
              <span
                className="theme-swatch-fg"
                style={{ background: theme.colors.foreground }}
              />
              <span
                className="theme-swatch-bg"
                style={{ background: theme.colors.background }}
              />
              <span className="theme-swatch-name">{theme.name}</span>
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Frame Style */}
      <AccordionSection id="frame" title="Frame Style">
        <div className="qr-types">
          {FRAME_STYLES.map((style) => (
            <button
              key={style.id}
              className={`qr-type-btn ${qrStyles.cornerSquareStyle === style.id ? "active" : ""}`}
              onClick={() =>
                setQrStyles((prev) => ({ ...prev, cornerSquareStyle: style.id }))
              }
              aria-label={`Frame style: ${style.name}`}
              aria-pressed={qrStyles.cornerSquareStyle === style.id}
            >
              <div className="qr-type-icon">{style.icon}</div>
              {style.name}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Corner Dots */}
      <AccordionSection id="corners" title="Corner Dots">
        <div className="qr-types">
          {CORNER_DOT_STYLES.map((style) => (
            <button
              key={style.id}
              className={`qr-type-btn ${qrStyles.cornerDotStyle === style.id ? "active" : ""}`}
              onClick={() =>
                setQrStyles((prev) => ({ ...prev, cornerDotStyle: style.id }))
              }
              aria-label={`Corner dot style: ${style.name}`}
              aria-pressed={qrStyles.cornerDotStyle === style.id}
            >
              <div className="qr-type-icon">{style.icon}</div>
              {style.name}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Dot Pattern */}
      <AccordionSection id="dots" title="Dot Pattern">
        <div className="corner-row">
          <label htmlFor="dot-pattern">Style</label>
          <div className="custom-select-wrapper">
            <select
              id="dot-pattern"
              value={qrStyles.dotStyle}
              onChange={(e) =>
                setQrStyles((prev) => ({
                  ...prev,
                  dotStyle: e.target.value as QrStyles["dotStyle"],
                }))
              }
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
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* Colors & Gradients */}
      <AccordionSection id="colors" title="Colors &amp; Gradients">
        <div className="color-section">
          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div className="recent-colors-row">
              <span className="recent-colors-label">Recent</span>
              <div className="recent-colors">
                {recentColors.map((c) => (
                  <button
                    key={c}
                    className="recent-color-swatch"
                    style={{ background: c }}
                    title={c}
                    onClick={() => {
                      setQrColors((prev) => ({ ...prev, foreground: c }));
                      onColorUsed(c);
                    }}
                    aria-label={`Use color ${c}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="gradient-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={qrStyles.useGradient}
                onChange={(e) =>
                  setQrStyles((prev) => ({
                    ...prev,
                    useGradient: e.target.checked,
                  }))
                }
              />
              <span>Use Gradient</span>
            </label>
          </div>

          {qrStyles.useGradient ? (
            <div className="gradient-controls">
              {/* Gradient stops */}
              {qrStyles.gradientColors.map((color, idx) => (
                <div key={idx} className="color-row">
                  <label>Stop {idx + 1}</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) =>
                        setQrStyles((prev) => {
                          const next = [...prev.gradientColors];
                          next[idx] = e.target.value;
                          return { ...prev, gradientColors: next };
                        })
                      }
                      className="color-picker"
                      aria-label={`Gradient stop ${idx + 1}`}
                    />
                    <span className="color-hex">{color}</span>
                    {qrStyles.gradientColors.length > 2 && (
                      <button
                        className="stop-remove-btn"
                        onClick={() =>
                          setQrStyles((prev) => ({
                            ...prev,
                            gradientColors: prev.gradientColors.filter(
                              (_, i) => i !== idx
                            ),
                          }))
                        }
                        aria-label="Remove stop"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {qrStyles.gradientColors.length < 5 && (
                <button
                  className="stop-add-btn"
                  onClick={() =>
                    setQrStyles((prev) => ({
                      ...prev,
                      gradientColors: [...prev.gradientColors, "#888888"],
                    }))
                  }
                >
                  + Add color stop
                </button>
              )}
              <div className="slider-row">
                <label htmlFor="gradient-rotation">Rotation</label>
                <input
                  id="gradient-rotation"
                  type="range"
                  min="0"
                  max="360"
                  value={qrStyles.gradientRotation}
                  onChange={(e) =>
                    setQrStyles((prev) => ({
                      ...prev,
                      gradientRotation: parseInt(e.target.value),
                    }))
                  }
                  className="gradient-slider"
                  style={sliderFill(qrStyles.gradientRotation, 0, 360)}
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
                  onChange={(e) => {
                    setQrColors((prev) => ({ ...prev, foreground: e.target.value }));
                    onColorUsed(e.target.value);
                  }}
                  className="color-picker"
                  aria-label="Foreground color"
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
                onChange={(e) => {
                  setQrColors((prev) => ({ ...prev, background: e.target.value }));
                  onColorUsed(e.target.value);
                }}
                className="color-picker"
                aria-label="Background color"
              />
              <span className="color-hex">{qrColors.background}</span>
            </div>
          </div>

          {/* Contrast checker */}
          {(() => {
            const fg = qrStyles.useGradient ? qrStyles.gradientColors[0] : qrColors.foreground;
            const ratio = contrastRatio(fg, qrColors.background);
            const rating = ratio >= 4.5 ? "good" : ratio >= 3 ? "warn" : "poor";
            const label = ratio >= 4.5 ? "Excellent" : ratio >= 3 ? "Caution" : "Poor";
            return (
              <div className="contrast-row">
                <span className="contrast-label">Scan contrast</span>
                <span className={`contrast-badge contrast-${rating}`}>
                  {ratio.toFixed(1)}:1 — {label}
                </span>
              </div>
            );
          })()}
        </div>
      </AccordionSection>

      {/* Background Image */}
      <AccordionSection id="background" title="Background Image">
        <div className="logo-section">
          <div
            {...getBgRootProps()}
            className={`dropzone ${isBgDragActive ? "active" : ""} ${qrStyles.backgroundImage ? "has-file" : ""}`}
          >
            <input {...getBgInputProps()} aria-label="Upload background image" />
            {qrStyles.backgroundImage ? (
              <div className="dropzone-content">
                <img
                  src={qrStyles.backgroundImage}
                  alt="Background preview"
                  className="logo-preview"
                />
                <p>Drop a new image or click to change</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQrStyles((prev) => ({ ...prev, backgroundImage: null }));
                  }}
                  className="remove-logo-btn"
                  aria-label="Remove background image"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="dropzone-content">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="upload-icon"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                  <path
                    d="M21 15l-5-5L5 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p>
                  {isBgDragActive
                    ? "Drop image here"
                    : "Drop background image or click to upload"}
                </p>
                <span>PNG, JPG, SVG up to 5MB</span>
              </div>
            )}
          </div>

          {qrStyles.backgroundImage && (
            <div className="slider-row">
              <label htmlFor="bg-opacity">Opacity</label>
              <input
                id="bg-opacity"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={qrStyles.backgroundOpacity}
                onChange={(e) =>
                  setQrStyles((prev) => ({
                    ...prev,
                    backgroundOpacity: parseFloat(e.target.value),
                  }))
                }
                className="logo-slider"
                style={sliderFill(qrStyles.backgroundOpacity, 0.1, 1)}
              />
              <span>{Math.round(qrStyles.backgroundOpacity * 100)}%</span>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Frame / CTA */}
      <AccordionSection id="cta" title="Frame &amp; CTA Text">
        <div className="color-section">
          <div className="corner-row">
            <label htmlFor="frame-template">Template</label>
            <div className="custom-select-wrapper">
              <select
                id="frame-template"
                value={qrStyles.frameTemplate}
                onChange={(e) =>
                  setQrStyles((prev) => ({
                    ...prev,
                    frameTemplate: e.target.value as FrameTemplate,
                  }))
                }
                className="custom-select"
              >
                {FRAME_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="select-arrow">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {qrStyles.frameTemplate !== "none" && (
            <>
              <div className="cta-input-row">
                <label htmlFor="frame-text">Text</label>
                <input
                  id="frame-text"
                  type="text"
                  placeholder="Scan me!"
                  value={qrStyles.frameText}
                  onChange={(e) =>
                    setQrStyles((prev) => ({
                      ...prev,
                      frameText: e.target.value,
                    }))
                  }
                  className="url-input cta-text-input"
                />
              </div>

              <div className="corner-row">
                <label htmlFor="frame-position">Position</label>
                <div className="custom-select-wrapper">
                  <select
                    id="frame-position"
                    value={qrStyles.frameTextPosition}
                    onChange={(e) =>
                      setQrStyles((prev) => ({
                        ...prev,
                        frameTextPosition: e.target.value as "top" | "bottom",
                      }))
                    }
                    className="custom-select"
                  >
                    <option value="bottom">Bottom</option>
                    <option value="top">Top</option>
                  </select>
                  <div className="select-arrow">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="color-row">
                <label>Frame color</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={qrStyles.frameColor}
                    onChange={(e) =>
                      setQrStyles((prev) => ({
                        ...prev,
                        frameColor: e.target.value,
                      }))
                    }
                    className="color-picker"
                    aria-label="Frame color"
                  />
                  <span className="color-hex">{qrStyles.frameColor}</span>
                </div>
              </div>

              <div className="color-row">
                <label>Text color</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={qrStyles.frameFontColor}
                    onChange={(e) =>
                      setQrStyles((prev) => ({
                        ...prev,
                        frameFontColor: e.target.value,
                      }))
                    }
                    className="color-picker"
                    aria-label="Frame text color"
                  />
                  <span className="color-hex">{qrStyles.frameFontColor}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </AccordionSection>

      {/* Logo */}
      <AccordionSection id="logo" title="Logo">
        <div className="logo-section">
          <div
            {...getLogoRootProps()}
            className={`dropzone ${isLogoDragActive ? "active" : ""} ${qrStyles.logoFile ? "has-file" : ""}`}
          >
            <input {...getLogoInputProps()} aria-label="Upload logo image" />
            {qrStyles.logoFile ? (
              <div className="dropzone-content">
                <img
                  src={qrStyles.logoFile}
                  alt="Logo preview"
                  className="logo-preview"
                />
                <p>Drop a new image or click to change</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQrStyles((prev) => ({ ...prev, logoFile: null }));
                  }}
                  className="remove-logo-btn"
                  aria-label="Remove logo"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="dropzone-content">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="upload-icon"
                  aria-hidden="true"
                >
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10L12 5L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>
                  {isLogoDragActive
                    ? "Drop image here"
                    : "Drop logo here or click to upload"}
                </p>
                <span>PNG, JPG, SVG up to 5MB</span>
              </div>
            )}
          </div>

          {qrStyles.logoFile && (
            <div className="logo-controls">
              <div className="slider-row">
                <label htmlFor="logo-size">Size</label>
                <input
                  id="logo-size"
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={qrStyles.logoSize}
                  onChange={(e) =>
                    setQrStyles((prev) => ({
                      ...prev,
                      logoSize: parseFloat(e.target.value),
                    }))
                  }
                  className="logo-slider"
                  style={sliderFill(qrStyles.logoSize, 0.1, 0.5)}
                />
                <span>{Math.round(qrStyles.logoSize * 100)}%</span>
              </div>
              <div className="slider-row">
                <label htmlFor="logo-margin">Margin</label>
                <input
                  id="logo-margin"
                  type="range"
                  min="0"
                  max="20"
                  value={qrStyles.logoMargin}
                  onChange={(e) =>
                    setQrStyles((prev) => ({
                      ...prev,
                      logoMargin: parseInt(e.target.value),
                    }))
                  }
                  className="logo-slider"
                  style={sliderFill(qrStyles.logoMargin, 0, 20)}
                />
                <span>{qrStyles.logoMargin}px</span>
              </div>
            </div>
          )}
        </div>
      </AccordionSection>
    </div>
  );
});

export default CustomizationSection;
