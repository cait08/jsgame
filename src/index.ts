import { Game } from "./game/game";
import { Background as Background } from "./game/background";
import { Critter } from "./game/critter";
import { Avatar } from "./game/avatar";
import { Corpse } from "./game/corpse";
const game = new Game({ height: 800, width: 1600 });
// set up the screen

game.addEntity(
  new Background({
    position: [0, 0],
  })
);

game.addEntity(
  new Critter({
    position: [400, 400],
    color: "red",
    angle: 0,
  })
);

game.addEntity(
  new Critter({
    position: [400, 400],
    color: "red",
    angle: 90,
  })
);
game.addEntity(
  new Critter({
    position: [400, 400],
    color: "red",
    angle: 180,
  })
);
game.addEntity(
  new Critter({
    position: [400, 400],
    color: "red",
    angle: 270,
  })
);

game.addEntity(
  new Corpse({
    position: [100, 400],
    color: "red",
    angle: 270,
  })
);

game.addEntity(new Avatar({ position: [400, 400] }));
