import { Entity, EntityOptions } from "./entity";

export abstract class CritterLike extends Entity {


  _radius = 2;
  
  constructor(public options: EntityOptions) {
    super(options);
  }
  
  

  set radius(num: number) {
    this._radius = num;
    if (this._radius < 0) {
      this._radius = 0;
    }
  }

  get radius() {
    return this._radius;
  }
}