import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-800">Page not found</h1>

      <p className="text-gray-500 mt-3">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
        Back to Home
      </Link>
    </div>
  );
}
