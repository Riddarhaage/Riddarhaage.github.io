let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Check if the device is a mobile device

if (isMobile) {
  canvas.width = window.innerWidth; // Set canvas width to window inner width on mobile
  canvas.height = window.innerHeight; // Set canvas height to window inner height on mobile
} else {
  canvas.width = 400; // Set canvas width to a fixed value on desktop
  canvas.height = 600; // Set canvas height to a fixed value on desktop
}

canvas.style.background = "rgb(125, 125, 125)";

let rect = { x: 200, y: 570, width: 100, height: 10}; // Define rect as an object with properties for position and size

let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speedX: 3, speedY: -3 }; // Define ball as an object with properties for position, size, and speed

let blocks = [
  { x: 5, y: 5, width: 50, height: 20, destroyed: false },
  { x: 60, y: 5, width: 50, height: 20, destroyed: false },
  { x: 115, y: 5, width: 50, height: 20, destroyed: false },
  { x: 170, y: 5, width: 50, height: 20, destroyed: false },
  { x: 225, y: 5, width: 50, height: 20, destroyed: false },
  { x: 280, y: 5, width: 50, height: 20, destroyed: false },
  { x: 335, y: 5, width: 50, height: 20, destroyed: false },
  { x: 10, y: 30, width: 50, height: 20, destroyed: false },
  { x: 65, y: 30, width: 50, height: 20, destroyed: false },
  { x: 120, y: 30, width: 50, height: 20, destroyed: false },
  { x: 175, y: 30, width: 50, height: 20, destroyed: false },
  { x: 230, y: 30, width: 50, height: 20, destroyed: false },
  { x: 285, y: 30, width: 50, height: 20, destroyed: false },
  { x: 340, y: 30, width: 50, height: 20, destroyed: false },
  { x: 5, y: 55, width: 50, height: 20, destroyed: false },
  { x: 60, y: 55, width: 50, height: 20, destroyed: false },
  { x: 115, y: 55, width: 50, height: 20, destroyed: false },
  { x: 170, y: 55, width: 50, height: 20, destroyed: false },
  { x: 225, y: 55, width: 50, height: 20, destroyed: false },
  { x: 280, y: 55, width: 50, height: 20, destroyed: false },
  { x: 335, y: 55, width: 50, height: 20, destroyed: false },
  


];

let gameOver = false;

drawRect();
drawBall();

canvas.addEventListener("wheel", function (e) {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Update the x position of the rectangle based on wheel scroll
  if (e.deltaY > 0) {
    //scroll down
    rect.x += 20;
  } else {
    //scroll up
    rect.x -= 20;
  }

  // Check for collision with left and right canvas borders
  if (rect.x < 0) {
    rect.x = 0; // Snap rectangle to left canvas border
  } else if (rect.x + rect.width > canvas.width) {
    rect.x = canvas.width - rect.width; // Snap rectangle to right canvas border
  }

  // Draw the updated rectangle
  drawRect();
});

// Add touch event listeners for touch-based movement of the rectangle
canvas.addEventListener("touchstart", function (e) {
  let touchX = e.touches[0].clientX; // Get the x position of the touch
  rect.touchOffsetX = touchX - rect.x; // Calculate the offset between the touch position and the rectangle's position
});

canvas.addEventListener("touchmove", function (e) {
  let touchX = e.touches[0].clientX; // Get the x position of the touch
  rect.x = touchX - rect.touchOffsetX; // Update the rectangle's x position based on the touch position and the offset
});

function animateBall() {
  context.clearRect(ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2); // Clear the previous position of the ball
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Check for collision with left and right canvas borders
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.speedX *= -1; // Reverse the horizontal speed to make the ball bounce
  }

  // Check for collision with top canvas border
  if (ball.y - ball.radius < 0) {
    ball.speedY *= -1; // Reverse the vertical speed to make the ball bounce
  }

  // Check for collision with the rectangle (floor)
  if (ball.y + ball.radius > rect.y && ball.x > rect.x && ball.x < rect.x + rect.width) {
    // Ball collided with the rectangle, bounce off
    ball.speedY *= -1;
  }

  // Check if ball goes beyond the bottom of the canvas
  if (ball.y + ball.radius > canvas.height) {
    // Ball went beyond the bottom of the canvas, trigger game over
    gameOver = true;
  }
  // Check for collision with blocks
  for (let i = 0; i < blocks.length; i++) {
    if(!blocks[i].destroyed) {
      if (ball.x + ball.radius > blocks[i].x && ball.x - ball.radius < blocks[i].x + blocks[i].width && ball.y + ball.radius > blocks[i].y && ball.y - ball.radius < blocks[i].y + blocks[i].height) {
        // Ball collided with the block, bounce off
        ball.speedY *= -1;
        blocks[i].destroyed = true;
      }
    }
  }

  drawBall();
  drawBlocks();

  if (!gameOver) {
    requestAnimationFrame(animateBall);
  } else {
    alert("Game over");
  }
}

function drawRect() {
  context.fillStyle = "white";
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = "white";
  context.fill();
  context.closePath();
}

function drawBlocks() {
  context.fillStyle = "white";
  blocks.forEach(block => {
    if (!block.destroyed) {
      context.fillRect(block.x, block.y, block.width, block.height);
    }
  });
}

animateBall();
//hehe
