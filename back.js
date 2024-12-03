function createFloatingImage() {
    const container = document.getElementById('container');

    const img = document.createElement('img');
    img.src = '/resources/effects/Bubbles.png';
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
const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d");

const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipe_up = new Image();
const pipe_down = new Image();

bird.src = '/resources/effects/Bird.png';
bg.src = '/resources/effects/Background.png';
fg.src = '/resources/effects/Foreground.png';
pipe_up.src = '/resources/effects/PipeNorth.png';
pipe_down.src = '/resources/effects/PipeSouth.png';

let constant
let score = 0;
let gravity = 1.5;
let bx = 10; //bird x position
let by = 150; //bird y position
let gap = 150; //gap between pipes(top, bottom)
let pipes = [];
pipes[0] = {
    x: canvas.width,
    y: 0	
};


document.addEventListener("keydown", moveUp);
function moveUp() {
    by -= 25;
}


function draw() {
    ctx.drawImage(bg, 0, 0);

    //init pipe
    for (let i = 0; i < pipes.length; i++) {
        constant = pipe_up.height + gap
        ctx.drawImage(pipe_up, pipes[i].x, pipes[i].y);
        ctx.drawImage(pipe_down, pipes[i].x, pipes[i].y + constant);
    }

    //pipe to left
    pipes[i].x--;

    //add pipe
    if (pipes[i].x === 125) {
        pipes.push({
            x: canvas.width,
            y: Math.floor(math.random()*pipe_up.height) - pipe_up.height
        })
    }

    //collision check
    checkGameOver();

    //score record
    if (pipes[i].x === 5) {
        score++;
    }


    ctx.drawImage(fg, 0, canvas.height - fg.height);
    ctx.drawImage(bird, bx, by);

    //bird move downwards
    by += gravity;

    ctx.fillText("Score : " + score, 10, canvas.height - 20);
    requestAnimationFrame(draw);
}

//check collision
// function checkGameOver() {
//     if()
// }

draw();
