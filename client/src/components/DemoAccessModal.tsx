import { useEffect, useRef, useState } from "react";
import { XMarkIcon, KeyIcon, DocumentDuplicateIcon, CheckIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import Toast from "./Toast";
import { demoCredentials } from "../constants/demoCredentials";

interface DemoAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CopiedFieldKey = string | null;

export default function DemoAccessModal({ isOpen, onClose }: DemoAccessModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<CopiedFieldKey>(null);

  // Handle ESC key and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const copyToClipboard = async (text: string, label: string, fieldKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: `✓ ${label} copied` });

      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (err) {
      setToast({ message: "Failed to copy" });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="presentation">
        <div
          ref={dialogRef}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-access-title"
          aria-describedby="demo-access-description">
          {/* Header */}
          <div className="px-6 sm:px-8 py-6 sm:py-8 border-b border-gray-200 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Icon Container */}
              <div className="p-3 bg-blue-50 rounded-xl flex-shrink-0">
                <KeyIcon className="h-6 w-6 text-blue-600" />
              </div>

              {/* Titles */}
              <div>
                <h2
                  id="demo-access-title"
                  className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Demo Access
                </h2>
                <div
                  id="demo-access-description"
                  className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Use these credentials to explore the application.
                  </p>
                  <p className="text-sm text-gray-500">
                    All data is fictional and intended only for demonstration purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Close demo access">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-8 sm:py-10 space-y-8">
            {/* Credentials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoCredentials.map((account) => (
                <div
                  key={account.key}
                  className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:border-gray-300 transition-colors">
                  {/* Role Header */}
                  <div className="mb-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${account.accentColor} p-2 rounded-lg`}>
                        <KeyIcon className={`h-5 w-5 ${account.colorClass}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {account.role}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {account.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-200 my-5" />

                  {/* Credentials */}
                  <div className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-gray-300 rounded-lg px-3 py-3">
                        <code className="text-sm text-gray-900 font-mono flex-1">
                          {account.email}
                        </code>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              account.email,
                              `${account.role} email`,
                              `${account.key}-email`
                            )
                          }
                          title="Copy email"
                          aria-label={`Copy ${account.role.toLowerCase()} email`}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600 flex-shrink-0">
                          {copiedField === `${account.key}-email` ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <DocumentDuplicateIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-gray-300 rounded-lg px-3 py-3">
                        <code className="text-sm text-gray-900 font-mono flex-1">
                          {account.password}
                        </code>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              account.password,
                              `${account.role} password`,
                              `${account.key}-password`
                            )
                          }
                          title="Copy password"
                          aria-label={`Copy ${account.role.toLowerCase()} password`}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600 flex-shrink-0">
                          {copiedField === `${account.key}-password` ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <DocumentDuplicateIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tip Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 flex items-start gap-3">
              <LightBulbIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Tip: Click any copy icon to quickly paste the credentials into the login form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
