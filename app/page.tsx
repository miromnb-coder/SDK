"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "Navigation" | "Scan" | "Camera" | "AI";
type Tone = "good" | "info" | "warn";

type LogItem = {
  id: number;
  text: string;
  tone: Tone;
};

const directions = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function modeDetails(mode: Mode) {
  switch (mode) {
    case "Navigation":
      return { label: "Navigation HUD", hint: "arrow + distance" };
    case "Scan":
      return { label: "Object Scan", hint: "quick detect mode" };
    case "Camera":
      return { label: "Camera View", hint: "capture preview" };
    case "AI":
      return { label: "AI Assist", hint: "analyze scene" };
  }
}

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [modeIndex, setModeIndex] = useState(0);
  const [directionIndex, setDirectionIndex] = useState(0);
  const [distance, setDistance] = useState(128);
  const [battery, setBattery] = useState(87);
  const [signal, setSignal] = useState(94);
  const [gps, setGps] = useState(12);
  const [latency, setLatency] = useState(28);
  const [logs, setLogs] = useState<LogItem[]>([
    { id: 1, text: "Halo SDK ready.", tone: "good" },
    { id: 2, text: "Demo simulator loaded.", tone: "info" },
    { id: 3, text: "Waiting for device connection.", tone: "warn" },
  ]);

  const modes: Mode[] = ["Navigation", "Scan", "Camera", "AI"];
  const mode = modes[modeIndex];
  const details = modeDetails(mode);
  const direction = directions[directionIndex % directions.length];

  const pushLog = (text: string, tone: Tone = "info") => {
    setLogs((prev) => [{ id: Date.now() + Math.random(), text, tone }, ...prev].slice(0, 6));
  };

  const connect = () => {
    setConnected(true);
    setGps(3);
    setLatency(18);
    pushLog("Connected to Halo transport.", "good");
  };

  const disconnect = () => {
    setConnected(false);
    setGps(15);
    setLatency(34);
    pushLog("Disconnected safely.", "warn");
  };

  const nextMode = () => {
    setModeIndex((i) => (i + 1) % modes.length);
    pushLog(`Mode changed to ${modes[(modeIndex + 1) % modes.length]}.`, "info");
  };

  const calibrate = () => {
    setDirectionIndex((v) => v + 2);
    setDistance(64);
    setGps(4);
    pushLog("HUD calibrated.", "good");
  };

  const mockAction = (label: string) => {
    pushLog(`${label} triggered.`, "good");
  };

  useEffect(() => {
    const id = setInterval(() => {
      setDirectionIndex((v) => v + 1);
      setDistance((v) => clamp(v + (Math.random() > 0.55 ? -8 : 7), 8, 260));
      setSignal((v) => clamp(v + (Math.random() > 0.65 ? -2 : 1), 62, 100));
      setBattery((v) =>
        connected ? clamp(v - (Math.random() > 0.82 ? 1 : 0), 20, 100) : clamp(v + 0.05, 20, 100)
      );
      setGps((v) => clamp(v + (connected ? (Math.random() > 0.7 ? -1 : 0) : 1), 2, 20));
      setLatency((v) => clamp(v + (connected ? (Math.random() > 0.7 ? 1 : -1) : 2), 12, 42));
    }, 1600);

    return () => clearInterval(id);
  }, [connected]);

  const batteryLabel = useMemo(() => `${Math.round(battery)}%`, [battery]);
  const signalLabel = useMemo(() => `${Math.round(signal)}%`, [signal]);
  const gpsLabel = useMemo(() => `${Math.round(gps)}m`, [gps]);
  const latencyLabel = useMemo(() => `${Math.round(latency)}ms`, [latency]);

  return (
    <main className="app-shell">
      <div className="bg-orb orb-a" />
      <div className="bg-orb orb-b" />
      <div className="noise" />

      <section className="topbar">
        <div>
          <div className="eyebrow">BRILLIANT / HALO DEV PLATFORM</div>
          <h1>Halo SDK</h1>
          <p>
            A premium simulator for building, demoing, and designing Halo-style experiences
            from a phone or browser.
          </p>
        </div>

        <div className="top-status">
          <div className={`status-dot ${connected ? "on" : ""}`} />
          <div className="top-status-text">
            <strong>{connected ? "Connected" : "Offline"}</strong>
            <span>{details.label}</span>
          </div>
        </div>
      </section>

      <section className="main-grid">
        <article className="panel hero">
          <div className="panel-head">
            <span className="panel-title">Live HUD</span>
            <span className="chip">{connected ? "device live" : "demo mode"}</span>
          </div>

          <div className="hud-frame">
            <div className="hud-glass" />
            <div className="hud-core">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />

              <div className="hud-topline">
                <span>{details.hint}</span>
                <span>{latencyLabel}</span>
              </div>

              <div className="hud-direction">{direction}</div>

              <div className="hud-distance">
                {Math.round(distance)}
                <span>m</span>
              </div>

              <div className="hud-subtitle">Turn by the arrow</div>

              <div className="hud-pills">
                <span>GPS {gpsLabel}</span>
                <span>SIG {signalLabel}</span>
                <span>BATT {batteryLabel}</span>
              </div>
            </div>
          </div>

          <div className="action-row">
            <button className="btn primary" onClick={connect}>
              Connect
            </button>
            <button className="btn" onClick={disconnect}>
              Disconnect
            </button>
            <button className="btn" onClick={nextMode}>
              Change mode
            </button>
            <button className="btn" onClick={calibrate}>
              Calibrate
            </button>
          </div>
        </article>

        <aside className="panel side">
          <div className="panel-head">
            <span className="panel-title">Telemetry</span>
            <span className="chip">{mode}</span>
          </div>

          <div className="stats">
            <div className="stat">
              <span className="stat-label">Battery</span>
              <strong>{batteryLabel}</strong>
            </div>
            <div className="stat">
              <span className="stat-label">Signal</span>
              <strong>{signalLabel}</strong>
            </div>
            <div className="stat">
              <span className="stat-label">GPS</span>
              <strong>{gpsLabel}</strong>
            </div>
            <div className="stat">
              <span className="stat-label">Latency</span>
              <strong>{latencyLabel}</strong>
            </div>
          </div>

          <div className="mini-actions">
            <button className="mini-btn" onClick={() => mockAction("Text overlay")}>
              Text
            </button>
            <button className="mini-btn" onClick={() => mockAction("Camera preview")}>
              Camera
            </button>
            <button className="mini-btn" onClick={() => mockAction("AI assist")}>
              AI
            </button>
            <button className="mini-btn" onClick={() => mockAction("Navigation")}>
              Nav
            </button>
          </div>

          <div className="docs-card">
            <div className="docs-title">SDK quick start</div>
            <pre>{`const halo = new HaloSDK();

await halo.connect();

await halo.showHUD({
  direction: "right",
  distance: 42,
  mode: "navigation"
});`}</pre>
          </div>
        </aside>

        <section className="panel feed">
          <div className="panel-head">
            <span className="panel-title">Activity feed</span>
            <span className="chip">live</span>
          </div>

          <div className="feed-list">
            {logs.map((item) => (
              <div key={item.id} className={`feed-item ${item.tone}`}>
                <span className="feed-bullet" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
