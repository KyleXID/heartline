import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import TargetsPage from "@/pages/TargetsPage";
import HistoryPage from "@/pages/HistoryPage";
import UploadPage from "@/pages/UploadPage";
import ReportPage from "@/pages/ReportPage";
import OnboardingPage from "@/pages/OnboardingPage";
import DemoPage from "@/pages/DemoPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "targets", element: <TargetsPage /> },
      { path: "history", element: <HistoryPage /> },
      { path: "upload", element: <UploadPage /> },
      { path: "report/:conversationId", element: <ReportPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
      { path: "demo", element: <DemoPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
