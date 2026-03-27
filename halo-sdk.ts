export type HaloDirection = "left" | "right" | "up" | "down";
export type HaloConnectionState = "disconnected" | "connecting" | "connected" | "mock";
export type HaloTransportKind = "mock" | "brilliant";

export interface HaloCommandEnvelope {
  type: "text" | "arrow" | "clear" | "custom";
  payload: Record<string, unknown>;
}

export interface HaloAdapter {
  readonly mode: HaloTransportKind;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  showText(text: string): Promise<void>;
  showArrow(direction: HaloDirection, distanceMeters?: number): Promise<void>;
  clear(): Promise<void>;
  sendCustom(command: HaloCommandEnvelope): Promise<void>;
}

class MockHaloAdapter implements HaloAdapter {
  readonly mode = "mock" as const;

  async connect() {
    await sleep(250);
  }

  async disconnect() {
    await sleep(120);
  }

  async showText(text: string) {
    console.info("[Halo mock] text", text);
  }

  async showArrow(direction: HaloDirection, distanceMeters = 0) {
    console.info("[Halo mock] arrow", { direction, distanceMeters });
  }

  async clear() {
    console.info("[Halo mock] clear");
  }

  async sendCustom(command: HaloCommandEnvelope) {
    console.info("[Halo mock] custom", command);
  }
}

class BrilliantHaloAdapter extends MockHaloAdapter {
  readonly mode = "brilliant" as const;
}

export function createHaloAdapter(options?: { preferRealTransport?: boolean }): HaloAdapter {
  if (options?.preferRealTransport && typeof window !== "undefined") {
    return new BrilliantHaloAdapter();
  }

  return new MockHaloAdapter();
}

export function haloCommandToPrettyText(command: HaloCommandEnvelope): string {
  return `${command.type.toUpperCase()} ${JSON.stringify(command.payload)}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
