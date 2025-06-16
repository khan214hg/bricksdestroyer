const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballX, ballY, ballDX, ballDY, ballRadius;
let paddleX, paddleWidth, paddleHeight;
let bricks = [];
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let stage = 1;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  paddleWidth = canvas.width / 6;
  paddleHeight = 10;
  paddleX = (canvas.width - paddleWidth) / 2;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("nextStageBtn").addEventListener("click", nextStage);

function initGame() {
  ballRadius = 10;
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  ballDX = 4;
  ballDY = -4;
  createBricks();
}

function createBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.fillStyle = "#00ffe7";
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ff007f";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.fillStyle = "#00ffe7";
  ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
    ballDX = -ballDX;
  }
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  } else if (ballY + ballDY > canvas.height - ballRadius - paddleHeight - 10) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDY = -ballDY;
    } else if (ballY + ballDY > canvas.height - ballRadius) {
      showGameOver(stage);
      return;
    }
  }

  ballX += ballDX;
  ballY += ballDY;

  requestAnimationFrame(draw);
}

function collisionDetection() {
  let bricksLeft = 0;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        bricksLeft++;
        if (
          ballX > b.x &&
          ballX < b.x + brickWidth &&
          ballY > b.y &&
          ballY < b.y + brickHeight
        ) {
          ballDY = -ballDY;
          b.status = 0;
        }
      }
    }
  }
  if (bricksLeft === 0) {
    document.getElementById("nextStageBtn").disabled = false;
  }
}

document.addEventListener("mousemove", e => {
  let relativeX = e.clientX;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
});

function showGameOver(stageNum) {
  document.getElementById("gameOverText").textContent = `Game Over! Stage ${stageNum}`;
  document.getElementById("gameOverOverlay").style.display = "flex";
}

function restartGame() {
  document.getElementById("gameOverOverlay").style.display = "none";
  document.getElementById("nextStageBtn").disabled = true;
  stage = 1;
  brickRowCount = 3;
  brickColumnCount = 5;
  initGame();
  draw();
}

function nextStage() {
  stage++;
  document.getElementById("nextStageBtn").disabled = true;
  brickRowCount++;
  brickColumnCount++;
  initGame();
  draw();
}

initGame();
draw();
