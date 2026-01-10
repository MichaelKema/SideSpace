import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [shortTime, setShortTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { timeStyle: "medium" })
  );

  const toggleFullscreen = useCallback(async () => {
    // Only available inside a Tauri desktop runtime
    const isTauri = "__TAURI_INTERNALS__" in window;
    if (!isTauri) return;

    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const win = getCurrentWindow();
    const isFullscreen = await win.isFullscreen();
    await win.setFullscreen(!isFullscreen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "F11") return;
      event.preventDefault();
      toggleFullscreen();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen]);

  useEffect(() => {
    const id = setInterval(() => {
      setShortTime(
        new Date().toLocaleTimeString("en-US", { timeStyle: "medium" })
      );
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h1 id="clock">{shortTime}</h1>
    </div>
  );
}

export default App;
