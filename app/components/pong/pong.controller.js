/**
 * Created by Jannik on 16.06.2017.
 */
angular.module('playgroundApp').controller('PongController', ['$scope', function ($scope) {
    let canvas;
    let canvasContext;
    let ballX = 50;
    let ballY = 50;
    let ballSpeedX = 10;
    let ballSpeedY = 4;

    let player1Score = 0;
    let player2Score = 0;
    const WINNING_SCORE = 5;
    let showingWinScreen = false;

    let paddle1Y = 250;
    let paddle2Y = 250;
    const PADDLE_THICKNESS = 10;
    const PADDLE_HEIGHT = 100;

    function calculateMousePos(ev) {
        let rect = canvas.getBoundingClientRect();
        let root = document.documentElement;
        let mouseX = ev.clientX - rect.left - root.scrollLeft;
        let mouseY = ev.clientY - rect.top - root.scrollTop;
        return {
            x: mouseX,
            y: mouseY
        };
    }

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    const framesPerSecond = 30;
    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);


    $scope.handleMouseClick = () => {
        handleMouseClick();
    };
    $scope.handleMouseMove = (ev) => {
        let mousePos = calculateMousePos(ev);
        paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
    };

    function handleMouseClick() {
        if (showingWinScreen) {
            player1Score = player2Score = 0;
            showingWinScreen = false;
        }
    }

    function ballReset() {
        if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
            showingWinScreen = true;
        }
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }

    function computerMovement() {
        let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;

        if (paddle2YCenter < ballY - 35) {
            paddle2Y += 6;
        } else if (paddle2YCenter > ballY + 35) {
            paddle2Y -= 6;
        }
    }

    function moveEverything() {
        computerMovement();

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballX < PADDLE_THICKNESS) {
            if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player2Score++;
                ballReset();
            }
        }
        if (ballX > canvas.width - PADDLE_THICKNESS) {
            if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player1Score++;
                ballReset();
            }
        }
        if (ballY < 0 || ballY > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
    }

    function drawNet() {
        for (let i = 0; i < canvas.height; i += 40) {
            colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
        }
    }

    function drawEverything() {
        colorRect(0, 0, canvas.width, canvas.height, 'black');

        if (showingWinScreen) {
            canvasContext.fillStyle = 'white';
            if (player1Score >= WINNING_SCORE) {
                canvasContext.fillText('Left Player Won!', 350, 200);
            } else {
                canvasContext.fillText('Right Player Won!', 350, 200);
            }
            canvasContext.fillText('click to continue', 350, 500);
            return;
        }

        drawNet();

        //this is left player paddle
        colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
        //this is right computer paddle
        colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
        //next line draws the ball
        colorCircle(ballX, ballY, 10, 'white');

        canvasContext.fillText(player1Score.toString(), 100, 100);
        canvasContext.fillText(player2Score.toString(), canvas.width - 100, 100);
    }

    function colorCircle(centerX, centerY, radius, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

    function colorRect(leftX, topY, width, height, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.fillRect(leftX, topY, width, height);
    }
}]);