'use client';

import { useMemo, useState } from "react";
import {
  createHaloAdapter,
  haloCommandToPrettyText,
  HaloConnectionState,
  HaloDirection,
} from "@/lib/halo-sdk";

type LogEntry = {
  id: number;
  text: string;
};

type Template = {
  name: string;
  text: string;
  direction: HaloDirection;
  distance: number;
};

const templates: Template[] = [
  { name: "Navigation", text: "Turn right in 120 meters", direction: "right", distance: 120 },
  { name: "Status", text: "Battery 82%", direction: "up", distance: 0 },
  { name: "Minimal", text: "Incoming signal", direction: "left", distance: 35 },
];

export default function HaloStudio() {
  const halo = useMemo(() => createHaloAdapter(), []);
  const [state, setState] = useState<HaloConnectionState>("disconnected");
  const [text, setText] = useState("Hello Halo");
  const [direction, setDirection] = useState<HaloDirection>("up");
  const [distance, setDistance] = useState(150);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, text: "Valmis. Tämä on mock-tila, kunnes vaihdat oikean Halo-bridge-kerroksen." },
  ]);
  const [liveTemplate, setLiveTemplate] = useState(templates[0]);

  const pushLog = (message: string) => {
    setLogs((current) => [{ id: Date.now() + Math.random(), text: message }, ...current].slice(0, 7));
  };

  const connect = async () => {
    try {
      setState("connecting");
      await halo.connect();
      setState(halo.mode === "mock" ? "mock" : "connected");
      pushLog(`Connected via ${halo.mode} transport.`);
    } catch (error) {
      setState("disconnected");
      pushLog(error instanceof Error ? error.message : "Connection failed.");
    }
  };

  const disconnect = async () => {
    await halo.disconnect();
    setState("disconnected");
    pushLog("Disconnected.");
  };

  const sendText = async () => {
    await halo.showText(text);
    pushLog(`HUD text: ${text}`);
  };

  const sendArrow = async () => {
    await halo.showArrow(direction, distance);
    pushLog(`HUD arrow: ${direction} / ${distance}m`);
  };

  const clear = async () => {
    await halo.clear();
    pushLog("HUD cleared.");
  };

  const sendCustom = async () => {
    const command = {
      type: "custom" as const,
      payload: {
        title: liveTemplate.name,
        text: liveTemplate.text,
        direction: liveTemplate.direction,
        distanceMeters: liveTemplate.distance,
      },
    };
    await halo.sendCustom(command);
    pushLog(haloCommandToPrettyText(command));
  };

  const previewArrow = direction === "up" ? "↑" : direction === "right" ? "→" : direction === "down" ? "↓" : "←";

  return (
    <main className="shell">
      <section className="hero">
        <div className="heroTop">
          <div>
            <div className="eyebrow">GitHub + Vercel + Halo SDK starter kit</div>
            <h1>Build your own Halo SDK foundation.</h1>
            <p className="lede">
              Tämä paketti on tehty niin, että voit tehdä oman SDK-kerroksen, dokumentaation ja demon yhdestä repositoriosta.
              Mock-tila toimii heti, ja myöhemmin vaihdat vain yhden adapterin oikeaan Brilliant-yhteyteen.
            </p>
            <div className="badgeRow" style={{ marginTop: 18 }}>
              <span className="badge">Next.js app router</span>
              <span className="badge">TypeScript strict</span>
              <span className="badge">Vercel-ready</span>
              <span className="badge">Adapter architecture</span>
            </div>
          </div>
          <div className="sidebarCard">
            <h2 className="cardTitle">Project shape</h2>
            <p className="cardText">
              Pidä SDK, demo ja docs samassa repossa. GitHub hoitaa versionhallinnan, Vercel hoitaa julkaisun.
            </p>
            <div className="hr" />
            <div className="small mono">
              /app<br />
              /components<br />
              /lib<br />
              README.md<br />
              package.json
            </div>
          </div>
        </div>
      </section>

      <div className="grid">
        <section className="panel">
          <div className="sectionHead">
            <h2 className="cardTitle">Live SDK studio</h2>
            <span className={`pill ${state}`}>State: {state}</span>
          </div>

          <p className="cardText">
            Tästä voit testata viestejä, joita myöhemmin ohjaat oikealle laitteelle. Nyt kaikki näkyy turvallisesti mock-tilassa.
          </p>

          <div className="statusRow" style={{ marginTop: 12 }}>
            <span className="pill">Adapter: {halo.mode}</span>
            <span className="pill">Realtime preview</span>
          </div>

          <div className="actions" style={{ marginTop: 16 }}>
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect} className="ghost">Disconnect</button>
            <button onClick={clear} className="ghost">Clear HUD</button>
          </div>

          <label>
            HUD text
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Hello Halo" />
          </label>

          <div className="controlsRow" style={{ marginTop: 12 }}>
            <button onClick={sendText}>Show text</button>
            <button onClick={sendCustom} className="ghost">Send template</button>
          </div>

          <label>
            Direction
            <select value={direction} onChange={(e) => setDirection(e.target.value as HaloDirection)}>
              <option value="up">Up</option>
              <option value="right">Right</option>
              <option value="down">Down</option>
              <option value="left">Left</option>
            </select>
          </label>

          <label>
            Distance in meters
            <input
              type="number"
              min={0}
              step={1}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
            />
          </label>

          <div className="controlsRow" style={{ marginTop: 12 }}>
            <button onClick={sendArrow}>Show arrow</button>
          </div>

          <div style={{ marginTop: 18 }} className="previewBox">
            <div className="sectionHead" style={{ marginBottom: 0 }}>
              <h3 className="cardTitle">HUD preview</h3>
              <span className="small">what the command represents</span>
            </div>
            <div className="previewHud">
              <div>
                <div className="previewArrow">{previewArrow}</div>
                <div style={{ fontSize: "1.08rem", fontWeight: 800 }}>{text}</div>
                <div className="small">distance: {distance} m</div>
              </div>
            </div>
          </div>
        </section>

        <aside className="sidebarStack">
          <section className="sidebarCard">
            <h2 className="cardTitle">Recommended SDK API</h2>
            <p className="cardText">
              Pidä yksi adapteri rajapintana. Silloin vaihdat mockin oikeaan laitteeseen ilman että UI hajoaa.
            </p>
            <pre className="prebox mono">{`interface HaloAdapter {
  connect(): Promise<void>;
  showText(text: string): Promise<void>;
  showArrow(direction: HaloDirection, distanceMeters?: number): Promise<void>;
  clear(): Promise<void>;
}`}</pre>
          </section>

          <section className="sidebarCard">
            <h2 className="cardTitle">Templates</h2>
            <div className="chips" style={{ marginBottom: 12 }}>
              {templates.map((template) => (
                <button
                  key={template.name}
                  className="ghost smallBtn"
                  onClick={() => {
                    setLiveTemplate(template);
                    setText(template.text);
                    setDirection(template.direction);
                    setDistance(template.distance);
                    pushLog(`Template loaded: ${template.name}`);
                  }}
                >
                  {template.name}
                </button>
              ))}
            </div>
            <div className="metricGrid">
              <div className="metric"><strong>3</strong><span className="small">ready-made prompts</span></div>
              <div className="metric"><strong>1</strong><span className="small">SDK boundary</span></div>
              <div className="metric"><strong>0</strong><span className="small">vendor lock-in in UI</span></div>
            </div>
          </section>

          <section className="sidebarCard">
            <h2 className="cardTitle">Activity log</h2>
            <div className="logList">
              {logs.map((entry) => (
                <div key={entry.id} className="logItem">{entry.text}</div>
              ))}
            </div>
          </section>

          <section className="sidebarCard">
            <div className="footerRow">
              <div>
                <h2 className="cardTitle">GitHub → Vercel flow</h2>
                <div className="small">1. push to GitHub</div>
                <div className="small">2. import repo in Vercel</div>
                <div className="small">3. deploy automatically</div>
              </div>
              <div className="pill mock">starter</div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
