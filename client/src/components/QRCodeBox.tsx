import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/solid";

import ActionButton from "./ActionButton";

type QRSizeKey = "small" | "medium" | "large";

type QRSizeOption = {
  label: string;
  pixels: number;
  printSize: string;
};

const QR_SIZE_OPTIONS: Record<QRSizeKey, QRSizeOption> = {
  small: {
    label: "Small - 2 cm x 2 cm",
    pixels: 120,
    printSize: "2cm",
  },
  medium: {
    label: "Medium - 4 cm x 4 cm",
    pixels: 180,
    printSize: "4cm",
  },
  large: {
    label: "Large - 6 cm x 6 cm",
    pixels: 260,
    printSize: "6cm",
  },
};

type QRCodeBoxProps = {
  machineId: string;
  displayId?: string;
  machineName?: string;
  machineLocation?: string;
  size?: number;
  showId?: boolean;
  showDownload?: boolean;
  showPrint?: boolean;
  showSizeSelector?: boolean;
  className?: string;
};

export default function QRCodeBox({
  machineId,
  displayId,
  machineName = "",
  machineLocation = "",
  size = 180,
  showId = true,
  showDownload = false,
  showPrint = false,
  showSizeSelector = false,
  className = "",
}: QRCodeBoxProps) {
  const qrRef = useRef<HTMLDivElement | null>(null);

  // Stores selected QR size option
  const [selectedSize, setSelectedSize] = useState<QRSizeKey>("medium");

  const BASE_URL = window.location.origin;
  const qrValue = `${BASE_URL}/public/machine/${machineId}`;
  const visibleId = displayId || machineId;

  const selectedQrOption = QR_SIZE_OPTIONS[selectedSize];

  // Uses selected size when selector is visible, otherwise uses the size prop
  const qrPixelSize = showSizeSelector ? selectedQrOption.pixels : size;
  const qrPrintSize = showSizeSelector ? selectedQrOption.printSize : "4cm";

  // Downloads the QR code canvas as a PNG image
  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");

    if (!canvas) return;

    const imageUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");

    downloadLink.href = imageUrl;
    downloadLink.download = `${visibleId}-qr-code.png`;
    downloadLink.click();
  };

  // Opens a print window with a simple QR label
  const handlePrintQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");

    if (!canvas) return;

    const imageUrl = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank", "width=500,height=700");

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - ${visibleId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f8fafc;
            }

            .label {
              border: 2px solid #111827;
              border-radius: 16px;
              padding: 24px;
              text-align: center;
              background: #ffffff;
              display: inline-block;
            }

            .title {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 6px;
              color: #111827;
              max-width: 280px;
            }

            .code {
              font-size: 13px;
              color: #4b5563;
              margin-bottom: 14px;
            }

            .qr {
              width: ${qrPrintSize};
              height: ${qrPrintSize};
              margin: 0 auto 14px auto;
              display: block;
            }

            .info {
              font-size: 13px;
              color: #111827;
              margin-top: 6px;
            }

            .muted {
              color: #6b7280;
              font-size: 11px;
              margin-top: 14px;
            }

            @media print {
              body {
                background: #ffffff;
              }

              .label {
                box-shadow: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="label">
            <div class="title">${machineName || "Ripe Deli Equipment"}</div>
            <div class="code">ID: ${visibleId}</div>

            <img class="qr" src="${imageUrl}" alt="QR Code" />

            ${
              machineLocation
                ? `<div class="info"><strong>Location:</strong> ${machineLocation}</div>`
                : ""
            }

            <div class="muted">Scan to view equipment details</div>
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div
      className={`flex flex-col items-center gap-3 ${className}`}
      ref={qrRef}>
      {/* QR size selector */}
      {showSizeSelector && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            QR size
          </label>

          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value as QRSizeKey)}
            className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            {Object.entries(QR_SIZE_OPTIONS).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* QR code generated from the public machine detail URL */}
      <QRCodeCanvas
        value={qrValue}
        size={qrPixelSize}
        bgColor="#ffffff"
        fgColor="#1e3a8a"
        level="H"
      />

      {/* Optional machine ID text */}
      {showId && <p className="text-sm text-gray-500">ID: {visibleId}</p>}

      {/* Optional QR actions */}
      {(showDownload || showPrint) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {showDownload && (
            <ActionButton variant="primary" onClick={handleDownloadQR}>
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download QR
            </ActionButton>
          )}

          {showPrint && (
            <ActionButton variant="outline" onClick={handlePrintQR}>
              <PrinterIcon className="w-4 h-4" />
              Print QR
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
}
