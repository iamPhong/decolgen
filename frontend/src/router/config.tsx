import { createBrowserRouter, Navigate } from "react-router-dom";
import ResizeByFileSize from "@/pages/ResizeByFileSize";
import ResizeByDimensions from "@/pages/ResizeByDimensions";
import App from "@/App";
import DrawPage from "@/pages/DrawPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/size" replace /> },
      { path: "size", element: <ResizeByFileSize /> },
      { path: "dimensions", element: <ResizeByDimensions /> },
      { path: "draw", element: <DrawPage /> },
    ],
  },
]);
