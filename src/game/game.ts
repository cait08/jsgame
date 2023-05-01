import { Subject } from "rxjs";
import { Critter } from "./critter";
import { Entity } from "./entity";
import { Background } from "./background";
import { Geom } from "./geom";
import { Dice } from "./dice";
import { Drawing } from "./drawing";
import { Input } from "./input";
import { Physics } from "./physics";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  drawing: Drawing;

  tick = new Subject<void>();

  geom = new Geom();

  nextGameTick = new Date().getTime();

  entities: Entity[] = [];

  paused = false;

  frame = 0;

  input = new Input();

  constructor(params: { height: number; width: number }) {
    const div = document.createElement("div");

    const screen = document.createElement("canvas");
    screen.height = params.height;
    screen.width = params.width;

    this.canvas = screen;
    const ctx = screen.getContext("2d");
    if (!ctx) {
      return;
    }
    this.ctx = ctx;

    this.drawing = new Drawing(this.ctx);
    document.body.append(div);

    div.appendChild(this.canvas);
    this.render();
    this.think();

    this.canvas.addEventListener("click", (evt: MouseEvent) => {
      for (const e of this.entities) {
        e.faceAngle([evt.x, evt.y]);
        e.think();
      }

      this.addEntity(
        new Critter({
          position: [evt.x, evt.y],
          color: "red",
          angle: 90,
        })
      );
    });
  }

  entitiesInReach(entity: Entity) {
    const x = entity.x;
    const y = entity.y;
    let radius = 20;
    if (typeof (entity as any).radius === "number") {
      radius = (entity as any).radius;
    }

    return this.entities.filter(
      (e) =>
        e.x > x - radius &&
        e.x < x + radius &&
        e.x > y - radius &&
        e.y < y + radius
    );
  }

  addEntity(item: Entity) {
    if (this.entities.indexOf(item) > -1) {
      return;
    }

    item.ctx = this.ctx;
    item.tick = this.tick;
    item.game = this;
    item.geom = this.geom;

    item.drawing = new Drawing(this.ctx);
    item.drawing;

    this.entities.push(item);
  }

  removeEntity(item: Entity) {
    this.entities.splice(this.entities.indexOf(item), 1);
  }

  think() {
    if (this.paused) {
      setTimeout(() => {
        this.think();
      }, 100);
    }

    for (const e of this.entities) {
      e.think();
    }

    setTimeout(() => {
      this.think();
    }, 24);
  }

  render() {
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (!this.paused) {
          this.ctx.fillStyle = "#eeeeee";
          this.ctx.strokeStyle = "#000000";

          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

          if (Dice.roll(1)) {
            this.entities.sort((a, b) => a.z - b.z);
          }

          for (const e of this.entities) {
            e.draw();
          }

          this.drawing.text(
            [700, 20],
            this.entities.length.toString(),
            "black"
          );
        }

        //this.ctx.scale(1, 2); // squish it to 2/3 vertical size
        this.render();
        this.frame++;
      });
    }, 16);
  }
}
