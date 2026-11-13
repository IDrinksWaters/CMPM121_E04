import Phaser from "phaser";
import { HEIGHT, WIDTH } from "../actors.ts";
import { TINTS } from "../textures.ts";
import type { Hud } from "../hud.ts";
import type { LaunchOptions } from "../main.ts";
import { play } from "../sounds.ts";
import { Backdrop } from "./backdrop.ts";
import { fadeAndStart } from "./boot.ts";

const STORY: [number, string][] = [
  [0.8, "The Warden's lights go dark, one ring at a time."],
  [4.2, "Behind you, five sectors of open sky."],
  [7.6, "Ahead, the long way home."],
];
const WARP_AT = 9;
const CREDITS_AT = 11;
const RETURN_AT = 18;

export class CutsceneScene extends Phaser.Scene {
  private backdrop!: Backdrop;
  private run!: {
    score: number;
    kills: number;
    hits: number;
    continues: number;
  };
  private cutsceneAfterDemo = false;
  private options!: LaunchOptions;
  private leaving = false;
  private hud!: Hud;

  constructor() {
    super("cutscene");
  }

  init(data: {
    run: { score: number; kills: number; hits: number; continues: number };
    cutsceneAfterDemo: boolean;
    options: LaunchOptions;
  }): void {
    this.leaving = false;
    this.run = data.run;
    this.cutsceneAfterDemo = data.cutsceneAfterDemo;
    this.options = data.options ?? this.registry.get("options");
    this.hud = this.registry.get("hud");
  }

  create(): void {
    this.hud.setMode("cutscene");
    this.hud.setBoss(null);
    this.backdrop = new Backdrop(this);
    this.cameras.main.fadeIn(600, 4, 2, 12);
    this.input.keyboard?.on("keydown-SPACE", () => this.onSpace());

    const ship = this.add.image(WIDTH / 2, HEIGHT - 120, "player");
    ship.enableFilters();
    ship.filters?.internal.addGlow(TINTS.player, 5, 0, 1);
    this.add.particles(0, 0, "spark", {
      speedY: { min: 120, max: 260 },
      lifespan: 420,
      scale: { start: 1.2, end: 0 },
      tint: TINTS.player,
      blendMode: "ADD",
      frequency: 16,
    }).startFollow(ship, 0, 18);
    this.tweens.add({
      targets: ship,
      y: HEIGHT - 140,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    for (const [at, line] of STORY) {
      this.time.delayedCall(at * 1000, () => this.hud.say(line));
    }
    this.time.delayedCall(WARP_AT * 1000, () => {
      this.hud.say("");
      play(this, "pickup", 0.7);
      this.tweens.add({
        targets: this.backdrop,
        warp: 18,
        duration: 900,
        ease: "Quad.in",
      });
      this.tweens.killTweensOf(ship);
      this.tweens.add({
        targets: ship,
        y: -80,
        scale: 0.4,
        duration: 1100,
        ease: "Back.in",
      });
      this.time.delayedCall(
        1000,
        () => this.cameras.main.flash(500, 220, 250, 255),
      );
    });
    this.time.delayedCall(CREDITS_AT * 1000, () => {
      this.hud.announce(
        "THANK YOU FOR PLAYING",
        `Final score ${this.run.score}`,
      );
      if (this.cutsceneAfterDemo) {
        this.hud.say(
          `Self-play: ${this.run.kills} kills, ${this.run.hits} hits, ${this.run.continues} continues`,
        );
      }
    });
    this.time.delayedCall(RETURN_AT * 1000, () => this.returnToTitle());
  }

  override update(_time: number, delta: number): void {
    this.backdrop.scroll(delta);
  }

  private onSpace(): void {
    this.returnToTitle();
  }

  private returnToTitle(): void {
    if (this.leaving) return;
    this.leaving = true;
    this.hud.say("");
    fadeAndStart(this, "title", { options: this.options });
  }
}
