import { Observable, Subject } from "rxjs";
import { Game } from "./game";
import { Geom } from "./geom";
import { Drawing } from "./drawing";
import { Position } from "./types/types";
import { GameMath } from "./numbers";

export interface EntityOptions {
  position: Position;
  angle?: number;
}

export abstract class Entity {
  game: Game;
  geom: Geom;
  drawing: Drawing;

  x: number = 0;
  y: number = 0;
  z: number = 0;

  dx: number = 0;
  dy: number = 0;
  d: number = 0;

  health: number = 100;

  onDestroy = new Subject<void>();

  ctx: CanvasRenderingContext2D;

  tick: Subject<void>;

  team: number;

  constructor(options?: EntityOptions) {
    if (options) {
      this.x = options.position[0] || 0;
      this.y = options.position[1] || 0;
    }
    this.angle = options?.angle || 0;
  }

  _angle = 0;
  set angle(num: number) {
    this._angle = GameMath.coerceDegrees(num);
  }

  get angle() {
    return this._angle;
  }

  get position(): Position {
    return [this.x, this.y];
  }

  destroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
    this.game.removeEntity(this);
  }

  faceAngle(point: Position): this {
    this.angle = this.geom.angle([this.x, this.y], point);
    return this;
  }

  faceItem(item: Entity) {
    const pos = item.position;
    this.angle = this.geom.angle(this.position, pos);
  }

  moveForward(dist: number): this {
    const [dx, dy] = Geom.resultCoords(this.angle, dist);
    this.x = parseFloat((this.x + dx).toFixed());
    this.y = parseFloat((this.y + dy).toFixed());
    return this;
  }

  abstract onCollide<T>(collider: Entity): void;

  abstract draw(): void;

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
