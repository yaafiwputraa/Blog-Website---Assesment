import { useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { cx } from "../utils/classNames";
import { Button } from "./Button";

const navLinkClass =
  "border-b border-transparent px-1 py-2 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950";

interface NavigationLinkProps {
  to: string;
  children: ReactNode;
  onClick?: () => void;
}

function NavigationLink({ to, children, onClick }: NavigationLinkProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        cx(navLinkClass, isActive && "border-neutral-950 text-neutral-950")
      }
      onClick={onClick}
      to={to}
    >
      {children}
    </NavLink>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/");
  }

  const links = user ? (
    <>
      <NavigationLink onClick={() => setOpen(false)} to="/posts/new">
        New Post
      </NavigationLink>
      <NavigationLink onClick={() => setOpen(false)} to="/profile">
        Profile
      </NavigationLink>
      <span className="border-l border-neutral-300 pl-4 font-sans text-sm font-semibold text-neutral-900">
        {user.name}
      </span>
      <Button className="px-3 py-2" onClick={handleLogout} variant="outline">
        Logout
      </Button>
    </>
  ) : (
    <>
      <NavigationLink onClick={() => setOpen(false)} to="/login">
        Login
      </NavigationLink>
      <NavigationLink onClick={() => setOpen(false)} to="/register">
        Register
      </NavigationLink>
    </>
  );

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="font-serif text-2xl font-bold leading-none text-neutral-950"
          onClick={() => setOpen(false)}
          to="/"
        >
          Blog Platform
        </Link>

        <nav className="hidden items-center gap-5 md:flex">{links}</nav>

        <Button
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="px-3 py-2 md:hidden"
          onClick={() => setOpen((current) => !current)}
          variant="outline"
        >
          Menu
        </Button>
      </div>

      {open ? (
        <nav className="border-t border-neutral-200 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4">{links}</div>
        </nav>
      ) : null}
    </header>
  );
}
