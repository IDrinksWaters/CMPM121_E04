import type { GameScene } from "./game.ts";
import { Enemy } from "./actors.ts";

export interface Wave {
  time: number;
  kind: "drone" | "dart" | "turret" | "lancer";
  count: number;
  formation: "line" | "vee" | "column" | "pincer";
  startX?: number;
  spacing?: number;
  centerX?: number;
  x?: number;
  startY?: number;
  yStep?: number;
}

export interface Sector {
  name: string;
  subtitle: string;
  length: number;
  waves: Wave[];
}

export function spawnWave(scene: GameScene, t: number, wave: Wave): void {
  for (let i = 0; i < wave.count; i++) {
    let spawnTime = wave.time;
    let x = 0;
    let y = -30;

    if (wave.formation === "line") {
      spawnTime = wave.time;
      const spacing = wave.spacing ?? 64;
      const startX = wave.startX ?? 240;
      x = startX + (i - (wave.count - 1) / 2) * spacing;
      y = -30;
    } else if (wave.formation === "vee") {
      const center = (wave.count - 1) / 2;
      spawnTime = wave.time + Math.abs(i - center) * 10;
      const spacing = wave.spacing ?? 44;
      const centerX = wave.centerX ?? 240;
      x = centerX + (i - center) * spacing;
      y = -30;
    } else if (wave.formation === "column") {
      spawnTime = wave.time + i * 24;
      x = wave.x ?? 240;
      y = -30;
    } else if (wave.formation === "pincer") {
      spawnTime = wave.time + Math.floor(i / 2) * 30;
      x = i % 2 === 0 ? -30 : 510;
      y = (wave.startY ?? 70) + Math.floor(i / 2) * (wave.yStep ?? 50);
    }

    if (t === spawnTime) {
      const enemy = new Enemy(
        scene,
        x,
        y,
        wave.kind,
        x,
        i % 2 === 0 ? 1 : -1,
      );
      scene.enemies.push(enemy);
    }
  }
}

export const SECTORS: Sector[] = [
  {
    name: "Outer Drift",
    subtitle: "Scouts ahead",
    length: 1560,
    waves: [
      {
        time: 60,
        kind: "drone",
        count: 4,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      {
        time: 360,
        kind: "drone",
        count: 5,
        formation: "vee",
        centerX: 168,
        spacing: 44,
      },
      {
        time: 660,
        kind: "drone",
        count: 5,
        formation: "vee",
        centerX: 312,
        spacing: 44,
      },
      {
        time: 960,
        kind: "drone",
        count: 6,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      { time: 1200, kind: "drone", count: 4, formation: "column", x: 120 },
      { time: 1260, kind: "drone", count: 4, formation: "column", x: 360 },
    ],
  },
  {
    name: "Shatter Belt",
    subtitle: "Divers incoming",
    length: 1800,
    waves: [
      {
        time: 60,
        kind: "drone",
        count: 6,
        formation: "vee",
        centerX: 240,
        spacing: 44,
      },
      {
        time: 300,
        kind: "dart",
        count: 4,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      { time: 600, kind: "dart", count: 5, formation: "column", x: 144 },
      { time: 720, kind: "dart", count: 5, formation: "column", x: 336 },
      {
        time: 1020,
        kind: "drone",
        count: 7,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      {
        time: 1140,
        kind: "dart",
        count: 5,
        formation: "vee",
        centerX: 240,
        spacing: 44,
      },
      {
        time: 1440,
        kind: "dart",
        count: 6,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
    ],
  },
  {
    name: "Gun Lanes",
    subtitle: "Turrets online",
    length: 1920,
    waves: [
      {
        time: 60,
        kind: "turret",
        count: 1,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      {
        time: 240,
        kind: "drone",
        count: 6,
        formation: "vee",
        centerX: 240,
        spacing: 44,
      },
      {
        time: 540,
        kind: "turret",
        count: 2,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      { time: 840, kind: "dart", count: 6, formation: "column", x: 240 },
      {
        time: 1080,
        kind: "turret",
        count: 2,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      {
        time: 1140,
        kind: "drone",
        count: 6,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      {
        time: 1500,
        kind: "turret",
        count: 3,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
    ],
  },
  {
    name: "Lancer Gate",
    subtitle: "Crossfire",
    length: 1920,
    waves: [
      { time: 60, kind: "lancer", count: 4, formation: "pincer" },
      {
        time: 360,
        kind: "dart",
        count: 6,
        formation: "vee",
        centerX: 240,
        spacing: 44,
      },
      { time: 600, kind: "lancer", count: 6, formation: "pincer" },
      {
        time: 780,
        kind: "turret",
        count: 2,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      { time: 1140, kind: "lancer", count: 6, formation: "pincer" },
      {
        time: 1260,
        kind: "drone",
        count: 8,
        formation: "vee",
        centerX: 240,
        spacing: 44,
      },
      {
        time: 1560,
        kind: "dart",
        count: 8,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
    ],
  },
  {
    name: "Last Approach",
    subtitle: "Everything they have",
    length: 2040,
    waves: [
      {
        time: 60,
        kind: "turret",
        count: 3,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      { time: 180, kind: "lancer", count: 6, formation: "pincer" },
      { time: 540, kind: "dart", count: 6, formation: "column", x: 120 },
      { time: 540, kind: "dart", count: 6, formation: "column", x: 360 },
      {
        time: 900,
        kind: "drone",
        count: 9,
        formation: "vee",
        centerX: 240,
        spacing: 44,
      },
      {
        time: 1020,
        kind: "turret",
        count: 2,
        formation: "line",
        startX: 240,
        spacing: 64,
      },
      { time: 1320, kind: "lancer", count: 8, formation: "pincer" },
      {
        time: 1560,
        kind: "dart",
        count: 8,
        formation: "vee",
        centerX: 240,
        spacing: 44,
      },
    ],
  },
  {
    name: "The Warden",
    subtitle: "The Warden approaches",
    length: 0,
    waves: [],
  },
];
