import { Game } from './game/game';
import { Background as Background } from './game/background';
import { Critter } from './game/critter';
const game = new Game({height: 800 , width: 800});
// set up the screen
const screen = new Background({
  center: { x: 0, y: 0 },
  height: 640,
  width: 800
})

game.addEntity(screen);


game.addEntity(new Critter({
  center: {
    x: 100, y: 320
  },
  color: 'red', angle: 0
}));

game.addEntity(new Critter({
  center: {
    x: 200, y: 320
  },  color: 'red', angle: 45
}));
game.addEntity(new Critter({
  center: {
    x: 300, y: 320
  },  color: 'red', angle: 90
}));
game.addEntity(new Critter({
  center: {
    x: 400, y: 320
  }, color: 'red', angle: 180
}));

game.entities.forEach(e => {})