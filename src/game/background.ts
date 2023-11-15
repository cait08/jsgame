import { Entity, EntityOptions } from "./entity";
import { GameMath } from "./numbers";

export interface ScreenOptions extends EntityOptions {}

export class Background extends Entity {
  height: number;
  width: number;

  constructor(public options: ScreenOptions) {
    super(options);
  }

  onCollide(collider: Entity) {}

  draw(): void {
    this.ctx.strokeStyle = "transparent";
    const o = parseInt((this.game.frame / 10).toFixed(0)) % 5;

    const letters = "zyxwvutsrqponmlll";

    for (let i = 0; i < this.game.canvas.width; i++) {
      const start = i;
      const code = letters.charCodeAt(i % letters.length) % 30;
      i = i + code;

      let end = i;

      if (i % 3 === 0) {
        this.ctx.fillStyle = "#110";
      }
      if (i % 4 === 0) {
        this.ctx.fillStyle = "#332";
      }
      this.ctx.fillRect(
        start + Math.random() * 2,
        0,
        end,
        this.game.canvas.height
      );
    }
  }
}
