import { useState, useEffect } from "react";

const STORAGE_KEY = "qr-onboarded";

const STEPS = [
  {
    title: "Pick your QR type",
    desc: "Choose from 17 types — URL, WiFi, vCard, Crypto, and more. Scroll the strip to see all options.",
  },
  {
    title: "Customize the look",
    desc: "Set colors, gradients, dot styles, background images, frames, and upload a logo.",
  },
  {
    title: "Download or share",
    desc: "Export as PNG, SVG, or JPEG. Copy to clipboard, share on mobile, or print as PDF.",
  },
];

export default function OnboardingTooltip() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <div
      className="onboarding-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div className="onboarding-card">
        <div className="onboarding-progress">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`onboarding-pip ${i === step ? "active" : i < step ? "done" : ""}`}
            />
          ))}
        </div>
        <h2 className="onboarding-title">{current.title}</h2>
        <p className="onboarding-desc">{current.desc}</p>
        <div className="onboarding-actions">
          <button className="onboarding-skip" onClick={dismiss}>
            Skip
          </button>
          {step < STEPS.length - 1 ? (
            <button
              className="onboarding-next"
              onClick={() => setStep((s) => s + 1)}
            >
              Next →
            </button>
          ) : (
            <button className="onboarding-next" onClick={dismiss}>
              Get started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
