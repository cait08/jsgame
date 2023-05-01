import { Entity } from "../entity";

export abstract class BaseSpell<C extends Entity> {
  get position() {
    return this.caster.position;
  }

  get game() {
    return this.caster.game;
  }
  constructor(public caster: C) {}

  abstract cast();
}
