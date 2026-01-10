import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [shortTime, setShortTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { timeStyle: "medium" })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setShortTime(
        new Date().toLocaleTimeString("en-US", { timeStyle: "medium" })
      );
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (

    <div >
      <h1 id="clock">{shortTime}</h1>
    </div>

  );
}

export default App;
