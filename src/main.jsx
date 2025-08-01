import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Debug environment variables
import App from "./App.jsx";
import router from "./Route/router.jsx";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./Provider/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <ToastContainer />
  </StrictMode>
);
