import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import BackgroundOrnaments from "@/components/site/BackgroundOrnaments";

export default function Layout() {
  return (
    <div className="min-h-screen text-primary relative">
      <BackgroundOrnaments />
      <div className="relative z-20">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
