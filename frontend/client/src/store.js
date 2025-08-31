import { create } from "zustand";
import localforage from "localforage";

export const useAuth = create((set) => {
  // Load initial state from localStorage
  const storedToken = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : null;

  return {
    token: storedToken,
    user: storedUser,
    setAuth: (auth) => {
      set(auth);
      localStorage.setItem('authToken', auth.token);
      localStorage.setItem('authUser', JSON.stringify(auth.user));
    },
    logout: () => {
      set({ token: null, user: null });
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  };
});

export const usePrefs = create((set, get) => ({
  theme: "light",
  fontSize: 16,
  lastUser: null,
  setPrefs: (p) => set({ ...get(), ...p })
}));

export const notesCache = localforage.createInstance({ name: "notes-cache" });
