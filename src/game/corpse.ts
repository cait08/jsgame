import { CritterOptions } from "./critter";
import { CritterLike } from "./critterlike";
import { Dice } from "./dice";
import { Entity } from "./entity";
import { Geom } from "./geom";
import { GameMath } from "./numbers";

export class Corpse extends CritterLike {
  age = 0;

  _radius = 10;

  constructor(public options: CritterOptions) {
    super(options);
  }

  onCollide(collider: Entity) {}

  draw(): void {
    if (this.radius < 0) {
      return;
    }

    this.drawing.circle(this.position, this.radius, "white", "black");
    const bridge = Geom.posFromPos(this.position, this.angle, this.radius / 8);
    const left = Geom.posFromPos(bridge, this.angle - 90, this.radius / 3);
    const right = Geom.posFromPos(bridge, this.angle + 90, this.radius / 3);
    this.drawing.circle(left, this.radius / 5, "black", "black");
    this.drawing.circle(right, this.radius / 5, "black", "black");

    const nose = Geom.posFromPos(
      this.position,
      this.angle + 180,
      this.radius / 4
    );

    this.drawing.circle(nose, this.radius / 12, "black");

    const mouthCenter = Geom.posFromPos(
      this.position,
      this.angle - 180,
      this.radius / 1.5
    );

    const skew = 30;

    const mouth = [
      Geom.posFromPos(mouthCenter, this.angle + 45 + skew, this.radius / 3),
      Geom.posFromPos(mouthCenter, this.angle + 135 - skew, this.radius / 3),
      Geom.posFromPos(mouthCenter, this.angle + 225 + skew, this.radius / 3),
      Geom.posFromPos(mouthCenter, this.angle + 315 - skew, this.radius / 3),
    ];

    this.drawing.shape(mouth, "black");
  }

  think() {
    super.think();
    this.age++;

    this.radius = this.radius - 0.001;

    if (this.age > 100) {
      Dice.roll(10, () => {
        this.destroy();
        return;
      });
    }
    this.angle = this.angle + GameMath.random(-1, 1);

    this.moveForward(1);
  }
}
