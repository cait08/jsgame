import { Observable, Subject } from "rxjs";
import { Game } from "./game";
import { Geom } from "./geom";

export interface EntityOptions {

  center: {
    x: number; y: number;
  }

}

export abstract class Entity {
  game: Game;
  geom: Geom;

  x: number = 0;
  y: number = 0;
  z: number = 0;

  health: number = 1000;

  onDestroy = new Subject<void>();

  ctx: CanvasRenderingContext2D;

  tick: Subject<void>;

  constructor(options?: EntityOptions) {
    if (options) {
      this.x = options.center.x;
      this.y = options.center.y;
    }
  }

  _angle = 0;
  set angle(num: number) {
    this._angle = num;
    if (this._angle < 0) {
      this._angle = 0;
    }
  }

  get angle() {
    return this._angle;
  }

  get position(): [number, number] {
    return [this.x, this.y];
  }

  destroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
    this.game.removeEntity(this);
  }

  randomNumber(min: number, max: number) {
    const rand = Math.random() - 0.5;
    const diff = Math.abs(min - max);
    return rand * diff;
  }

  faceAngle(point: [number, number]): this {
    this.angle = (this.geom.angle([this.x, this.y], point));
    return this;
  }

  moveForward(dist: number): this {
    const [dx, dy] = Geom.resultCoords(this.angle, dist);
    this.x = parseFloat((this.x + dx).toFixed());
    this.y = parseFloat((this.y + dy).toFixed());
    return this;
  }



  abstract draw(): void

  think() {
    if (this.x < 0) {
      this.x = 1;
      this.angle = 0;
    }

    if (this.y < 0) {
      this.y = 1;
      this.angle = 90;
    }

    if (this.x > this.game.canvas.width) {
      this.x = this.game.canvas.width - 1;
      this.angle = 180;
    }

    if (this.y > this.game.canvas.height) {
      this.y = this.game.canvas.height - 1;
      this.angle = 270;
    }

  }
}