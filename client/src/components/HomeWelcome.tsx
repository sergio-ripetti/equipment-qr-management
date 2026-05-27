import {
  QrCodeIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export default function HomeWelcome() {
  return (
    <div className="mt-8 bg-white border border-gray-100 rounded-xl shadow-sm p-8">
      <div className="text-center max-w-2xl mx-auto">
        {/* Main icon */}
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <QrCodeIcon className="w-8 h-8 text-blue-700" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Scan or Search Equipment
        </h2>

        <p className="text-gray-500 mt-3">
          Search by equipment name, code, brand, model, serial number, or
          location to quickly access machine details and maintenance history.
        </p>
      </div>

      {/* Quick information cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
          <MagnifyingGlassIcon className="w-7 h-7 text-blue-700 mx-auto mb-2" />

          <h3 className="font-semibold text-gray-800">Search equipment</h3>

          <p className="text-sm text-gray-500 mt-1">
            Find machines by name, code, brand, or location.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
          <QrCodeIcon className="w-7 h-7 text-blue-700 mx-auto mb-2" />

          <h3 className="font-semibold text-gray-800">Open QR details</h3>

          <p className="text-sm text-gray-500 mt-1">
            Each equipment item has a QR code linked to its detail page.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
          <WrenchScrewdriverIcon className="w-7 h-7 text-blue-700 mx-auto mb-2" />

          <h3 className="font-semibold text-gray-800">Track maintenance</h3>

          <p className="text-sm text-gray-500 mt-1">
            Review service history and add new maintenance records.
          </p>
        </div>
      </div>
    </div>
  );
}
