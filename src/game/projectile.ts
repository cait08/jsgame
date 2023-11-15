import { Subject } from "rxjs";
import { Dice } from "./dice";
import { Drawing } from "./drawing";
import { Entity, EntityOptions } from "./entity";
import { Geom } from "./geom";
import { GameMath } from "./numbers";
import { Position } from "./types/types";

export interface ProjectileOptions extends EntityOptions {
  velocity: number;
}

export class Projectile extends Entity {
  constructor(options: ProjectileOptions) {
    super(options);
    this.z = 50;
    this.velocity = options.velocity ?? 1;

    Dice.roll(50, () => {
      this.color = "red";
    });
    Dice.roll(10, () => {
      this.color = "grey";
    });
    Dice.roll(2, () => {
      this.color = "black";
    });
  }

  velocity = 0;

  created = new Date().getTime();

  _radius: number = 4;

  get radius() {
    return this._radius;
  }

  set radius(num) {
    this._radius = Math.abs(num);
  }

  colors = ["orange", "grey", "limegreen", "violet"];
  color = this.colors[0];

  draw() {
    const pt = this.position;

    // Draw a square over the origin point
    this.drawing.shape(
      [
        Geom.posFromPos(pt, 45, this.radius),
        Geom.posFromPos(pt, 135, this.radius),
        Geom.posFromPos(pt, 225, this.radius),
        Geom.posFromPos(pt, 315, this.radius),
      ],
      this.color,
      "transparent"
    );
  }

  think() {
    this.velocity = Math.abs(this.velocity - 0.001);
    const now = new Date().getTime();

    if (this.created + 200 < now) {
      const da = GameMath.random(-5, 5);
      this.angle = this.angle + da;
    }

    const colorIdx = this.colors.indexOf(this.color);

    const incrementOnAge = (age: number) => {
      if (this.created + age < now) {
        this.color = this.colors[colorIdx + 1] ?? this.colors[0];
      }
    };

    switch (colorIdx) {
      case 0:
        incrementOnAge(100);
        break;
      case 1:
        incrementOnAge(200);
        break;
      case 2:
        this.radius = this.radius + 0.2;
        incrementOnAge(400);
        break;
      case 3:
        incrementOnAge(800);
        this.radius--;
        break;

      default:
        // Get bigger AND fade away
        let offs = now - this.created;

        this.radius = this.radius + 0.4;

        this.color = `rgba(75, 0, 130, ${(1 / offs) * 100})`;

        break;
    }

    const movementSpread = 2;

    this.moveForward(GameMath.random(0, this.velocity));

    if (this.created + 100 < now) {
      this.radius = this.radius - 0.1;

      Dice.roll(5, () => {
        this.destroy();
      });
    }
    if (this.created + 2000 < now) {
      this.destroy();
    }

    super.think();

    const near = this.game.entities.find(
      (e) => Geom.distance(this.position, e.position) < this.radius
    );

    if (near && near.team !== this.team) {
      near.health = near.health - 100;
    }
  }

  onCollide<T>(collider: Entity): void {}
}
