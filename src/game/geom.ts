import { GameMath } from "./numbers";
import { Position } from "./types/types";

export class Geom {
  constructor() {}

  /**
   * Convert degrees to radians
   * @param degs
   * @returns
   */
  static degToRads(degs: number): number {
    var pi = Math.PI;
    return degs * (pi / 180);
  }

  static posFromPos(
    start: Position,
    angle: number,
    distance: number
  ): Position {
    const [dx, dy] = Geom.resultCoords(angle, distance);
    const [x, y] = start;
    return [x + dx, y + dy];
  }

  static resultCoords(angle: number, dist: number): Position {
    angle = GameMath.coerceDegrees(angle);

    angle = this.degToRads(angle);

    const dx = dist * Math.cos(angle);
    const dy = dist * Math.sin(angle);

    return [dx, dy];
  }

  static coordsFrom(pos: Position, angle: number, distance: number): Position {
    const [dx, dy] = Geom.resultCoords(angle, distance);
    return [pos[0] + dx, pos[1] + dy];
  }

  static distance(point1: Position, point2: Position): number {
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

  angle(point1: Position, point2: Position) {
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

    return GameMath.coerceDegrees(theta);
  }
}
