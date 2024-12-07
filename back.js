function createFloatingImage() {
    const container = document.getElementById('container');

    const img = document.createElement('img');
    img.src = 'resources/effects/Bubbles.png';
    img.className = 'floating-image';

    const randomX = Math.random() * window.innerWidth;
    img.style.left = `${randomX}px`;

    const randomSize = Math.random() * 30 + 20;
    img.style.width = `${randomSize}px`;

    img.style.bottom = `0px`;

    container.appendChild(img);

    img.addEventListener('animationend', () => {
        img.remove();
    });
}

const windowWidth = window.innerWidth;

setInterval(createFloatingImage, (windowWidth/2.5));

//--------------------------------------------------------------

document.getElementById('startbutton').addEventListener('click', () => {
    document.getElementById('game_container').style.display = 'block';
    document.getElementById('options').style.display = 'none';
});



const canvas = document.getElementById('game_canvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

const bird = new Image();
const pipe = new Image();
const bg = new Image();
const fg = new Image();
bird.src = 'resources/assets/bird.png';
pipe.src = 'resources/assets/pipe.png';
bg.src = 'resources/assets/bg.png';
fg.src = 'resources/assets/fg.png';

let gap = 100;
let constant;
let bX = 50;
let bY = 150;
let gravity = 2.4;
let score = 0;
let gameSpeed = 2;

let pipes = [];
pipes[0] = {
  x: canvas.width,
  y: Math.random() * (pipe.height - gap) - pipe.height
};

let birdVelocity = 0;
const bounceVelocity = -8.7; // Initial upward velocity
const bounceDuration = 1000; // 1 second in milliseconds
let isBouncing = false;
let bounceStartTime = 0;

let fgX = 0;

document.addEventListener('keydown', (event) => {
    if(event.keyCode === 32) {
        if(gameOver) {
            //reset
            gameOver = false;
            score = 0;
            bY = 150;
            gameSpeed = 2;
            birdVelocity = 0;  // Reset bird velocity
            isBouncing = false; // Reset bounce state
            fgX = 0;  // Reset foreground position
            pipes = [{
                x: canvas.width,
                y: -150
            }];
            draw();
        } else {
            moveUp();
        }
    }
});

function moveUp() {
    birdVelocity = bounceVelocity;
    isBouncing = true;
    bounceStartTime = Date.now();
}

function collision(bX, bY, pipes){
    if (
        (bX + bird.width >= pipes.x &&
          bX <= pipes.x + pipe.width &&
          (bY <= pipes.y + pipe.height ||
            bY + bird.height >= pipes.y + constant)) ||
        bY + bird.height >= canvas.height - fg.height
      ) {
        return true;
      }
}

function drawRotatedImage(img, x, y, angle) {
    ctx.save();
    ctx.translate(x + img.width / 2, y + img.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }

function endGame(){
    gameOver = true;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 40);
    ctx.fillText("Press Space to restart", canvas.width/2, canvas.height/2 + 80);
}

let currentRotation = 0;
let targetRotation = 0;
const rotationSpeed = 0.5;

function draw(){
    //clear canvas before drawing new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //draw background
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    
    for(let i = 0; i < pipes.length; i++) {
        constant = pipe.height + gap;
        
        //draw top pipe
        ctx.drawImage(pipe, 
            pipes[i].x, pipes[i].y + constant,
            pipe.width, pipe.height);
            
        //draw bottom pipe
        drawRotatedImage(pipe, 
            pipes[i].x, 
            pipes[i].y, 
            180);
            
        //move pipes
        pipes[i].x -= gameSpeed;
  
        //generate new pipes
        if (pipes[i].x === 30) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * (pipe.height - gap)) - pipe.height
            });
        }

        //check collision
        if (collision(bX, bY, pipes[i])) {
            endGame();
            return;
        }

        //score counting
        if (pipes[i].x === 40) {
            score++;
        }
    }

    // Update and draw foreground with scrolling
    fgX -= gameSpeed;
    if (fgX <= -fg.width) {
        fgX = 0;
    }
    
    // Draw two copies of the foreground to create seamless scrolling
    ctx.drawImage(fg, fgX, canvas.height - fg.height);
    ctx.drawImage(fg, fgX + fg.width, canvas.height - fg.height);
    
    let rotation;
    if (bY < previousBY) {
        //tilt upward (-30 degrees)
        targetRotation = -30;
    } else {
        //tilt downward (90 degrees max)
        targetRotation = Math.min((bY - previousBY) * 2, 90);
    }
    
    //Smoothly interpolate between current and target rotation
    currentRotation = currentRotation + (targetRotation - currentRotation) * rotationSpeed;
    
    // Update bird physics before drawing
    if (isBouncing) {
        const currentTime = Date.now();
        if (currentTime - bounceStartTime >= bounceDuration) {
            isBouncing = false;
        }
        
        // Gradually reduce the upward velocity
        birdVelocity += gravity * 0.16; // Adjust this multiplier to control bounce feel
    }
    
    // Update bird position using velocity
    bY += birdVelocity;

    // Draw bird with smoothed rotation
    drawRotatedImage(bird, bX, bY, currentRotation);
    
    //store previous Y position for rotation calculation
    previousBY = bY;

    //apply gravity
    bY += gravity;

    //draw score
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score : " + score, 50, 30);
    
    if (!gameOver) {
        requestAnimationFrame(draw);
    }
}

//game state variable
let gameOver = false;
let previousBY = bY;

draw();