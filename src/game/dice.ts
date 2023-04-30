export class Dice {
  static roll(likelihood: number, callback = () => { }): boolean {

    if (likelihood > 100) {
      likelihood = 100;
    }

    const rand = Math.random() * 100;

    const res = rand < likelihood;

    if (res) {
      callback();
    }

    return res;
  }
}