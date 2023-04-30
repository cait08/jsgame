import { iif } from "rxjs";
import { Dice } from "./dice";
import { Entity, EntityOptions } from "./entity";
import { Game } from "./game";
import { Geom } from "./geom";

import randomColor from "randomcolor";
import { Corpse } from "./corpse";
import { CritterLike } from "./critterlike";

export interface CritterOptions extends EntityOptions {
  radius?: number;
  color: string;
  angle: number;
}

export class Critter extends CritterLike {


  target: Critter | null = null;

  age = 0;
  maxSize = 40;

  kills = 0;

  health = 2550;
  _radius = 20;

  game: Game;



  color: string = randomColor({ hue: 'green', luminosity: 'dark' });
  strokeColor: string = 'black';

  constructor(public options: CritterOptions) {
    super(options)
    this.radius = options.radius ?? this.radius;
    this.angle = options.angle;
  }



  draw(): void {
    this.think();



    this.geom.circle([this.x, this.y], this.radius, this.target ? 'red' : this.color, this.strokeColor);

    // draw line so we know where it's facing


    const leftPos = Geom.posFromPos(this.position, this.angle + 20, this.radius / 2);
    const rightPos = Geom.posFromPos(this.position, this.angle - 20, this.radius / 2);

    this.geom.circle(leftPos, this.radius / 3, 'white', 'white');
    this.geom.circle(rightPos, this.radius / 3, 'white', 'white');
    this.geom.circle(leftPos, this.radius / 8, 'black', 'black');
    this.geom.circle(rightPos, this.radius / 8, 'black', 'black');




    if (this.target) {
      this.geom.text([this.x, this.y], 'attack', 'red');
    } else {

      //this.geom.text([this.x, this.y], (this.age / 10).toString(), 'black');
    }
  }

  siblings(): Critter[] {
    return this.game.entities.filter(e => e !== this).filter(e => e.constructor.name === this.constructor.name) as Critter[];
  }

  isAlive(): boolean {
    return this.game.entities.indexOf(this) > -1;
  }

  wander() {
    let dist = 1;


    Dice.roll(20, () => {
      dist = dist + 1;
    })

    this.moveForward(dist);

  }

  eat() {
    let corpse: Corpse;
    [corpse] = this.game.entities.filter(e => e.constructor.name === 'Corpse')
      .filter(e => this.geom.distance(this.position, e.position) < 100)
      .sort((a, b) => this.geom.distance(this.position, a.position) - this.geom.distance(this.position, b.position)) as any;

    if (!corpse) {
      return false;
    }

    this.faceAngle(corpse.position);
    this.moveForward(2);
    const dist = this.geom.distance(this.position, corpse.position);

    if (this.game.entities.indexOf(corpse) < 0) {
      return;
    }

    if (dist < this.radius + corpse.radius) {
      this.health = this.health + 10;
      Dice.roll(2, () => {
        this.radius = this.radius + 1;
      });
      corpse.destroy();
    }

    return true;
  }

  attack() {
    if (!this.target) {
      return;
    }

    this.faceAngle([this.target.x, this.target.y]);

    this.target.color = 'ffffff';


    // this.geom.line(this.position, this.target.position, 'red');

    const dist = this.geom.distance([this.x, this.y], [this.target.x, this.target.y]);

    if (dist < this.radius + this.target.radius) {
      this.target.angle = this.target.angle + 10;

      const damaged = this.damage(this.target, this.radius / 10000);

      Dice.roll(2, () => {
        this.radius = this.radius + 1;
      });

      this.target.color = 'pink'

      if (this.target.health <= 0) {

        for (let i = 0; i < 3; i++) {

          if (this.siblings().filter(s => this.geom.distance(this.position, s.position) < 100).length < 10) {
            const child = new Critter(this.options);

            child.radius = 8;
            child.x = this.x;
            child.y = this.y;
            child.angle = this.angle - 180;
            this.game.addEntity(child)
            child.moveForward(10);
          }
        }
      }
    } else {
      this.moveForward(6);
    }

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

      for (let i = 0; i < this.radius + 10; i++) {
        const corpse = new Corpse({ radius: 10, color: 'grey', angle: i * 10, center: { x: this.x, y: this.y } });
        corpse.angle = (this.angle + (i * 10)) % 360;
        corpse.radius = 2;
        this.game.addEntity(corpse)
      }
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
      da = parseFloat(((Math.random() - 0.5) * 45).toFixed(1))
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
      const eating = this.eat();

      if (!eating) {
        this.wander();
      }
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

    const siblings = this.siblings().filter(s => this.geom.distance(this.position, s.position) > this.radius * 3).filter(s => this.geom.distance(this.position, s.position) < this.radius * 6);

    const isOldest = () => siblings.filter(e => e.age > this.age).length === 0;
    const isYoung = () => siblings.filter(e => e.age > this.age).length < siblings.length / 2;

    if (isOldest()) {
      this.radius++;
      let youngest = siblings.filter((e) => e !== this).sort((a, b) => b.age - a.age)

      if (youngest.length) {
        youngest = youngest.slice(0, youngest.length / 2);
      }


      const target = youngest.sort((a, b) => this.geom.distance([a.x, a.y], [b.x, b.y]))[0];

      this.target = target;

    } else if (isYoung()) {

      const oldest = siblings.sort((a, b) => b.age - a.age)[0];
      this.target = oldest;
    }

    if (this.target) {
      this.target.target = null;
    }
  }
}