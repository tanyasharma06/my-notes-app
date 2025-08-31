import React, { useState } from "react";
import { useAuth, usePrefs } from "../store";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState(null);
  const { setAuth } = useAuth();
  const { setPrefs } = usePrefs();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "signup") {
        await api().post("/auth/signup", { username, password });
      }
      const { data } = await api().post("/auth/login", { username, password });
      setAuth({ token: data.token, user: data.user });
      setPrefs({ lastUser: data.user.username });
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>{mode === "login" ? "Login" : "Sign up"}</h2>
      <input placeholder="username" value={username} onChange={(e) => setU(e.target.value)} required />
      <input placeholder="password" type="password" value={password} onChange={(e) => setP(e.target.value)} required />
      <button type="submit">{mode === "login" ? "Login" : "Create account"}</button>
      <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        Switch to {mode === "login" ? "Signup" : "Login"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
