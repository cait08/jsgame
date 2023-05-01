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
    const o = parseInt((this.game.frame / 10).toFixed(0)) % 4;

    switch (o) {
      case 0:
        this.ctx.fillStyle = "#000000";
        break;
      case 1:
        this.ctx.fillStyle = "#000";
        break;
      case 3:
        this.ctx.fillStyle = "#222";
        break;
      default:
        this.ctx.fillStyle = "#000000";
        break;
    }

    const letters = "mfwseikoa;jn tvop;asrjopby nejaio;";

    for (let i = 0; i < this.game.canvas.width; i++) {
      const start = i;
      const code = letters.charCodeAt(i % letters.length) % 30;
      i = i + code;

      const end = i;
      if (i % 3 === 0) {
        this.ctx.fillStyle = "#222222";
      }
      if (i % 4 === 0) {
        this.ctx.fillStyle = "#000";
      }
      this.ctx.fillRect(start, 0, end, this.game.canvas.height);
    }
  }
}
