import { useEffect, useRef, useState } from "react";

export default function ToolsPanel() {
  const [tab, setTab] = useState<"timer" | "stopwatch">("timer");

  return (
    <div className="tools-panel">
      <div className="tools-tabs">
        <button
          className={`tab ${tab === "timer" ? "active" : ""}`}
          onClick={() => setTab("timer")}
        >
          Timer
        </button>
        <button
          className={`tab ${tab === "stopwatch" ? "active" : ""}`}
          onClick={() => setTab("stopwatch")}
        >
          Stopwatch
        </button>
      </div>
      <div className="tools-body">
        {tab === "timer" && <Timer />}
        {tab === "stopwatch" && <Stopwatch />}
      </div>
    </div>
  );
}

function Timer() {
  const [minutes, setMinutes] = useState(5);
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current as number);
    };
  }, []);

  const start = () => {
    setRemaining(minutes * 60);
    if (timerRef.current) clearInterval(timerRef.current as number);
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (timerRef.current) clearInterval(timerRef.current as number);
          timerRef.current = null;
          try {
            if (
              typeof Notification !== "undefined" &&
              Notification.permission === "granted"
            ) {
              new Notification("Timer finished", {
                body: `${minutes} minute(s) elapsed`,
              });
            }
          } catch {}
          return 0;
        }
        return r - 1;
      });
    }, 1000) as unknown as number;
  };

  const format = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="timer tool-row">
      <label style={{ marginRight: 8 }}>Minutes:</label>
      <input
        type="number"
        value={minutes}
        min={1}
        onChange={(e) => setMinutes(Number(e.target.value))}
        className="timer-input"
      />

      <div className="timer-controls">
        <button className="tool-action-btn start" onClick={start}>
          Start
        </button>
        <button
          className="tool-action-btn stop"
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current as number);
            timerRef.current = null;
            setRemaining(0);
          }}
        >
          Stop
        </button>
        <button
          className="tool-action-btn reset"
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current as number);
            timerRef.current = null;
            setRemaining(0);
          }}
        >
          Reset
        </button>
      </div>

      <div className="timer-display digital-display">{format(remaining)}</div>
    </div>
  );
}

function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (ref.current) clearInterval(ref.current as number);
    };
  }, []);

  const start = () => {
    if (running) return;
    setRunning(true);
    const startAt = Date.now() - elapsed * 1000;
    ref.current = setInterval(
      () => setElapsed(Math.floor((Date.now() - startAt) / 1000)),
      200,
    ) as unknown as number;
  };
  const stop = () => {
    if (ref.current) clearInterval(ref.current as number);
    ref.current = null;
    setRunning(false);
  };
  const reset = () => {
    stop();
    setElapsed(0);
  };

  const format = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="stopwatch tool-row">
      <div className="stopwatch-display digital-display">{format(elapsed)}</div>

      <div className="stopwatch-controls">
        <button
          className="tool-action-btn start"
          onClick={start}
          disabled={running}
        >
          Start
        </button>
        <button
          className="tool-action-btn stop"
          onClick={stop}
          disabled={!running}
        >
          Stop
        </button>
        <button className="tool-action-btn reset" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
// Calendar removed per request
