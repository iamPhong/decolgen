import { createBrowserRouter, Navigate } from "react-router-dom";
import ResizeByFileSize from "@/pages/ResizeByFileSize";
import GenerateImage from "@/pages/GenerateImage";
import App from "@/App";
import DrawPage from "@/pages/DrawPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/size" replace /> },
      { path: "size", element: <ResizeByFileSize /> },
      { path: "generateImage", element: <GenerateImage /> },
      { path: "draw", element: <DrawPage /> },
    ],
  },
]);
