import { Entity, EntityOptions } from "./entity";


export interface ScreenOptions extends EntityOptions {
  height: number;
  width: number;
}

export class Background extends Entity {
  height: number;
  width: number;

  constructor(
    public options: ScreenOptions
  ) {
    super(options);
  }

  draw(): void {
    this.ctx.fillStyle = '#eeeeee';
    this.ctx.strokeStyle = '#000000';

    this.ctx.fillRect(
      0, 0,
      this.game.canvas.height,
      this.game.canvas.width
    );
  }
}