import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [shortTime, setShortTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { timeStyle: "medium" })
  );

  const toggleFullscreen = useCallback(async () => {
    const isTauri = "__TAURI_INTERNALS__" in window;

    // Tauri fullscreen
    if (isTauri) {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const win = getCurrentWindow();
      const isFullscreen = await win.isFullscreen();
      await win.setFullscreen(!isFullscreen);
      return;
    }

    // Web fullscreen (Cloudflare Pages)
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // F11 in browsers is special; some browsers won’t let JS fully override it.
      
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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        userSelect: "none",
      }}
      title="Click to toggle fullscreen"
      onClick={() => toggleFullscreen()}
    >
      <h1 id="clock">{shortTime}</h1>
    </div>
  );
}

export default App;
