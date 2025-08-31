import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth, usePrefs } from "./store";

export default function App() {
  const { user, logout } = useAuth();
  const { theme, fontSize } = usePrefs();
  const nav = useNavigate();

  return (
    <div className="app" style={{ fontSize, background: theme === "dark" ? "#0b0b0b" : "#fff", color: theme === "dark" ? "#fff" : "#111" }}>
      <header>
        <Link to="/">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/settings">Settings</Link>
        <div className="logout-btn">
          <button onClick={() => window.electronAPI?.resize("compact")}>Compact</button>
          <button onClick={() => window.electronAPI?.resize("expand")}>Expand</button>
          {user && <button onClick={() => { logout(); nav("/"); }}>Logout</button>}
        </div>
      </header>
      <main><Outlet /></main>
      <footer>© NotesApp</footer>
    </div>
  );
}
