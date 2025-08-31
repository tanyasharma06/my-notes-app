import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  resize: (mode) => ipcRenderer.invoke("window:resize", mode)
});
