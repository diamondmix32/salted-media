const cv = document.getElementById('pong');
const ctx = cv.getContext('2d');
const cvWidth = cv.width;
const cvHeight = cv.height;

const size = 20;
const padW = 20;
const padH = 120
const padSpeed = 1.3;
const startingBallSpeed = 2;
const collisionAngleRandom = 10;
const ticks = 10;

let totalGameTicks = 0;
let mouse = { x: cvWidth / 2, y: cvHeight / 2 };
let ball = { x: cvWidth / 2, y: cvHeight / 2, direction: 0, speed: startingBallSpeed };
let pads = [{ x: 2 * padW, y: cvHeight / 2, score: 0, upKey: 0, downKey: 0 }, { x: cvWidth - 2 * padW, y: cvHeight / 2, score: 0, upKey: 0, downKey: 0 }];

function animate() {
  // call again next time we can draw
  requestAnimationFrame(animate);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cvWidth, cvHeight);

  for (let i = 0; i < ticks; i++) {
    update();
  }

  // draw everything
  ctx.fillStyle = 'white';
  ctx.font = "20px Verdana";
  ctx.fillText(pads[0].score, cvWidth / 2 - padW * 2, 30);
  ctx.fillText(pads[1].score, cvWidth / 2 + padW * 2, 30)
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, size, 0, 2 * Math.PI);
  ctx.fill()
  ctx.fillText('pong', 10, 30);

  pads.forEach(pad => ctx.fillRect(pad.x - padW / 2, pad.y - padH / 2, padW, padH));
}

animate();

const randomAngleChange = angle => angle + ((Math.random() - 0.5) * collisionAngleRandom * 2);

function update() {
  totalGameTicks++;
  ball.speed = (totalGameTicks * 0.00001 + startingBallSpeed);
  pads.forEach(pad => {
    pad.newY = Math.max(padH / 2, Math.min(cvHeight - padH / 2, pad.y + (pad.downKey + -pad.upKey) * padSpeed))
    const deltaX = ball.x - Math.max(pad.x - padW / 2, Math.min(ball.x, pad.x + padW / 2));
    const deltaY = ball.y - Math.max(pad.newY - padH / 2, Math.min(ball.y, pad.newY + padH / 2));
    const collision = deltaX * deltaX + deltaY * deltaY < size * size;
    if (!collision) {
      pad.y = pad.newY;
    }
  });

  let balldx = Math.cos(ball.direction * Math.PI / 180) * ball.speed;
  let balldy = Math.sin(ball.direction * Math.PI / 180) * ball.speed;
  let newBallX = ball.x + balldx;
  let newBallY = ball.y + balldy;

  pads.forEach(pad => {
    const deltaX = newBallX - Math.max(pad.x - padW / 2, Math.min(newBallX, pad.x + padW / 2));
    const deltaY = newBallY - Math.max(pad.y - padH / 2, Math.min(newBallY, pad.y + padH / 2));
    const collision = deltaX * deltaX + deltaY * deltaY < size * size;
    if (collision) {
      if (ball.x > pad.x + padW / 2) {
        if (ball.y > pad.y + padH / 2) {
          //Bottom Left Collision
          ball.direction = -90 - ball.direction;
        } else {
          if (ball.y < pad.y - padH / 2) {
            //Top Left Collision
            ball.direction = 90 - ball.direction;
          } else {
            //Left Side Collision
            ball.direction = 180 - ball.direction;
          }
        }
      } else {
        if (ball.x < pad.x - padW / 2) {
          if (ball.y > pad.y + padH / 2) {
            //Bottom Right Collision
            ball.direction = 90 - ball.direction;
          } else {
            if (ball.y < pad.y - padH / 2) {
              //Top Right Collision
              ball.direction = -90 - ball.direction;
            } else {
              //Right Side Collision
              ball.direction = 180 - ball.direction;
            }
          }
        } else {
          ball.direction *= -1;
        }
      }
      ball.direction = randomAngleChange(ball.direction);
      let balldx = Math.cos(ball.direction * Math.PI / 180) * ball.speed;
      let balldy = Math.sin(ball.direction * Math.PI / 180) * ball.speed;
      newBallX = ball.x + balldx;
      newBallY = ball.y + balldy;
    }
  });
  ball.x = newBallX;
  ball.y = newBallY;

  if (ball.y - size < 0 || ball.y + size > cvHeight) {
    ball.direction *= -1;
  }
  if (ball.x - size > cvWidth) {
    pads[0].score++;
    ball.x = pads[1].x - padW - size;
    ball.y = cvHeight / 2;
    ball.direction = 180;
    totalGameTicks = 0;
  }
  if (ball.x + size < 0) {
    pads[1].score++;
    ball.x = pads[0].x + padW + size;
    ball.y = cvHeight / 2;
    ball.direction = 0;
    totalGameTicks = 0;
  }
}

cv.addEventListener('keydown', e => {
  if (e.key === 'a') {
    console.log('paddle 0 up');
    pads[0].upKey = 1;
  }
  if (e.key === 'z') {
    pads[0].downKey = 1;
  }
  if (e.key === '\'') {
    pads[1].upKey = 1;
  }
  if (e.key === '/') {
    pads[1].downKey = 1;
  }
});
cv.addEventListener('keyup', e => {
  if (e.key === 'a') {
    pads[0].upKey = 0;
  }
  if (e.key === 'z') {
    pads[0].downKey = 0;
  }
  if (e.key === '\'') {
    pads[1].upKey = 0;
  }
  if (e.key === '/') {
    pads[1].downKey = 0;
  }
});