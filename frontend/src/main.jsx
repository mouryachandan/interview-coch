import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AlertProvider } from "./context/AlertContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlertProvider>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={2500}
        theme="colored"
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </AlertProvider>
  </React.StrictMode>
);
