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
  canvas.height = 600;
  redraw();
}

function redraw() {
  ctx.rect(0, 0, canvas.width, canvas.height);
  let radGrad = ctx.createRadialGradient((canvas.width / 2), (canvas.height / 2), 150, (canvas.width / 2), (canvas.height / 2), 300);
  radGrad.addColorStop(0, 'rgb(55, 62, 100)');
  radGrad.addColorStop(1, 'rgb(47, 52, 86)');
  ctx.fillStyle = radGrad;
  ctx.fill();
}


/* GAME LOGIC */

// Constructors for every kind of rock and star
Smallrock = function() {
  this.width = 25;
  this.height = 25;
  this.x = this.width / 2 + Math.floor(Math.random() * ( canvas.width - 2*this.width ));
  this.y = this.height / 2 + Math.floor(Math.random() * ( canvas.height - 2*this.height ));
  this.element = document.querySelector('#smallrock');

  this.update = function(progress) {

  }
}
Mediumrock = function() {
  this.width = 50;
  this.height = 50;
  this.x = Math.floor(this.width / 2 + Math.random() * ( canvas.width - 2*this.width ));
  this.y = Math.floor(this.height / 2 + Math.random() * ( canvas.height - 2*this.height ));
  this.element = document.querySelector('#mediumrock');

  this.update = function(progress) {

  }
}
Bigrock = function() {

}

// Arrays containing all rocks and stars in the game
let rocks = [];
let stars = [];

// Running flag boolean
let isRunning = true;

/* Starting elements
  ROCKS
    - Small: 3-5
    - Medium: 1-3
    - Big: 0-1
  STARS (1-4 smallest-biggest)
    - 1:
    - 2:
    - 3:
    - 4:
*/
function initializeSetup() {
  // random number that will be used for each kind of object
  let random = 0;

  // SMALL ROCKS
  // prepare random number for small rocks (3-5)
  random = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i <= random - 1; i++) {
    rocks.push(new Smallrock());
  }

  // MEDIUM ROCKS
  // prepare random number for medium rocks (1-3)
  random = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i <= random - 1; i++) {
    rocks.push(new Mediumrock());
  }

  // BIG ROCKS
  // prepare random number for big rocks (0-1)
  random =  Math.floor(Math.random());
  if (random > 0) rocks.push(new Bigrock());

}

function update(progress) {

  // update each element
  rocks.forEach(rock => {
    rock.update(progress);
  });
  stars.forEach(star => {
    star.update(progress);
  });

  smallrock.x += progress / 5;
  mediumrock.x += progress / 5;

  if (smallrock.x > canvas.width) {
    smallrock.x -= canvas.width;
  }
  if (mediumrock.x > canvas.width) {
    mediumrock.x -= canvas.width;
  }

}

function draw() {
  // clears the canvas every refresh
  redraw();

  // Draws every rock and star
  rocks.forEach(rock => {
    ctx.drawImage(rock.element, rock.x, rock.y, rock.width, rock.height);
  });
  stars.forEach(star => {
    ctx.drawImage(star.element, star.x, star.y, star.width, star.height);
  });

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
  if (window.innerHeight < canvas.height + 200) {
    instructionText.style.opacity = 0;
  } else {
    instructionText.style.opacity = 1;
  }
}

function handleEvents() {

  window.addEventListener('keydown', pauseGame);
  window.addEventListener('resize', handleResize);

}


// STARTING POINT
let lastRender = 0;

function start() {
  initializeSetup();
  window.requestAnimationFrame(loop);
  handleEvents();
}


window.onload = start();
