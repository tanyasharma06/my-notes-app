import React, { useEffect } from "react";
import { usePrefs } from "../store";

export default function Settings() {
  const { theme, fontSize, setPrefs, lastUser } = usePrefs();

  useEffect(() => {
    const saved = localStorage.getItem("prefs");
    if (saved) setPrefs(JSON.parse(saved));
  }, [setPrefs]);

  useEffect(() => {
    localStorage.setItem("prefs", JSON.stringify({ theme, fontSize, lastUser }));
  }, [theme, fontSize, lastUser]);

  return (
    <div>
      <h3>Preferences</h3>
      <div>
        <label>Theme:&nbsp;</label>
        <select value={theme} onChange={(e) => setPrefs({ theme: e.target.value })}>
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Font size:&nbsp;</label>
        <input type="number" value={fontSize} onChange={(e) => setPrefs({ fontSize: Number(e.target.value) })} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Last user:&nbsp;</label>
        <input value={lastUser || ""} onChange={(e) => setPrefs({ lastUser: e.target.value })} />
      </div>
    </div>
  );
}
