import Phaser from "phaser";
import { HEIGHT, WIDTH } from "./actors.ts";
import { Hud } from "./hud.ts";
import { BootScene } from "./scenes/boot.ts";
import { TitleScene } from "./scenes/title.ts";
import { PlayScene } from "./scenes/play.ts";
import { CutsceneScene } from "./scenes/cutscene.ts";
import "./style.css";

// Start the game
launch({
  seed: 1,
  speed: 1,
  attract: false,
});

export interface LaunchOptions {
  seed: number;
  speed: number;
  attract: boolean;
}

export function launch(options: LaunchOptions): void {
  const hud = new Hud();
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: "#04020c",
    scene: [
      BootScene,
      TitleScene,
      PlayScene,
      CutsceneScene,
    ],
    render: { pixelArt: true },
    audio: { noAudio: false },
  });
  game.registry.set("options", options);
  game.registry.set("hud", hud);
}
