import { Dice } from "./dice";
import { Drawing } from "./drawing";
import { Entity, EntityOptions } from "./entity";
import { Geom } from "./geom";
import { GameMath } from "./numbers";
import { Position } from "./types/types";

export class Projectile extends Entity {
  constructor(options: EntityOptions) {
    super(options);
    this.z = 50;

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

  created = new Date().getTime();

  _radius: number = 4;

  get radius() {
    return this._radius;
  }

  set radius(num) {
    this._radius = Math.abs(num);
  }

  color = "orange";

  colors = {
    orange: "orange",
    red: "red",
    grey: "grey",
    black: "black",
    purple: "purple",
  };

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
    const now = new Date().getTime();

    if (this.created + 200 < now) {
      const da = GameMath.random(-5, 5);
      this.angle = this.angle + da;
    }

    switch (this.color) {
      case this.colors.orange:
        if (this.created + 1000 < now) {
          this.color = "grey";
        }
        break;
      case this.colors.red:
        if (this.created + 200 < now) {
          this.color = "orange";
        }
        break;
      case this.colors.grey:
        this.radius = this.radius + 0.2;
        if (this.created + 1200 < now) {
          Dice.roll(5, () => {
            this.color = "black";
          });
          Dice.roll(1, () => {
            this.color = "violet";
          });
        }
        break;
      case this.colors.black:
        this.radius--;
        break;

      default:
        let offs = now - this.created;

        this.radius = this.radius + 0.2;

        this.color = `rgba(75, 0, 130, ${(1 / offs) * 100})`;

        break;
    }

    this.moveForward(GameMath.random(3, 8));

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
}
