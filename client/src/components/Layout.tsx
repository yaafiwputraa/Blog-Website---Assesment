import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-200 px-4 py-6 font-sans text-sm text-neutral-500 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">Blog Platform</div>
      </footer>
    </div>
  );
}
