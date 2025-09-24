import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index, { loader as indexLoader } from "./pages/Index";
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

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Index />, loader: indexLoader },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
      { path: "/insights", element: <Insights /> },
      { path: "/careers", element: <Careers /> },
      { path: "/contact", element: <Contact /> },
      { path: "/legal/terms", element: <LegalTerms /> },
      { path: "/legal/policy", element: <LegalPolicy /> },
    ],
  },
  { path: "/admin/login", element: <AdminLogin /> },
  {
    element: <AdminLayout />,
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/about", element: <AboutAdmin /> },
      { path: "/admin/services", element: <ServicesAdmin /> },
      { path: "/admin/projects", element: <ProjectsAdmin /> },
      { path: "/admin/news", element: <NewsAdmin /> },
      { path: "/admin/testimonials", element: <TestimonialsAdmin /> },
      { path: "/admin/careers", element: <CareersAdmin /> },
      { path: "/admin/home", element: <HomepageAdmin /> },
      { path: "/admin/contact", element: <ContactAdmin /> },
      { path: "/admin/policies", element: <PoliciesAdmin /> },
      { path: "/admin/applications", element: <ApplicationsAdmin /> },
      { path: "/admin/assets", element: <AssetsAdmin /> },
      { path: "/admin/users", element: <UsersAdmin /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
