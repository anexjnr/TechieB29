import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import Layout from "./components/site/Layout";
import LoadingScreen from "./components/site/LoadingScreen";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Products = lazy(() => import("./pages/Products"));
const Clients = lazy(() => import("./pages/Clients"));
const Insights = lazy(() => import("./pages/Insights"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const LegalTerms = lazy(() => import("./pages/LegalTerms"));
const LegalPolicy = lazy(() => import("./pages/LegalPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AboutAdmin = lazy(() => import("./pages/admin/AboutAdmin"));
const TestimonialsAdmin = lazy(() => import("./pages/admin/TestimonialsAdmin"));
const UsersAdmin = lazy(() => import("./pages/admin/UsersAdmin"));
const HomepageAdmin = lazy(() => import("./pages/admin/HomepageAdmin"));
const PoliciesAdmin = lazy(() => import("./pages/admin/PoliciesAdmin"));
const ContactAdmin = lazy(() => import("./pages/admin/ContactAdmin"));
const ApplicationsAdmin = lazy(() => import("./pages/admin/ApplicationsAdmin"));

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/about", element: <About /> },
      { path: "/products", element: <Products /> },
      { path: "/services", element: <Services /> },
      { path: "/clients", element: <Clients /> },
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
      { path: "/admin/testimonials", element: <TestimonialsAdmin /> },
      { path: "/admin/home", element: <HomepageAdmin /> },
      { path: "/admin/contact", element: <ContactAdmin /> },
      { path: "/admin/policies", element: <PoliciesAdmin /> },
      { path: "/admin/applications", element: <ApplicationsAdmin /> },
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
      <Suspense fallback={<LoadingScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
