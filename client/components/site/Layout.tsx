import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import BackgroundOrnaments from "@/components/site/BackgroundOrnaments";

export default function Layout() {
  return (
    <div className="min-h-screen text-primary relative">
      <BackgroundOrnaments />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
