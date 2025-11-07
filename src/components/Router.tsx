import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { AIAssistant } from '@/components/ui/ai-assistant';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import AboutPage from '@/components/pages/AboutPage';
import ServicesPage from '@/components/pages/ServicesPage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import ContactPage from '@/components/pages/ContactPage';
import CareersPage from '@/components/pages/CareersPage';
import BlogPage from '@/components/pages/BlogPage';
import AdminDashboardPage from '@/components/pages/AdminDashboardPage';
import CaseStudiesPage from '@/components/pages/CaseStudiesPage';
import TestimonialsPage from '@/components/pages/TestimonialsPage';

// Layout component that includes ScrollToTop and AI Assistant
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
      <AIAssistant />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "careers",
        element: <CareersPage />,
      },
      {
        path: "case-studies",
        element: <CaseStudiesPage />,
      },
      {
        path: "testimonials",
        element: <TestimonialsPage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "admin",
        element: <AdminDashboardPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
