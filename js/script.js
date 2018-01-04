/*
  TODO
  * Random movements
*/


/* CANVAS SETUP */

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

initialize();

function initialize() {
  resizeCanvas();
}

function resizeCanvas() {
  canvas.width = 900;
  canvas.heigth = 600;
  redraw();
}

function redraw() {
  ctx.rect(0, 0, canvas.width, canvas.heigth);
  let radGrad = ctx.createRadialGradient((canvas.width / 2), (canvas.height / 2), 150, (canvas.width / 2), (canvas.height / 2), 300);
  radGrad.addColorStop(0, 'rgb(53, 59, 96)');
  radGrad.addColorStop(1, 'rgb(47, 52, 86)');
  ctx.fillStyle = radGrad;
  ctx.fill();
}


/* GAME LOGIC */
let isRunning = true;

let startpos = {
  x: (canvas.width / 2) - 25,
  y: (canvas.height / 2) - 25
};
let currentpos = startpos;


function update(progress) {

  currentpos.x += progress / 5;

  if (currentpos.x > canvas.width) {
    currentpos.x -= canvas.width;
  }

}

function draw() {
  // clears the canvas every refresh
  redraw();

  ctx.drawImage(rock, startpos.x, startpos.y, 50, 50);
}

// loop functions that updates() and draws() as soon as possible
// requestAnimationFrame is passed a timestamp of when the callback
//  started firing, it contains the n. of milliseconds since the
//  window loaded
function loop(timestamp) {
  var progress = timestamp - lastRender;

  if (isRunning) {
    update(progress);
    draw();
  }

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

function pauseGame(e) {
  if (e.keyCode === 32) {
    let pauseSpan = document.querySelector('#pauseSpan');
    if (isRunning) {
      isRunning = false;
      pauseSpan.innerHTML = "resume";
    }
    else {
      isRunning = true;
      pauseSpan.innerHTML = "pause";
    }
  }
}

function handleResize() {

  // updates the instruction text
  let instructionText = document.querySelector('.instructionText');
  if (window.innerHeight < canvas.heigth + 200) {
    instructionText.style.opacity = 0;
  } else {
    instructionText.style.opacity = 1;
  }
}

function handleEvents() {

  window.addEventListener('keydown', pauseGame);
  window.addEventListener('resize', handleResize);

}

// fetching the items DOM elements
let rock = document.querySelector('#smallrock');

let lastRender = 0;
window.requestAnimationFrame(loop);
handleEvents();
