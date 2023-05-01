import { Avatar } from "../avatar";
import { Geom } from "../geom";
import { GameMath } from "../numbers";
import { Projectile } from "../projectile";
import { BaseSpell } from "./BaseSpell";

export class FlameSpell extends BaseSpell<Avatar> {
  cast(size = 3) {
    if (this.game.entities.length > 500) {
      return;
    }

    if (this.caster.stamina <= 30) {
      // return;
    }

    this.caster.stamina = this.caster.stamina - size;

    let spread = GameMath.random(4, 28);

    if (size < 5) {
      spread = 2;
    }

    for (let i = 0; i < GameMath.random(0, 200); i++) {
      const origin = Geom.posFromPos(
        Geom.posFromPos(
          this.caster.position,
          this.caster.angle,
          this.caster.radius
        ),
        this.caster.angle + 90,
        spread / 2
      );

      const projectile = new Projectile({
        position: Geom.coordsFrom(
          origin,
          this.caster.angle - 90,
          GameMath.random(0, spread)
        ),
        angle: this.caster.angle,
      });

      projectile.team = this.caster.team;
      if (i % 2 === 0) {
        projectile.radius = size;
      }
      this.game.addEntity(projectile);
    }
  }
}
