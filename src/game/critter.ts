import { iif } from "rxjs";
import { Dice } from "./dice";
import { Entity, EntityOptions } from "./entity";
import { Game } from "./game";
import { Geom } from "./geom";

import randomColor from "randomcolor";
import { Corpse } from "./corpse";
import { CritterLike } from "./critterlike";
import { Drawing } from "./drawing";

export interface CritterOptions extends EntityOptions {
  radius?: number;
  color?: string;
  angle?: number;
}

export class Critter extends CritterLike {
  target: Critter | null = null;

  age = 0;
  maxSize = 40;

  kills = 0;

  health = 100;
  _radius = 20;

  team = 1;

  game: Game;

  drawing: Drawing;

  bodyParts: Entity[];

  color: string = randomColor({ hue: "green", luminosity: "dark" });
  strokeColor: string = "rgba(255, 255, 255, 0.5)";

  constructor(public options: CritterOptions) {
    super(options);
    this.radius = options.radius || this.radius;
    this.angle = options.angle || 0;
  }

  onCollide(collider: Entity) {}

  draw(): void {
    // Main body
    this.drawing.circle(
      [this.x, this.y],
      this.radius,
      this.target ? "red" : this.color,
      this.strokeColor
    );

    // draw line so we know where it's facing

    const leftPos = Geom.posFromPos(
      this.position,
      (this.angle + 20) % 360,
      this.radius / 2
    );

    const rightPos = Geom.posFromPos(
      this.position,
      this.angle - 20,
      this.radius / 2
    );

    const eyeSize = this.radius / 3;
    const pupilSize = this.radius / 8;

    this.drawing.circle(leftPos, eyeSize, "white", "white", 0);
    this.drawing.circle(rightPos, eyeSize, "white", "white", 0);

    this.drawing.circle(leftPos, pupilSize, "black", "black", 0);
    this.drawing.circle(rightPos, pupilSize, "black", "black", 0);

    if (this.target) {
      this.drawing.text([this.x, this.y], "attack", "red");
    } else {
      //this.drawing.text([this.x, this.y], (this.age / 10).toString(), 'black');
    }
  }

  siblings(): Critter[] {
    return this.game.entities
      .filter((e) => e !== this)
      .filter((e) => e.constructor.name === this.constructor.name) as Critter[];
  }

  isAlive(): boolean {
    return this.game.entities.indexOf(this) > -1;
  }

  wander() {
    let dist = 1;

    Dice.roll(20, () => {
      dist = dist + 1;
    });

    this.moveForward(dist);
  }

  damage(target: Entity, amount: number) {
    Dice.roll(1, () => {
      target.health = 0;
      return 100;
    });

    Dice.roll(50, () => {
      target.health = target.health - amount;
      return amount;
    });

    return 0;
  }

  think() {
    super.think();

    this.z = this.radius;

    if (this.health <= 0) {
      this.destroy();

      const corpse = new Corpse({
        radius: 10,
        color: "grey",

        position: this.position,
      });

      corpse.radius = this.radius;
      this.game.addEntity(corpse);
    }

    this.age++;

    /**
     * Change in facing angle
     */
    let da = 0;

    Dice.roll(this.radius / 1000, () => {
      if (this.siblings.length > 1) {
        this.health = 0;
      }
    });

    Dice.roll(5, () => {
      da = parseFloat(((Math.random() - 0.5) * 45).toFixed(1));
      this.angle = this.angle + da;
    });

    this.angle = Math.abs(this.angle + da);

    if (this.angle < 0) {
      this.angle = 360 - Math.abs(this.angle);
    }

    if (this.angle >= 360) {
      this.angle = 0;
    }

    if (this.radius < 2) {
      this.radius = 2;
    } else if (this.radius > 100) {
      this.radius = 100;
    }

    if (this.target && !this.target.isAlive()) {
      this.target = null;
    }

    if (this.target) {
      this.attack();
    } else {
      this.wander();
    }

    Dice.roll(10, () => {
      return;
    });

    if (!this.target && Dice.roll(1)) {
      this.findTarget();
    }
  }

  findTarget() {
    if (this.target && !this.target.isAlive()) {
      this.target = null;
    }

    const siblings = this.siblings()
      .filter((s) => Geom.distance(this.position, s.position) > this.radius * 4)
      .filter(
        (s) => Geom.distance(this.position, s.position) < this.radius * 10
      );

    const isOldest = () =>
      siblings.filter((e) => e.age > this.age).length === 0;

    const isYoung = () =>
      siblings.filter((e) => e.age > this.age).length < siblings.length / 2;

    if (isOldest()) {
      // Find a corpse and eat it
      //
    } else if (isYoung()) {
      const oldest = siblings.sort((a, b) => b.age - a.age)[0];
      this.target = oldest;
    }

    if (this.target) {
      this.target.target = null;
    }
  }

  attack() {
    Dice.roll(1, () => {
      this.target = null;
    });

    if (!this.target) {
      return;
    }

    this.faceItem(this.target);

    this.target.color = "ffffff";

    const dist = Geom.distance(
      [this.x, this.y],
      [this.target.x, this.target.y]
    );

    if (dist < this.radius + this.target.radius) {
      this.target.angle = this.target.angle + 10;

      const damaged = this.damage(this.target, this.radius / 10000);

      Dice.roll(2, () => {
        this.radius = this.radius + 1;
      });

      this.target.color = "pink";

      if (this.target.health <= 0 && this.siblings.length < 20) {
        for (let i = 0; i < 3; i++) {
          if (
            this.siblings().filter(
              (s) => Geom.distance(this.position, s.position) < 100
            ).length < 10
          ) {
            const child = new Critter(this.options);

            child.radius = 8;
            child.x = this.x;
            child.y = this.y;
            child.angle = this.angle - 180;
            this.game.addEntity(child);
            child.moveForward(10);
          }
        }
      }
    } else {
      this.moveForward(6);
    }
  }
}
