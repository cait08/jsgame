import { Geom } from "./geom";

export class Input {
  gamepads: Gamepad[] = [];

  constructor() {
    window.addEventListener("gamepadconnected", (e) => {
      this.registerGamepad(e.gamepad);
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      console.info(
        "Gamepad disconnected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length
      );
      this.gamepads.slice(this.gamepads.indexOf(e.gamepad), 1);
    });
  }

  registerGamepad(g: Gamepad) {
    this.gamepads.push(g);

    console.info(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",
      g.index,
      g.id,
      g.buttons.length,
      g.axes.length
    );
  }

  get gamepad(): { buttons: GamepadButton[]; axes: number[] } {
    const g = this.gamepads.find((g) => g.connected);

    if (!g) {
      return { buttons: [], axes: [0, 0, 0, 0] };
    }

    const res = {
      axes: [...g.axes],
      buttons: [...g.buttons],
    };

    const [x, y, a, b] = res.axes;

    const distA = Geom.distance([0, 0], [x, y]);
    const distB = Geom.distance([0, 0], [a, b]);

    if (distA < 0.4) {
      res.axes[0] = this.filterValue(res.axes[0]);
      res.axes[1] = this.filterValue(res.axes[1]);
    }

    if (distB < 0.4) {
      res.axes[2] = this.filterValue(res.axes[2]);
      res.axes[3] = this.filterValue(res.axes[3]);
    }

    return res;
  }

  filterValue(value: number) {
    if (value < 0.1 && value > -0.1) {
      return 0;
    }

    return value;
  }
}
