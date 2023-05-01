import * as Matter from "matter-js";
// module aliases

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

export class Physics {
  Engine = Matter.Engine;
  Render = Matter.Render;
  Runner = Matter.Runner;
  Bodies = Matter.Bodies;
  Composite = Matter.Composite;

  engine = Engine.create();

  render = Render.create({
    element: document.body,
    engine: this.engine,
  });
  constructor() {
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // add all of the bodies to the world
    Composite.add(this.engine.world, [boxA, boxB, ground]);

    // run the renderer
    Render.run(this.render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, this.engine);
  }
}
