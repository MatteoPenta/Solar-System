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

// Elements constants
const smallrock_const = {
  width: 25,
  height: 25
};
const mediumrock_const = {
  width: 50,
  height: 50
};
const bigrock_const = {
  width: 90,
  height: 90
};


// Parent constructor for all Elements
function Element(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  // ID text used for debugging
  this.id = Math.floor(Math.random() * 100);
}
Element.prototype.update = function(progress) {

};
Element.prototype.isColliding = function(otherElement) {
    // REMEMBER: x and y of element refer to top left corner

    let otherTotX = otherElement.x + otherElement.width;
    let thisTotX = this.x + this.width;
    let otherTotY = otherElement.y + otherElement.height;
    let thisTotY = this.y + this.height;

    let xCollision = false;
    let yCollision = false;

    // checks for x collision
    if (
      ( (otherTotX > this.x) && (otherTotX < thisTotX) ) ||
      ( (otherElement.x > this.x) && (otherElement.x < thisTotX) )
    ) {
      xCollision = true;
    }

    // checks for y collision
    if (
      ( (otherTotY > this.y) && (otherTotY < thisTotY) ) ||
      ( (otherElement.y > this.y) && (otherElement.y < thisTotY) )
    ) {
      yCollision = true;
    }

    return xCollision && yCollision;

};

// Constructors for every kind of rock and star
// they all inherit from the Element constructor
function Smallrock (x, y) {
  // Call to the parent constructor
  Element.call(this, x, y, smallrock_const.width, smallrock_const.height);

  this.element = document.querySelector('#smallrock');
}
Smallrock.prototype = new Element();

function Mediumrock (x, y) {
  // Call to the parent constructor
  Element.call(this, x, y, mediumrock_const.width, mediumrock_const.height);

  this.element = document.querySelector('#mediumrock');
}
Mediumrock.prototype = new Element();

function Bigrock (x, y) {
  // Call to the parent constructor
  Element.call(this, x, y, bigrock_const.width, bigrock_const.height);

  this.element = document.querySelector('#bigrock');

}
Bigrock.prototype = new Element();

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
    // Keep creating random coordinates until they don't collide
    // with anything else in the canvas
    let randomCoord = 0;
    do {
      randomCoord = getRandomCoord(smallrock_const);
    } while ( checkCollisions(randomCoord, smallrock_const) );

    // Then, create a new rock with the final coords
    rocks.push(new Smallrock(randomCoord.x, randomCoord.y));
  }

  // MEDIUM ROCKS
  // prepare random number for medium rocks (1-3)
  random = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i <= random - 1; i++) {
    // Keep creating random coordinates until they don't collide
    // with anything else in the canvas
    let randomCoord = 0;
    do {
      randomCoord = getRandomCoord(mediumrock_const);
    } while ( checkCollisions(randomCoord, mediumrock_const) );

    // Then, create a new rock with the final coords
    rocks.push(new Mediumrock(randomCoord.x, randomCoord.y));
  }

  // BIG ROCKS
  // prepare random number for big rocks (0-1)
  random =  Math.floor(Math.random() * 2);
  if (random > 0) {
    // Keep creating random coordinates until they don't collide
    // with anything else in the canvas
    let randomCoord = 0;
    do {
      randomCoord = getRandomCoord(bigrock_const);
    } while ( checkCollisions(randomCoord, bigrock_const) );

    // Then, create a new rock with the final coords
    rocks.push(new Bigrock(randomCoord.x, randomCoord.y));
  }

}

// Given the chosen kind of element, creates an appropriate set
// of random coordinates and returns it
function getRandomCoord(element_const) {
  const randomCoord = {
    x: element_const.width / 2 + Math.floor(Math.random() * ( canvas.width - 2*element_const.width )),
    y: element_const.height / 2 + Math.floor(Math.random() * ( canvas.height - 2*element_const.height ))
  };

  return randomCoord;
}

// Given a set of coordinates, creates a sample Element and checks
// if it collides with every other element in the canvas
function checkCollisions(coords, element_const) {
  let sampleElement = new Element(coords.x, coords.y, element_const.width, element_const.height);

  // Checks for every collision. If it doesn't collide with
  // anything, returns false, otherwise true.
  if ( rocks.some(r => sampleElement.isColliding(r)) )  return true;
  if ( stars.some(s => sampleElement.isColliding(s)) )  return true;

  return false;
}

function update(progress) {

  // update each element
  rocks.forEach(rock => {
    rock.update(progress);
  });
  stars.forEach(star => {
    star.update(progress);
  });

}

function draw() {
  // clears the canvas every refresh
  redraw();

  // Draws every rock and star
  rocks.forEach(rock => {
    ctx.drawImage(rock.element, rock.x, rock.y, rock.width, rock.height);

    // ID text used for debugging
    ctx.fillStyle = 'white';
    ctx.font = '10px sans-serif';
    ctx.fillText(rock.id, rock.x + rock.width/3, rock.y + rock.height + 10);

    // Border used for debugging
    ctx.rect(rock.x, rock.y, rock.width, rock.height);
    ctx.stroke();
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
