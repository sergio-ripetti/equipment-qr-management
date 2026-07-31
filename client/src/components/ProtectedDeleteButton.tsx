import { useState } from "react";
import ActionButton from "./ActionButton";

const TOOLTIP_MESSAGE = "This demo equipment cannot be deleted.";

export default function ProtectedDeleteButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMobileToast, setShowMobileToast] = useState(false);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  const handleFocus = () => setShowTooltip(true);
  const handleBlur = () => setShowTooltip(false);

  const handleMobileClick = () => {
    setShowMobileToast(true);
    setTimeout(() => setShowMobileToast(false), 3000);
  };

  return (
    <div className="relative w-full md:w-auto">
      {/* Focusable wrapper for protected delete control */}
      <div
        tabIndex={0}
        role="button"
        aria-disabled="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleMobileClick}
        onKeyDown={(e) => {
          // Prevent any interaction attempts
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
        aria-describedby="delete-protection-tooltip"
        className="group relative">
        {/* Disabled Delete Button */}
        <ActionButton variant="danger" disabled={true} fullWidthMobile={true}>
          Delete Equipment
        </ActionButton>

        {/* Desktop Tooltip - Right-aligned to prevent clipping */}
        {showTooltip && (
          <div
            id="delete-protection-tooltip"
            role="tooltip"
            className="absolute z-50 bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-md shadow-lg pointer-events-none animate-fade-in max-w-[240px]"
            style={{
              animation: "fadeIn 150ms ease-in-out",
              wordWrap: "break-word",
            }}>
            {TOOLTIP_MESSAGE}
            {/* Tooltip arrow - positioned at right side */}
            <div className="absolute top-full right-3 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900" />
          </div>
        )}
      </div>

      {/* Mobile Toast - shown when clicked on mobile */}
      {showMobileToast && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 bg-slate-900 text-white text-sm px-4 py-3 rounded-md shadow-lg animate-fade-in z-50">
          {TOOLTIP_MESSAGE}
        </div>
      )}

      {/* CSS animations injected via style tag */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 150ms ease-in-out;
        }
      `}</style>
    </div>
  );
}
