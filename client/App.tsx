import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Insights from "./pages/Insights";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import LegalTerms from "./pages/LegalTerms";
import LegalPolicy from "./pages/LegalPolicy";
import NotFound from "./pages/NotFound";
import Layout from "./components/site/Layout";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AboutAdmin from "./pages/admin/AboutAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import NewsAdmin from "./pages/admin/NewsAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import CareersAdmin from "./pages/admin/CareersAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import HomepageAdmin from "./pages/admin/HomepageAdmin";
import PoliciesAdmin from "./pages/admin/PoliciesAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
import ApplicationsAdmin from "./pages/admin/ApplicationsAdmin";
import AssetsAdmin from "./pages/admin/AssetsAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal/terms" element={<LegalTerms />} />
            <Route path="/legal/policy" element={<LegalPolicy />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/about" element={<AboutAdmin />} />
            <Route path="/admin/services" element={<ServicesAdmin />} />
            <Route path="/admin/projects" element={<ProjectsAdmin />} />
            <Route path="/admin/news" element={<NewsAdmin />} />
            <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
            <Route path="/admin/careers" element={<CareersAdmin />} />
            <Route path="/admin/home" element={<HomepageAdmin />} />
            <Route path="/admin/contact" element={<ContactAdmin />} />
            <Route path="/admin/policies" element={<PoliciesAdmin />} />
            <Route path="/admin/applications" element={<ApplicationsAdmin />} />
            <Route path="/admin/assets" element={<AssetsAdmin />} />
            <Route path="/admin/users" element={<UsersAdmin />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;