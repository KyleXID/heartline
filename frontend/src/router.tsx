import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import TargetsPage from "@/pages/TargetsPage";
import HistoryPage from "@/pages/HistoryPage";
import UploadPage from "@/pages/UploadPage";
import ReportPage from "@/pages/ReportPage";
import OnboardingPage from "@/pages/OnboardingPage";
import DemoPage from "@/pages/DemoPage";
import OAuthCallbackPage from "@/pages/OAuthCallbackPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public pages (everyone)
      { index: true, element: <HomePage /> },
      { path: "demo", element: <DemoPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
      { path: "oauth/kakao/callback", element: <OAuthCallbackPage /> },

      // Auth pages (redirect to /upload if authenticated)
      {
        element: <PublicRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },

      // Protected pages (redirect to /login if not authenticated)
      {
        element: <PrivateRoute />,
        children: [
          { path: "upload", element: <UploadPage /> },
          { path: "targets", element: <TargetsPage /> },
          { path: "history", element: <HistoryPage /> },
          { path: "report/:conversationId", element: <ReportPage /> },
        ],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
