import { Critter, CritterOptions } from "./critter";
import { CritterLike } from "./critterlike";
import { Dice } from "./dice";
import { Entity, EntityOptions } from "./entity";

export class Corpse extends CritterLike {

  age = 0;

  constructor(public options: CritterOptions) {
    super(options);
  }

  draw(): void {
    this.think();
    if (this.radius < 0) {
      return;
    }

    this.geom.circle(this.position, this.radius, 'red', 'red');
  }

  think() {
    super.think();
    this.age++;

    this.radius = this.radius - 0.01;

    if (this.age > 100) {
      Dice.roll(5, () => {
        this.destroy();
        return;
      })
    }
    
    const smear = new Corpse(this.options);
    smear.age = 100;
    
    this.angle = this.geom.random(15, 40);


    this.moveForward(1);
  }
}