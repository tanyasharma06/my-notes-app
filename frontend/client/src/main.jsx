import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Setting.jsx";
import "./index.css";
import "./App.css";

const router = createBrowserRouter([
  { path: "/", element: <App />, children: [
    { index: true, element: <Login /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "settings", element: <Settings /> }
  ] }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
