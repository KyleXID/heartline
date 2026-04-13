import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UploadPage from "@/pages/UploadPage";
import ReportPage from "@/pages/ReportPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "upload", element: <UploadPage /> },
      { path: "report/:conversationId", element: <ReportPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
