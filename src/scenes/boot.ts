import Phaser from "phaser";
import { makeTextures } from "../textures.ts";
import { loadSounds } from "../sounds.ts";

export function fadeAndStart(
  scene: Phaser.Scene,
  target: string,
  data?: object,
): void {
  scene.cameras.main.fadeOut(450, 4, 2, 12);
  scene.cameras.main.once("camerafadeoutcomplete", () => {
    scene.scene.start(target, data);
  });
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create(): void {
    makeTextures(this);
    loadSounds(this);
    const options = this.registry.get("options");
    this.scene.start("title", { options });
  }
}
