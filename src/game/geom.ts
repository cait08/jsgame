export class Geom {

  constructor(private ctx: CanvasRenderingContext2D) { }

  /**
   * Convert degrees to radians
   * @param degs 
   * @returns 
   */
  static degToRads(degs: number): number {
    var pi = Math.PI;
    return degs * (pi / 180);
  }

  static posFromPos(start: [number, number], angle: number, distance: number): [number, number] {
    const [dx, dy] = Geom.resultCoords(angle, distance);
    const [x, y] = start;
    return [x + dx, y + dy];
  }

  static resultCoords(angle: number, dist: number): [number, number] {
    if (angle < 0) {
      angle = 360 - angle;
    }
    if (angle > 360) {
      angle = angle - 360;
    }

    angle = this.degToRads(angle);

    const dx = dist * Math.cos(angle);
    const dy = dist * Math.sin(angle);

    return [dx, dy]
  }

  circle(center: [number, number] = [0, 0], radius: number = 10, color = 'white', strokeColor = 'black') {

    const [x, y] = center;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.beginPath();


    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

    this.ctx.fill();
    this.ctx.lineWidth = radius / 10;
    this.ctx.stroke();
  }

  line(start: [number, number], end: [number, number], color: string, width = 1) {
    const [x, y] = start;
    const [dx, dy] = end;
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(x, y);

    this.ctx.lineTo(dx, dy);
    this.ctx.lineWidth = width;
    this.ctx.stroke();
  }

  text(position: [number, number], text: string, color = 'black') {

    this.ctx.strokeStyle = color;
    this.ctx.strokeText(text, ...position);
  }

  random(min: number, max: number): number {
    const diff = Math.abs(max - min);
    const rand = Math.random();
    const int = rand * diff;
    return min + int;
  }


  distance(point1: [number, number], point2: [number, number]): number {
    let [x, y] = point1;
    let [x2, y2] = point2;

    while (x < 0 || x2 < 0) {
      x++;
      x2++;
    }

    while (y < 0 || y2 < 0) {
      y++;
      y2++;
    }

    const a = x2 - x;
    const b = y2 - y;
    return Math.sqrt(a * a + b * b);
  }

  angle(point1: [number, number], point2: [number, number]) {
    let [x, y] = point1;
    let [x2, y2] = point2;

    while (x < 0 || x2 < 0) {
      x++;
      x2++;
    }

    while (y < 0 || y2 < 0) {
      y++;
      y2++;
    }

    var dy = y2 - y;
    var dx = x2 - x;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)


    return theta;
  }

}