import { Critter } from "./critter";
import { Entity, EntityOptions } from "./entity";
import { Geom } from "./geom";

export class Slash extends Entity {
  age = 0;

  size = 1;

  constructor(opts: EntityOptions) {
    super(opts);
  }

  draw() {
    const frame = (this.age % 48) * 8;
    this.age++;

    this.drawing.line(
      this.position,
      Geom.posFromPos(this.position, this.angle - frame + 30, frame),
      "white",
      this.size
    );
    if (this.age > 6) {
      this.destroy();
    }
  }

  think() {
    const crits = this.game.entities.filter(
      (c) => c instanceof Critter
    ) as Critter[];

    const nearest = crits.find((c: Critter) => {
      return (
        Geom.distance(this.position, c.position) < this.size * 2 + c.radius * 2
      );
    });

    if (!nearest) {
      return;
    }

    nearest.health = nearest.health - 100;
  }
}
