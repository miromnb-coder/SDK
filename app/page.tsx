"use client";

import { useEffect, useMemo, useState } from "react";

type NavMode = "nav" | "scan" | "camera" | "focus";

type LogItem = {
  id: number;
  text: string;
  tone?: "good" | "info" | "warn";
};

const arrows = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [mode, setMode] = useState<NavMode>("nav");
  const [directionIndex, setDirectionIndex] = useState(0);
  const [distance, setDistance] = useState(128);
  const [battery, setBattery] = useState(87);
  const [signal, setSignal] = useState(94);
  const [logs, setLogs] = useState<LogItem[]>([
    { id: 1, text: "Halo SDK ready.", tone: "good" },
    { id: 2, text: "Waiting for device connection.", tone: "info" },
  ]);

  const direction = arrows[directionIndex % arrows.length];
  const modeLabel = useMemo(() => {
    switch (mode) {
      case "nav":
        return "Navigation";
      case "scan":
        return "Scan";
      case "camera":
        return "Camera";
      case "focus":
        return "Focus";
    }
  }, [mode]);

  const pushLog = (text: string, tone: LogItem["tone"] = "info") => {
    setLogs((prev) => [
      { id: Date.now() + Math.random(), text, tone },
      ...prev.slice(0, 5),
    ]);
  };

  const connect = () => {
    setConnected(true);
    pushLog("Connected to Halo transport.", "good");
  };

  const disconnect = () => {
    setConnected(false);
    pushLog("Disconnected.", "warn");
  };

  const cycleMode = () => {
    const next: NavMode =
      mode === "nav" ? "scan" : mode === "scan" ? "camera" : mode === "camera" ? "focus" : "nav";
    setMode(next);
    pushLog(`Mode changed to ${next}.`, "info");
  };

  const mockAction = (label: string) => {
    pushLog(`${label} triggered.`, "good");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirectionIndex((v) => v + 1);
      setDistance((v) => clamp(v + (Math.random() > 0.5 ? -7 : 6), 12, 260));
      setBattery((v) => clamp(v - (Math.random() > 0.92 ? 1 : 0), 1, 100));
      setSignal((v) => clamp(v + (Math.random() > 0.6 ? -2 : 1), 60, 100));
    }, 1700);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="halo-shell">
      <div className="halo-bg" />
      <div className="halo-noise" />

      <section className="topbar">
        <div>
          <div className="eyebrow">BRILLIANT / HALO DEV KIT</div>
          <h1>Halo SDK Platform</h1>
          <p>
            Minimal, futuristic HUD for demos, docs, and device-style interactions.
          </p>
        </div>

        <div className="status-card">
          <div className="status-row">
            <span className={`dot ${connected ? "on" : ""}`} />
            <span>{connected ? "Connected" : "Offline"}</span>
          </div>
          <div className="status-meta">
            <span>{modeLabel}</span>
            <span>{signal}% signal</span>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="panel hero">
          <div className="panel-header">
            <span className="panel-title">Live HUD</span>
            <span className="chip">{connected ? "device live" : "demo mode"}</span>
          </div>

          <div className="hud-stage">
            <div className="hud-core">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />

              <div className="arrow">{direction}</div>

              <div className="distance">
                {distance}
                <span>m</span>
              </div>

              <div className="subtitle">Walk this way</div>
            </div>

            <div className="hud-caption">
              <div className="caption-pill">GPS</div>
              <div className="caption-pill">Gyro</div>
              <div className="caption-pill">HUD</div>
            </div>
          </div>

          <div className="action-row">
            <button className="btn primary" onClick={connect}>
              Connect
            </button>
            <button className="btn" onClick={disconnect}>
              Disconnect
            </button>
            <button className="btn" onClick={cycleMode}>
              Change mode
            </button>
          </div>
        </div>

        <div className="panel side">
          <div className="panel-header">
            <span className="panel-title">Device status</span>
            <span className="chip">{battery}%</span>
          </div>

          <div className="stats">
            <div className="stat">
              <span className="label">Battery</span>
              <strong>{battery}%</strong>
            </div>
            <div className="stat">
              <span className="label">Signal</span>
              <strong>{signal}%</strong>
            </div>
            <div className="stat">
              <span className="label">Mode</span>
              <strong>{modeLabel}</strong>
            </div>
          </div>

          <div className="mini-actions">
            <button className="mini-btn" onClick={() => mockAction("Text overlay")}>
              Text
            </button>
            <button className="mini-btn" onClick={() => mockAction("Camera")}>
              Camera
            </button>
            <button className="mini-btn" onClick={() => mockAction("AI scan")}>
              AI
            </button>
          </div>

          <div className="docs-box">
            <div className="docs-title">SDK quick start</div>
            <pre>
{`const halo = new HaloSDK();

await halo.connect();
await halo.showHUD({
  direction: "right",
  distance: 42
});`}
            </pre>
          </div>
        </div>

        <div className="panel logs">
          <div className="panel-header">
            <span className="panel-title">Activity</span>
            <span className="chip">live feed</span>
          </div>

          <div className="log-list">
            {logs.map((item) => (
              <div key={item.id} className={`log-item ${item.tone ?? ""}`}>
                <span className="log-bullet" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
