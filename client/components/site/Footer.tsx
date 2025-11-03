import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-primary/20 bg-gradient-to-t from-black/20 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Top: Brand + Nav + Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="font-extrabold text-lg text-primary/100 tracking-tight">TBT</div>
            <p className="text-sm text-primary/90 mt-2 max-w-sm">
              Clean, minimal, bold systems for modern companies.
            </p>

            {/* Socials */}
            <ul className="mt-5 flex items-center gap-3">
              <li>
                <a
                  href="#"
                  aria-label="TBT on Twitter"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary/80 hover:text-primary/100 border border-primary/20 hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <Twitter className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="TBT on Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary/80 hover:text-primary/100 border border-primary/20 hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="TBT on LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary/80 hover:text-primary/100 border border-primary/20 hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <Linkedin className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="TBT on GitHub"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary/80 hover:text-primary/100 border border-primary/20 hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <Github className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="TBT on YouTube"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary/80 hover:text-primary/100 border border-primary/20 hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <Youtube className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <nav className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-primary/100">Company</span>
              <Link to="/about" className="text-primary/80 hover:text-primary/100">
                About
              </Link>
              <Link to="/careers" className="text-primary/80 hover:text-primary/100">
                Careers
              </Link>
              <Link to="/contact" className="text-primary/80 hover:text-primary/100">
                Contact
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-primary/100">Resources</span>
              <a href="#" className="text-primary/80 hover:text-primary/100">
                Help Center
              </a>
              <a href="#" className="text-primary/80 hover:text-primary/100">
                Status
              </a>
              <a href="#" className="text-primary/80 hover:text-primary/100">
                Docs
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-primary/100">Legal</span>
              <Link to="/legal/terms" className="text-primary/80 hover:text-primary/100">
                Terms & Conditions
              </Link>
              <Link to="/legal/policy" className="text-primary/80 hover:text-primary/100">
                Public Policy
              </Link>
              <a href="#" className="text-primary/80 hover:text-primary/100">
                Privacy
              </a>
            </div>
          </nav>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <span className="font-semibold text-primary/100">Stay in the loop</span>
            <p className="text-xs text-primary/80 mt-2">
              Monthly product updates and case studies. No spam.
            </p>
            <form
              className="mt-4 flex flex-col sm:flex-row w-full max-w-md gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                <label htmlFor="newsletter" className="sr-only">
                  Work email
                </label>
                <input
                  id="newsletter"
                  type="email"
                  required
                  placeholder="Work email"
                  className="w-full rounded-xl border border-primary/20 bg-transparent px-10 py-2 text-sm text-primary/100 placeholder:text-primary/60 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary/100 hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 w-full sm:w-auto"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-[11px] leading-5 text-primary/70">
              We respect your privacy.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-primary/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary/70">
          <div>© {new Date().getFullYear()} TBT. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/legal/terms" className="hover:text-primary/100">
              Terms
            </Link>
            <Link to="/legal/policy" className="hover:text-primary/100">
              Public Policy
            </Link>
            <a href="#" className="hover:text-primary/100">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
