import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const Layout = lazy(() => import("./components/site/Layout"));

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Index /> },
    ],
  },
  { path: "*", element: <div>Not found</div> },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </QueryClientProvider>
);

export default App;
