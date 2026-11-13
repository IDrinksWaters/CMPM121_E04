import Phaser from "phaser";
import { HEIGHT, WIDTH } from "../actors.ts";

export class Backdrop {
  private stars: Phaser.GameObjects.Arc[] = [];
  warp = 0;

  constructor(scene: Phaser.Scene) {
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, WIDTH);
      const y = Phaser.Math.Between(0, HEIGHT);
      const radius = Phaser.Math.FloatBetween(0.8, 2);
      const star = scene.add.circle(
        x,
        y,
        radius,
        0x8aa4c8,
        Phaser.Math.FloatBetween(0.3, 0.9),
      );
      this.stars.push(star);
    }
  }

  scroll(delta: number): void {
    const speed = (1 + this.warp) * (delta / 16);
    for (const star of this.stars) {
      star.y += speed * (star.radius * 0.8);
      if (star.y > HEIGHT) {
        star.y = 0;
        star.x = Phaser.Math.Between(0, WIDTH);
      }
    }
  }
}
