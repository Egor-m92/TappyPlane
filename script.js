//import kaboom from "kaboom"

kaboom({
  width: 360,
  height: 640,
  maxFPS: 60,
  canvas: document.querySelector("#body"),
  stretch: true,
  letterbox: true,
});

const GRAVITY = 500;
const WIDTH = 360;
const HEIGHT = 640;

const JUMP_FORCE = 250;
const SPEED = 100;
const CEILING = -60;

const ROCK_OPEN = 40;
const ROCK_WIDTH = 64;
const ROCK_MIN_HEIGHT = 400;


loadSprite("plane", "sprites/planeRed1.png");
loadSprite("bg", "sprites/background.png");
loadSprite("ground", "sprites/groundDirt.png");
loadSprite("rock", "sprites/rock.png");
loadSprite("rockDown", "sprites/rockDown.png");
loadSprite("getReady", "sprites/textGetReady.png");
loadSprite("gameOver", "sprites/textGameOver.png");
loadSprite("tapLeft", "sprites/tapLeft.png");
loadSprite("tapRight", "sprites/tapRight.png");
loadSprite("tap", "sprites/tapTick.png");
loadSprite("bronzeMedal", "sprites/medalBronze.png");
loadSprite("silverMedal", "sprites/medalSilver.png");
loadSprite("goldMedal", "sprites/medalGold.png");
loadSprite("panel", "sprites/UIbg.png");

loadSound("score", "/sounds/sfx_point.aif");
loadSound("plane", "/sounds/vint.mp3");
loadSound("avaria", "/sounds/avaria.mp3");
loadFont("kenvector_future", "./font/kenvector_future.ttf");

setGravity(GRAVITY);

const menu = () => {
  go("menu");
}

const startGame = () => {
    go("game");
}

scene("menu", () => {
  add([
    sprite("bg"),
    pos(0, 0),
  ]);

  add([
    text("Tappy Plane", {font: "kenvector_future",}),
    anchor("center"),
    pos(WIDTH / 2, HEIGHT / 9),
    fixed(),
    color([0, 0, 0]),
    z(10),
  ]);

  add([
    sprite("getReady"),
    pos(WIDTH / 6, HEIGHT / 2.5),
    scale(0.6),
  ]);

  add([
    sprite("tapLeft"),
    pos(WIDTH / 10, HEIGHT / 1.5),
    scale(0.9),
  ]);
  add([
    sprite("tapRight"),
    pos(WIDTH / 1.5, HEIGHT / 1.5),
    scale(0.9),
  ]);
  add([
    sprite("tap"),
    pos(WIDTH / 2.4, HEIGHT / 1.5),
    scale(0.9),
  ]);


  onClick(startGame);
  onTouchStart(startGame);
})

scene("game", () => {
    let score = 0;
    const game = add([timer()]);
  
    const createBg = () => {
      const bg = game.add([
        sprite("bg"),
        pos(0, 0),
      ]);
  
      return bg;
    };

    const bg = createBg();

    game.add([
      sprite("ground"),
      pos(0, HEIGHT - 71),
      z(10),
    ]);

    const createPlane = () => {
      const plane = game.add([
        sprite("plane"),
        pos(WIDTH / 5, HEIGHT / 3),
        scale(0.7),
        area(),
        body(),
        z(9),
      ]);
      const music = play("plane", {loop: true});

      return plane;
    }

    const plane = createPlane();

    const jump = () => {
      plane.jump(JUMP_FORCE);
    }

    onClick(jump);
    onTouchStart(jump);

    const createRock = () => {
      const topRockHeight = rand(-200, 0);
      const rectHeight = topRockHeight + ROCK_MIN_HEIGHT;
      const bottomRockHeight = topRockHeight + ROCK_OPEN + ROCK_MIN_HEIGHT;

      game.add([
        sprite("rockDown"),
        pos(WIDTH, topRockHeight),
        //area(),
        scale(0.8),
        move(LEFT, SPEED),
        offscreen({destroy: true}),
        z(9),
        "rock",
      ]);

      game.add([
        rect(10, rectHeight - ROCK_OPEN),
        pos(WIDTH + 85, 0),
        area(),
        scale(0.8),
        move(LEFT, SPEED),
        offscreen({destroy: true}),
        z(8),
        "rock",
      ]);

      game.add([
        sprite("rock"),
        pos(WIDTH, bottomRockHeight + ROCK_OPEN),
        //area(),
        scale(0.8),
        move(LEFT, SPEED),
        offscreen({destroy: true}),
        z(9),
        "rock",
        {passed: false},
      ]);

      game.add([
        rect(10, bottomRockHeight),
        pos(WIDTH + 85, bottomRockHeight + ROCK_OPEN),
        area(),
        scale(0.8),
        move(LEFT, SPEED),
        offscreen({destroy: true}),
        z(8),
        "rock",
      ]);
    }
    game.loop(3, createRock);

  plane.onUpdate(() => {
    const planePosY = plane.pos.y;

    if (planePosY >= HEIGHT - 50 || planePosY <= CEILING) {
      play("avaria");
      go("lose", score);}
    });

    plane.onCollide(() => {
      play("avaria");
      go("lose", score);
    });

    const createScoreLabel = () => {
      const scoreLabel = game.add([
        text(score, {font: "kenvector_future",}),
        anchor("center"),
        pos(WIDTH / 2, 60),
        fixed(),
        color([0, 0 , 0]),
        z(10),
      ])

      return scoreLabel;
    }

    const scoreLabel = createScoreLabel();

    const addScore = () => {
      score++;
      scoreLabel.text = score;

      play("score");
    };

    onUpdate("rock", rock => {
      if (plane.pos.x > rock.pos.x + rock.width / 2 && rock.passed === false) {
        addScore();
        rock.passed = true;
      }
    });
});

scene("lose", (score = 0) => {
  add([
    sprite("bg"),
    pos(0, 0),
  ]);
  
  add([
    text("Tappy Plane", {font: "kenvector_future",}),
    anchor("center"),
    pos(WIDTH / 2, HEIGHT / 9),
    fixed(),
    color([0, 0, 0]),
    z(10),
  ]);

  add([
    sprite("gameOver"),
    pos(WIDTH / 6, HEIGHT / 4),
    scale(0.6),
  ])

  add([
    sprite("panel"),
    pos(WIDTH / 5, HEIGHT / 2.3),
    scale(0.8),
  ]);

  add([
    text("Набрано: " + score, {font: "kenvector_future",}),
    pos(center()),
    anchor("center"),
    z(100),
    color([0, 0 , 0]),
  ]);

  if (score <= 25) {
    add([
      sprite("bronzeMedal"),
      pos(WIDTH / 3, HEIGHT / 1.7),
      scale(0.9),
    ]);
  }
  if (score > 25 && score < 35) {
    add([
      sprite("silverMedal"),
      pos(WIDTH / 3, HEIGHT / 1.7),
      scale(0.9),
    ]);
  }
  if (score > 35) {
    add([
      sprite("goldMedal"),
      pos(WIDTH / 3, HEIGHT / 1.7),
      scale(0.9),
    ]);
  }

  add([
    sprite("tapLeft"),
    pos(WIDTH / 10, HEIGHT / 1.2),
    scale(0.9),
  ]);
  add([
    sprite("tapRight"),
    pos(WIDTH / 1.5, HEIGHT / 1.2),
    scale(0.9),
  ]);
  add([
    sprite("tap"),
    pos(WIDTH / 2.4, HEIGHT / 1.2),
    scale(0.9),
  ]);

  onClick(startGame);
  onTouchStart(startGame);
});

menu();