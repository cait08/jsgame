import { Subject } from "rxjs";
import { Geom } from "./geom";
import { Dice } from "./dice";
import { Drawing } from "./drawing";
import { Input } from "./input";
import { Physics } from "./physics";

export class Game {
  drawing: Drawing;

  tick = new Subject<void>();

  geom = new Geom();

  nextGameTick = new Date().getTime();

  paused = false;

  frame = 0;

  input = new Input();

  constructor(params: { height: number; width: number }) {
    const div = document.createElement("div");

    const screen = document.createElement("canvas");
    screen.height = params.height;
    screen.width = params.width;

    const ctx = screen.getContext("2d");
    if (!ctx) {
      return;
    }
  }

  think() {
    if (this.paused) {
      setTimeout(() => {
        this.think();
      }, 100);
    }

    setTimeout(() => {
      this.think();
    }, 24);
  }
}
