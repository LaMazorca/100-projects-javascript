const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 448;
canvas.height = 400;

/*VARIABLES DEL JUEGO*/
const $sprite = document.querySelector('#sprite');
const $bricks = document.querySelector('#bricks');
/*VARIABLES DE LA PELOTA*/
const ballRadius = 4;
//posicion de la pelota
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
//velocidad de la pelota
let ballSpeedX = -3;
let ballSpeedY = -3;
/*VARIABLES DE LA PALETA*/
const paddleHeight = 10;
const paddleWidth = 50;
//posicion de la paleta
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;
//Movimiento de la paleta
let rightPressed = false;
let leftPressed = false;
//Sensibildad de movimiento de la paleta
const PADDLE_SENSITIVITY = 7;
//VARIABLES DE LOS LADRILLOS
const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 15;
const brickPadding = 0;
const brickOffsetTop = 80;
const birickOffsetLeft = 18;
const bricks = [];
const BRICK_STATUS = { ACTIVE: 1, DESTROYED: 0 };

for(let c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++){
        //posicion de los ladrillos en la pantalla
        const brickX = (c * (brickWidth + brickPadding)) + birickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        //randomizar el color del ladrillo
        const random = Math.floor(Math.random() * 8);
        bricks[c][r] = { x: brickX, y: brickY, status: BRICK_STATUS.ACTIVE, color: random };
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.drawImage(
        $sprite, //imagen
        30, //clipX: donde empieza a recortar la imagen en X
        174, //clipY: donde empieza a recortar la imagen en Y
        paddleWidth, // tamaño del recorte del ancho
        paddleHeight, // tamaño del recorte del alto
        paddleX, // donde se pinta en X
        paddleY, // donde se pinta en Y
        paddleWidth, // ancho de la pala
        paddleHeight // alto de la pala
    );
}

function drawBricks(){
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            const currentBrick = bricks[c][r];
            if(currentBrick.status === BRICK_STATUS.DESTROYED) continue;

            const clipX = currentBrick.color * 32;
            ctx.drawImage($bricks,clipX,0,brickWidth,brickHeight,currentBrick.x,currentBrick.y,brickWidth,brickHeight);
        }
    }
}

function collisionDetection(){
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            const currentBrick = bricks[c][r];
            if(currentBrick.status === BRICK_STATUS.DESTROYED) continue;

            const isBallSameXAsBrick = ballX > currentBrick.x && ballX < currentBrick.x + brickWidth;
            const isBallSameYAsBrick = ballY > currentBrick.y && ballY < currentBrick.y + brickHeight;

            if(isBallSameXAsBrick && isBallSameYAsBrick){
                ballSpeedY = -ballSpeedY;
                currentBrick.status = BRICK_STATUS.DESTROYED;
            }
        }
    }
}

function ballMovement(){
    //Colisiones con las paredes laterales
    if( ballX + ballSpeedX > canvas.width - ballRadius || //pared derecha
        ballX + ballSpeedX < ballRadius //pared izquierda
    ){
        ballSpeedX = -ballSpeedX;
    }

    //Colisiones con las paredes superiores
    if(ballY + ballSpeedY < ballRadius){
        ballSpeedY = -ballSpeedY;
    }

    const isBallSameXAsPaddle = ballX > paddleX && ballX < paddleX + paddleWidth;
    const isBallTouchingPaddel = ballY + ballSpeedY > paddleY;
    //Colision con la pala
    if( isBallSameXAsPaddle && isBallTouchingPaddel){
        ballSpeedY = -ballSpeedY;
    }else if( //Colisiones con la pared inferior - GAME OVER
        ballY + ballSpeedY > canvas.height - ballRadius
    ){
        console.log('Game Over');
        document.location.reload();
    }

    //Mover la pelota
    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

function paddleMovement(){
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += PADDLE_SENSITIVITY;
    }else if(leftPressed && paddleX > 0){
        paddleX -= PADDLE_SENSITIVITY;
    }
}

function cleanCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents(){
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function keyDownHandler(event){
        const { key } = event;
        if(key === 'Right' || key === 'ArrowRight'){
            rightPressed = true;
        }else if(key === 'Left' || key === 'ArrowLeft'){
            leftPressed = true;
        }
    }

    function keyUpHandler(event){
        const { key } = event;
        if(key === 'Right' || key === 'ArrowRight'){
            rightPressed = false;
        }else if(key === 'Left' || key === 'ArrowLeft'){
            leftPressed = false;
        }
    }
}

//Dibujos del juego y checks de colisiones
function draw () {
    //limpiar elementos
    cleanCanvas();
    //Dibujar elementos
    drawBall();
    drawPaddle();
    drawBricks();

    //Colisiones y movimientos
    collisionDetection();
    ballMovement();
    paddleMovement();

    window.requestAnimationFrame(draw);
}

draw();
initEvents();