import { Corpse } from "./corpse";
import { Entity } from "./entity";
import { Geom } from "./geom";
import { GameMath } from "./numbers";
import { Projectile } from "./projectile";
import { Slash } from "./slash";
import { FlameSpell } from "./spells/Flame";

export class Avatar extends Entity {
  radius = 40;

  maxStamina = 1000;
  _stamina = this.maxStamina;

  team = 0;

  exp = 0;

  get stamina() {
    return this._stamina;
  }

  set stamina(val: number) {
    if (val < 0) {
      val = 0;
    }

    this._stamina = val;

    if (this.stamina > this.maxStamina) {
      this._stamina = this.maxStamina;
    }
  }

  onCollide(collider: Entity) {}

  draw() {
    this.drawing.text([10, 10], JSON.stringify([this.position, this.angle]));

    this.drawing.text([700, 700], this.exp.toFixed(0));

    // stamina bar
    this.drawing.line([10, 20], [10 + this.health, 20], "red", 10);

    // stamina bar
    this.drawing.line([10, 32], [10 + this.stamina, 32], "green", 10);

    this.drawing.shape(
      [1, 2, 3, 4, 5, 6]
        .map((i) => (360 / 5) * i)
        .map((d) =>
          Geom.posFromPos(this.position, d + this.angle, this.radius)
        ),
      "indigo",
      "white"
    );

    this.drawing.line(
      this.position,
      Geom.posFromPos(this.position, this.angle, this.radius),
      "white",
      2
    );
  }

  think() {
    super.think();

    // Add one stamina per cycle
    this.stamina++;

    const corpses = this.game.entities.filter(
      (e) => e.constructor.name === "Corpse"
    );

    // Find overlapping corpses
    const corpse = corpses.find(
      (c) => Geom.distance(c.position, this.position) < this.radius
    ) as Corpse;

    if (corpse) {
      corpse.destroy();
      this.exp = this.exp + corpse.radius;
    }

    // Don't poll input if there's no game pads
    if (!this.game.input.gamepads[0]) {
      return;
    }

    const axes = this.game.input.gamepad.axes;

    const [x, y, a, b] = axes;

    const angleA = this.geom.angle([0, 0], [x, y]);
    const distA = Geom.distance([0, 0], [x, y]);

    const angleB = this.geom.angle([0, 0], [a, b]);
    const distB = Geom.distance([0, 0], [a, b]);

    if (distA > 0.2) {
      this.ctx.rotate(this.game.input.filterValue(x) / 10);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    if (distB > 0.15) {
      this.drawing.text([40, 40], JSON.stringify(axes), "black");
      this.angle = angleB;
    }

    if (x && y) {
      this.moveForward(-y * 8);
      this.moveSideways(x * 8);
    }

    // Poll input
    const buttons = this.game.input.gamepad.buttons;

    const pressed = buttons.filter((b) => b.pressed);

    const spell = pressed.find((b) => buttons.indexOf(b) === 4);
    const spellHard = pressed.find((b) => buttons.indexOf(b) === 6);

    const fire = pressed.find((b) => buttons.indexOf(b) === 5);
    const fireHard = pressed.find((b) => buttons.indexOf(b) === 7);

    if (spell) {
      this.spell(2);
    } else if (spellHard) {
      this.spell(spellHard.value * 5);
    }

    if (fire) {
      this.fire(2);
    } else if (fireHard) {
      this.fire(fireHard.value * 10);
    }
  }

  fire(size: number) {
    if (
      this.game.entities.filter((e) => e.constructor.name === "Slash").length >
      0
    ) {
      return;
    }

    if (this.stamina <= 30) {
      return;
    }

    this.stamina = this.stamina - 40;

    const slash = new Slash({
      position: Geom.posFromPos(this.position, this.angle + 90, this.radius),
      angle: this.angle,
    });

    slash.team = this.team;

    slash.size = size;

    this.game.addEntity(slash);
  }

  spell(size: number) {
    const spell = new FlameSpell(this);

    spell.cast(size);
    if (this.stamina <= 30) {
      return;
    }
  }

  spell2(size: number) {
    const spell = new FlameSpell(this);

    spell.cast(size);
    if (this.stamina <= 30) {
      return;
    }
  }
}
