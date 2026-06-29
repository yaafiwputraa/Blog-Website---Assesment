import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl border border-neutral-300 p-8 text-center">
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800">
        404
      </p>
      <h1 className="font-serif text-5xl font-bold text-neutral-950">Page Not Found</h1>
      <p className="mt-4 font-sans text-sm leading-6 text-neutral-600">
        The page you are looking for does not exist.
      </p>
      <Link
        className="mt-6 inline-flex items-center justify-center border border-neutral-950 bg-neutral-950 px-4 py-2 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-red-800 hover:bg-red-800"
        to="/"
      >
        Back home
      </Link>
    </div>
  );
}
