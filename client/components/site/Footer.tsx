import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 bg-gradient-to-t from-black/20 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="font-extrabold text-lg text-primary/100">AUIO</div>
          <p className="text-sm text-primary/90 mt-2 max-w-sm">Clean, minimal, bold systems for modern companies.</p>
        </div>
        <nav className="flex gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-primary/100">Company</span>
            <Link to="/about" className="text-primary/80 hover:text-primary/100">About</Link>
            <Link to="/careers" className="text-primary/80 hover:text-primary/100">Careers</Link>
            <Link to="/contact" className="text-primary/80 hover:text-primary/100">Contact</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-primary/100">Legal</span>
            <Link to="/legal/terms" className="text-primary/80 hover:text-primary/100">Terms & Conditions</Link>
            <Link to="/legal/policy" className="text-primary/80 hover:text-primary/100">Public Policy</Link>
          </div>
        </nav>
      </div>
      <div className="border-t border-primary/10 py-4 text-center text-xs text-primary/70">
        © {new Date().getFullYear()} AUIO. All rights reserved.
      </div>
    </footer>
  );
}
