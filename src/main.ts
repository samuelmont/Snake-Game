import './GlobalStyles.css';

const canvas = document.querySelector('canvas');
let context: CanvasRenderingContext2D | null;
let tileWidth = 0;
setSizes();
let snake = [{x: tileWidth * 5, y: tileWidth * 7}, {x: tileWidth * 4, y: tileWidth * 7}, {x: tileWidth * 3, y: tileWidth * 7}];
let timer: number | undefined;
let direction = "Right";
let food = [50000, 50000];
let collors = ["#220060", "#220099", "green", "orange"]
let dead = false;
let velocity = 7; // Tiles per second
let maxScore = 0;
let score = 0;

function setSizes() {
  let baseNumber = 0;
  if(canvas) {
    context = canvas.getContext('2d');
    if(window.innerHeight < window.innerWidth) {
      baseNumber = (window.innerHeight / 100) * 80;
    } else {
      baseNumber = (window.innerWidth / 100) * 80;
    }
    for(let i = 0; i < baseNumber; i += 15) {
      canvas.width = i;
      canvas.height = i;
      tileWidth = i / 15;
    }
    console.log(canvas.height)
    console.log(tileWidth)
  }
}

function setTimer(meterPerSecond: number) {
  const time = 1000 / meterPerSecond;
  if (dead == false) {
    timer = setTimeout(() => callback(), time);
  }
}

function stopTimer() {
  clearTimeout(timer);
}

function callback() {
  moveSnake();
  checkDeathHit();
  checkFruitHit();
  updateScore();
  newMaxScore();
  clearTable();
  buildTable();
  createFood();
  buildSnake();
  buildFood();
  setTimer(velocity);
}

function buildTable() {
  if(!canvas) return;
  if(!context) return;

  
  for(let i = 0; i < canvas.width; i += tileWidth) {
    let j = 0;
    if (i % 2 == 0) j = tileWidth;
    for(j; j < canvas.height; j += tileWidth * 2 ) {
      context.fillStyle = collors[0];
      context.fillRect(i, j, tileWidth, tileWidth);
      context.fillStyle = collors[1];
      context.fillRect(i, j - tileWidth, tileWidth, tileWidth);
      if(j == canvas.width - (tileWidth * 2)) context.fillRect(i, j + tileWidth, tileWidth, tileWidth);
    }
  }
}

function buildSnake() {
  if(!canvas) return;
  if(!context) return;

  for(let i = 0; i < snake.length; i++){
    context.fillStyle = collors[2];
    context.fillRect(snake[i].x, snake[i].y, tileWidth, tileWidth);
    context.fillStyle = "black";
    context.strokeRect(snake[i].x, snake[i].y, tileWidth, tileWidth)
  }
}

function buildFood() {
  if(!canvas) return;
  if(!context) return;

  context.fillStyle = collors[3];
  context.fillRect(food[0], food[1], tileWidth, tileWidth);
  context.fillStyle = 'black';
  context.strokeRect(food[0], food[1], tileWidth, tileWidth);
}

function clearTable() {
  if(!canvas) return;
  if(!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function listenActions(){
  const body = document.querySelector('body');
  if(!body) return;

  body.addEventListener('keydown', e => {
    switch(e.key) {
      case "ArrowUp":
        if (direction == "Down") break;
        direction = "Up";
        break;
      case "ArrowDown":
        if (direction == "Up") break;
        direction = "Down";
        break;
      case "ArrowLeft":
        if (direction == "Right") break;
        direction = "Left";
        break;
      case "ArrowRight":
        if (direction == "Left") break;
        direction = "Right";
        break;
      case "w":
        if (direction == "Down") break;
        direction = "Up";
        break;
      case "s":
        if (direction == "Up") break;
        direction = "Down";
        break;
      case "a":
        if (direction == "Right") break;
        direction = "Left";
        break;
      case "d":
        if (direction == "Left") break;
        direction = "Right";
        break;
      case " ":
        restart();
        break;
    }
  })

  const restartButton = document.querySelector('#restart');
  if(!restartButton) return;
  restartButton.addEventListener('click', () => restart())
}

function moveSnake() {
  switch(direction) {
    case "Up":
      snake.unshift({x: snake[0].x, y: snake[0].y -tileWidth});
      break;
    case "Down":
      snake.unshift({x: snake[0].x, y: snake[0].y +tileWidth});
      break;
    case "Left":
      snake.unshift({x: snake[0].x - tileWidth, y: snake[0].y});
      break;
    case "Right":
      snake.unshift({x: snake[0].x + tileWidth, y: snake[0].y});
      break;
    }
    snake.pop();
}

function createFood() {
  if (food[0] == 50000 && food[1] == 50000)  {
    let random = newRandomNum();
    for(let i = 0; i < snake.length; i ++) {
      if(random * tileWidth == snake[i].x) {
        i = 0
        random = newRandomNum();
      } else { 
        food = [random * tileWidth, food[1]]
      }
    }
    random = newRandomNum();
    for(let i = 0; i < snake.length; i ++) {
      if(random * tileWidth == snake[i].y) {
        i = 0
        random = newRandomNum();
      } else { 
        food = [food[0], random * tileWidth]
      }
    }
  }
}

function checkFruitHit() {
  if(snake[0].x == food[0] && snake[0].y == food[1]) {
    food = [50000, 50000];
    score++;
    snake.push({x: 50000, y: 50000})
  }
}

function checkDeathHit() {
  if(!canvas) return;
  for(let i = 0; i < snake.length; i ++) {
    if(snake[i].x < 0 || snake[i].x > canvas.width - tileWidth) dead = true;
    if(snake[i].y < 0 || snake[i].y > canvas.height - tileWidth) dead = true;
  }
  for(let i = 1; i < snake.length; i++) {
    if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) dead = true;
  }
}

function newRandomNum() {
  return Math.floor(Math.random() * 15)
}

function restart() {
  stopTimer();
  snake = [{x: tileWidth * 5, y: tileWidth * 7}, {x: tileWidth * 4, y: tileWidth * 7}, {x: tileWidth * 3, y: tileWidth * 7}];
  direction = "Right";
  food = [50000, 50000];
  dead = false;
  score = 0;
  callback();
}

function updateScore() {
  const scoreTag = document.querySelector('#score');
  if(!scoreTag) return;
  scoreTag.innerHTML = `Score: ${score}`;
}

function newMaxScore() {
  if(score > maxScore) {
    maxScore = score;
    const maxScoreTag = document.querySelector('#max-score');
    if(!maxScoreTag) return;
    maxScoreTag.innerHTML = `Max-Score: ${score}`;
  }
}

listenActions();
callback();