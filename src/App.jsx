import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [shortTime, setShortTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { timeStyle: "medium" }),
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

    // Web fullscreen
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const goToTimer = useCallback(() => {
    const baseUrl = import.meta.env.BASE_URL ?? "/";
    const timerPath = `${baseUrl}pages/timer.html`;
    window.location.assign(timerPath);
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
        new Date().toLocaleTimeString("en-US", { timeStyle: "medium" }),
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
      }}
    >
      <div style={{ display: "grid", gap: "16px", placeItems: "center" }}>
        <h1 id="clock" style={{ margin: 0 }}>
          {shortTime}
        </h1>

        <button type="button" onClick={toggleFullscreen}>
          Toggle Fullscreen
        </button>
        <button id="timer" type="button" onClick={goToTimer}>
          Timer
        </button>
      </div>
    </div>
  );
}

export default App;
