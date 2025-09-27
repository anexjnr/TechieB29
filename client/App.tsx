import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { loader as indexLoader } from "./pages/Index";
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Insights = lazy(() => import("./pages/Insights"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const LegalTerms = lazy(() => import("./pages/LegalTerms"));
const LegalPolicy = lazy(() => import("./pages/LegalPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Layout = lazy(() => import("./components/site/Layout"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AboutAdmin = lazy(() => import("./pages/admin/AboutAdmin"));
const ServicesAdmin = lazy(() => import("./pages/admin/ServicesAdmin"));
const ProjectsAdmin = lazy(() => import("./pages/admin/ProjectsAdmin"));
const NewsAdmin = lazy(() => import("./pages/admin/NewsAdmin"));
const TestimonialsAdmin = lazy(() => import("./pages/admin/TestimonialsAdmin"));
const CareersAdmin = lazy(() => import("./pages/admin/CareersAdmin"));
const UsersAdmin = lazy(() => import("./pages/admin/UsersAdmin"));
const HomepageAdmin = lazy(() => import("./pages/admin/HomepageAdmin"));
const PoliciesAdmin = lazy(() => import("./pages/admin/PoliciesAdmin"));
const ContactAdmin = lazy(() => import("./pages/admin/ContactAdmin"));
const ApplicationsAdmin = lazy(() => import("./pages/admin/ApplicationsAdmin"));
const AssetsAdmin = lazy(() => import("./pages/admin/AssetsAdmin"));

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
      <Suspense fallback={
        <div>
          {(() => {
            const Comp = require("./components/site/LoadingScreen").default;
            return <Comp />;
          })()}
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
