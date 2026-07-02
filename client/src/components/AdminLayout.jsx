import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { useState } from "react";

import Logo from "./Logo";
import { clearToken } from "../services/auth";

const nav = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    to: "/admin/manage-subjects",
    label: "Subjects",
    icon: BookOpen,
  },
  {
    to: "/admin/manage-pdfs",
    label: "Manage PDFs",
    icon: FileText,
  },
  {
    to: "/admin/upload",
    label: "Upload PDF",
    icon: Upload,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  function isActive(to, exact = false) {
    return exact
      ? pathname === to
      : pathname === to || pathname.startsWith(to + "/");
  }

  function doLogout() {
    clearToken();
    navigate("/login");
  }

  const Sidebar = (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="mb-4 px-2">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const Icon = item.icon;

          const active = isActive(item.to, item.exact);

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={doLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );

  return (
    <div
      className="flex min-h-screen w-full"
      style={{
        background: "var(--background)",
      }}
    >
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/50 bg-sidebar md:block">
        {Sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border/50 bg-sidebar">
            {Sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="md:hidden">
            <Logo size={28} />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-sm font-semibold">
              A
            </div>

            <span className="hidden text-sm font-medium sm:inline">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
