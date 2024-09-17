const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

let birdY;
let birdSpeed;
const gravity = 0.3; // Further reduced gravity
const jumpStrength = -5; // Adjusted jump strength
let isGameOver = false;
let score = 0;
let isPressing = false;

let pipeArray = [];
let pipeInterval;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('touchstart', touchStartHandler);
document.addEventListener('touchend', touchEndHandler);

function keyDownHandler(e) {
  if (e.code === 'Space' || e.keyCode === 32) {
    if (!isPressing) {
      birdSpeed = jumpStrength; // Immediate jump on tap
    }
    isPressing = true;
  }
}

function keyUpHandler(e) {
  if (e.code === 'Space' || e.keyCode === 32) {
    isPressing = false;
  }
}

function touchStartHandler(e) {
  e.preventDefault();
  if (!isPressing) {
    birdSpeed = jumpStrength; // Immediate jump on tap
  }
  isPressing = true;
}

function touchEndHandler(e) {
  e.preventDefault();
  isPressing = false;
}

function startGame() {
  startScreen.style.display = 'none';
  birdY = gameContainer.offsetHeight / 2;
  bird.style.top = birdY + 'px';
  isGameOver = false;
  score = 0;
  updateScore();
  pipeArray.forEach(pipe => {
    pipe.top.remove();
    pipe.bottom.remove();
  });
  pipeArray = [];
  birdSpeed = 0;
  isPressing = false;
  pipeInterval = setInterval(generatePipes, 2500); // Increased interval
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (isGameOver) return;

  if (isPressing) {
    birdSpeed += jumpStrength * 0.02; // Continuous ascent while pressing
  } else {
    birdSpeed += gravity;
  }

  birdY += birdSpeed;
  bird.style.top = birdY + 'px';

  if (birdY > gameContainer.offsetHeight - bird.offsetHeight || birdY < 0) {
    gameOver();
  }

  movePipes();
  requestAnimationFrame(gameLoop);
}

function generatePipes() {
  const pipeGap = 150; // Increased gap
  const pipeWidth = 60;
  const minPipeHeight = 50;
  const maxPipeHeight = gameContainer.offsetHeight - pipeGap - minPipeHeight;

  const pipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1) + minPipeHeight);

  const pipeTop = document.createElement('div');
  pipeTop.classList.add('pipe', 'top');
  pipeTop.style.height = pipeHeight + 'px';
  pipeTop.style.left = gameContainer.offsetWidth + 'px';

  const pipeBottomHeight = gameContainer.offsetHeight - pipeHeight - pipeGap;

  const pipeBottom = document.createElement('div');
  pipeBottom.classList.add('pipe', 'bottom');
  pipeBottom.style.height = pipeBottomHeight + 'px';
  pipeBottom.style.left = gameContainer.offsetWidth + 'px';

  gameContainer.appendChild(pipeTop);
  gameContainer.appendChild(pipeBottom);

  pipeArray.push({ top: pipeTop, bottom: pipeBottom, passed: false });
}

function movePipes() {
  pipeArray.forEach(pipe => {
    let pipeLeft = parseInt(pipe.top.style.left);
    pipeLeft -= 1.5; // Reduced speed
    pipe.top.style.left = pipeLeft + 'px';
    pipe.bottom.style.left = pipeLeft + 'px';

    if (pipeLeft < -60) {
      pipe.top.remove();
      pipe.bottom.remove();
      pipeArray = pipeArray.filter(p => p !== pipe);
    }

    if (
      !isGameOver &&
      (collisionDetection(bird, pipe.top) || collisionDetection(bird, pipe.bottom))
    ) {
      gameOver();
    }

    if (!pipe.passed && pipeLeft + 60 < bird.offsetLeft) {
      score++;
      updateScore();
      pipe.passed = true;
    }
  });
}

function collisionDetection(bird, pipe) {
  const birdRect = bird.getBoundingClientRect();
  const pipeRect = pipe.getBoundingClientRect();

  return (
    birdRect.left < pipeRect.left + pipeRect.width &&
    birdRect.left + birdRect.width > pipeRect.left &&
    birdRect.top < pipeRect.top + pipeRect.height &&
    birdRect.top + birdRect.height > pipeRect.top
  );
}

function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

function gameOver() {
  isGameOver = true;
  clearInterval(pipeInterval);
  alert('Game Over! Your score: ' + score);
  startScreen.style.display = 'flex';
}

startButton.addEventListener('click', startGame);
startButton.addEventListener('touchstart', startGame);
// Press 'e' to start the game
document.addEventListener('keydown', function(event) {
  if (event.key === 'e' || event.key === 'E' || event.ctrlKey ) {
      startGame();
  }
});
