import { Geom } from "./geom";
import { Position } from "./types/types";

export class Drawing {
  geom = new Geom();

  constructor(private ctx: CanvasRenderingContext2D) {}

  from() {}

  circle(
    center: Position = [0, 0],
    radius: number = 10,
    color = "white",
    strokeColor = "black",
    strokeWidth = 1
  ) {
    this.ctx.beginPath();
    const [x, y] = center;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = strokeColor;

    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

    this.ctx.fill();
    this.ctx.lineWidth = strokeWidth;
    this.ctx.stroke();
  }

  square(position: Position) {}

  shape(coordinates: Position[], color = "white", strokeColor = "black") {
    this.ctx.beginPath();

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = strokeColor;

    let i = 0;
    for (const c of coordinates) {
      if (i === 0) {
        this.ctx.moveTo(...c);
      } else {
        this.ctx.lineTo(...c);
      }
      i++;
    }

    this.ctx.fill();
  }

  line(start: Position, end: Position, color: string, width = 1) {
    const [x, y] = start;
    const [dx, dy] = end;
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(x, y);

    this.ctx.lineTo(dx, dy);
    this.ctx.lineWidth = width;
    this.ctx.stroke();
  }

  text(position: Position, text: string, color = "black") {
    this.ctx.beginPath();
    this.ctx.moveTo(...position);
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, ...position);
  }
}
