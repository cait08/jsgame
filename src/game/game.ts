import { Subject } from "rxjs";
import { Critter } from "./critter";
import { Entity } from "./entity";
import { Background } from "./background";
import { Geom } from "./geom";
import { Dice } from "./dice";

export class Game {

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  tick = new Subject<void>();

  nextGameTick = new Date().getTime();

  entities: Entity[] = [];


  paused = false;

  constructor(params: { height: number, width: number }) {

    const div = document.createElement('div');

    const screen = document.createElement('canvas');
    screen.height = params.height;
    screen.width = params.width;

    this.canvas = screen;
    const ctx = screen.getContext("2d");
    if (!ctx) {
      return;
    }
    this.ctx = ctx;
    document.body.append(div);

    div.appendChild(this.canvas);
    this.render();



    this.canvas.addEventListener('click', () => {
      this.paused = !this.paused;
    });

  }

  entitiesInReach(entity: Entity) {
    const x = entity.x;
    const y = entity.y;
    let radius = 20;
    if (typeof (entity as any).radius === 'number') {
      radius = (entity as any).radius;
    }

    return this.entities.filter(e => e.x > x - radius && e.x < x + radius && e.x > y - radius && e.y < y + radius);
  }

  addEntity(item: Entity) {
    if (this.entities.indexOf(item) > -1) {
      return;
    }

    item.ctx = this.ctx;
    item.tick = this.tick;
    item.game = this;
    item.geom = new Geom(this.ctx);

    this.entities.push(item);
  }

  removeEntity(item: Entity) {
    this.entities.splice(this.entities.indexOf(item), 1);
  }



  render() {
    setTimeout(() => {
      requestAnimationFrame(() => {



        if (!this.paused) {

          this.ctx.fillStyle = '#eeeeee';
          this.ctx.strokeStyle = '#000000';
  
          this.ctx.fillRect(
            0, 0,
            this.canvas.width,
            this.canvas.height
          );
  
          if (Dice.roll(1)) {
            this.entities.sort((a, b) => a.z - b.z);
          }

          this.entities.forEach(entity => {
            this.ctx.strokeStyle = 'black';
            this.ctx.fillStyle = 'white';
            entity.draw();
          })
        }

        //this.ctx.scale(1, 2); // squish it to 2/3 vertical size
        this.render();

      });
    }, 16);
  }


}
