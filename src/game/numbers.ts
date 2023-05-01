export class GameMath {
  static random(min: number, max: number): number {
    if (min > max) {
      const temp = min;
      max = min;
      min = temp;
    }

    return min + Math.abs(max - min) * Math.random();
  }

  static coerceDegrees(degs: number): number {
    while (degs < 0) {
      degs = degs + 360;
    }

    while (degs >= 360) {
      degs = degs - 360;
    }

    return degs;
  }
}
