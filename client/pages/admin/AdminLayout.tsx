import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/home", label: "Homepage" },
  { to: "/admin/about", label: "Who We Are" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/contact", label: "Contact" },
  { to: "/admin/policies", label: "Policies" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if no token
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && location.pathname !== "/admin/login") {
      navigate("/admin/login");
    }
  }, [location.pathname, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r border-primary/20 p-4">
        <div className="font-extrabold text-lg">Admin</div>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? "bg-primary/10 text-primary" : "text-primary/80 hover:bg-primary/10"}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="mt-6 text-sm font-semibold text-red-300 hover:text-red-200">Logout</button>
      </aside>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
