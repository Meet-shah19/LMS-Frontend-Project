import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">

      <div className="text-center">

        <h1 className="text-8xl font-bold text-blue-600">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold">
          Page Not Found
        </h2>

        <p className="mt-2 text-muted">
          This page does not exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Back to Dashboard
        </Link>

      </div>

    </div>
  );
}

export default NotFound;