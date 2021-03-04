// document.body.style.backgroundColor = "black"
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");
cvs.style.border = "1px solid yellow";
// ctx.clear(0,0,cvs.width, cvs.height);
let PADDLE_WIDTH = 100;
let PADDLE_HEIGHT = 20;
let PADDLE_MARGIN_BOTTOM = 50;
var leftArrow = false;
var rightArrow = false;
var SCORE = 0;
var SCORE_ADD = 10;
var LEVEL = 1;
var MAX_LEVEL = 3;
let GAME_OVER = false;

const bg_img = new Image()
bg_img.src = "./bg.png"

const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5
};

let BALL_RADIUS = 8;
let LIFE = 3;

const ball = {
    x: cvs.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}

const brick = {
  row: 3,
  column: 5,
  width: 55,
  height: 20,
  offsetLeft: 20,
  offsetTop: 20,
  marginTop: 20,
  fillColor: "white",
  strokeColor: "yellow"
}

document.addEventListener("keydown", (e) => {

  if (e.keyCode == 37) {
    leftArrow = true;
  } else if (e.keyCode == 39) {
    rightArrow = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) {
    leftArrow = false;
  } else if(e.keyCode == 39) {
    rightArrow = false;
  }
});

let bricks = [];

function createBrick() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
        y: r * (brick.offsetTop + brick.height) + brick.offsetTop + brick.marginTop,
        status: true
      }
    }
  }
}

createBrick();

function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(b.x, b.y, brick.width, brick.height);
        ctx.strokeColor = brick.strokeColor;
        ctx.strokeRect(b.x, b.y, brick.width, brick.height);
        }
    }
  }
}

function drawPaddle() {
  ctx.fillStyle = "white";
  ctx.fillRect(paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

  ctx.strokeStyle = "yellow";
  ctx.strokeRect(paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.closePath();
}

function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function collusionWithWall() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    } else if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.radius > cvs.height) {
        LIFE--;
        resetBall();
    }
}

function collusionWithPaddle() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x &&
        ball.y < paddle.y + paddle.height && ball.y > paddle.y) {
        let collidePoint = (ball.x - (paddle.x + paddle.width / 2))/(paddle.width / 2);
        let angle = collidePoint * Math.PI * 3;
        ball.dx = ball.speed * Math.sin(angle);
        // console.log(ball);
        ball.dy = ball.speed * Math.cos(angle);
    }
}

function collusionWithBrick() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) { 
      let b = bricks[r][c];
      if (b.status) {
        if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
          ball.dy = -ball.dy;
          b.status = false;
          SCORE += SCORE_ADD;
        }
      }
    }
  }
}

function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
    paddle.x = cvs.width / 2 - PADDLE_WIDTH / 2;
    paddle.y = cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT;
}

function levelUp() {
  let isLevelDone = true;

  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      isLevelDone = isLevelDone && !b.status;
    }
  }

  if (isLevelDone) {
    if (LEVEL >= MAX_LEVEL) {
      GAME_OVER = true;
      return;
    } else {
      brick.row++;
      createBrick();
      ball.speed += 1;
      resetBall();
      LEVEL++; 
    }
  }

}

function showGameStart(text, x, y) {
  ctx.fillStyle = "white";
  ctx.font = "20px Germania One"
  ctx.fillText(text, x, y);
}

function gameOver() {
  if (LIFE <= 0) {
    GAME_OVER = true;
  }
}

function draw() {
    drawPaddle();
  drawBall();
  drawBricks();

  showGameStart("Score " + SCORE, 25, 25);
  showGameStart("Life " + LIFE, cvs.width - 70, 25);
  showGameStart("Level " + LEVEL, cvs.width / 2 - 20, 25);
  
}

function update() {
    movePaddle();
    moveBall();
    collusionWithWall();
  collusionWithPaddle();
  collusionWithBrick();
  gameOver()
  levelUp();
}

function loop() {
  ctx.drawImage(bg_img,0,0);
  draw();
  update();
  if (!GAME_OVER) {
    requestAnimationFrame(loop); 
  }
}

loop();
