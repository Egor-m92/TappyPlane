import { Rock } from "./rock.js";
import { loadImage } from "./utils.js";
import { Groud } from "./ground.js";
import { Plane } from "./plane.js";
import { checkCollision } from "./collision.js";
import { Medal } from "./medal.js";

export class Game {
    SPEED = 3;
    DISTANCE_BETWEEN_ROCKS = 4.5 * Rock.width;
    frameCount = 0;
    score = 0;
    bestScore = 0;
    isGameStarted = false;
    game = true;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        const height = window.visualViewport ? 
        window.visualViewport.height : window.innerHeight;
        const width = window.visualViewport ?
        Math.min(window.visualViewport.width, height * 0.6) : 
        Math.min(window.innerWidth, height * 0.6);
        this.canvas.height = 640;
        this.canvas.width = 640 + width / height;

        this.BG_IMG = new Image();
        this.gameOver_Img = new Image();
        this.getReady_Img =  new Image();
        this.rocks = [new Rock(this.canvas)];
        this.ground = new Groud(this.canvas);
        this.plane = new Plane(this.canvas);
        this.medal = new Medal(this.canvas);
        this.sound = new Audio('./assets/sfx_point.mp3');
        this.avaria = new Audio('./assets/avaria.mp3');
    }

    async loadAssets() {
        await Promise.all([
            loadImage(this.BG_IMG, './assets/background.png'),
            loadImage(this.gameOver_Img, './assets/textGameOver.png'),
            loadImage(this.getReady_Img, './assets/textGetReady.png'),
            Rock.preloadImages(),
            Groud.preloadImage(),
            Plane.preloadImage(),
            Medal.preloadImage(),
        ]);
    }

    start() {
        this.score = 0;
        this.bestScore = localStorage.getItem('BestScore');
        this.initializeCotrols();
        this.intervalId = setInterval(() => this.draw(), 10);
    }

    stop() {
        clearInterval(this.intervalId);
        this.game = false;
        this.ctx.drawImage(this.gameOver_Img, this.canvas.width / 5, this.canvas.height / 4.8);
        if(this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('BestScore', this.bestScore);
        }
        this.displayScore(this.bestScore, this.canvas.height / 2.2, "Лучший счёт: ");
        if (this.score >= 20 && this.score < 50) {
            this.medal.drawSilver();
            return;
        }
        if (this.score >= 50){
            this.medal.drawGold();
            return;
        }
        else{
            this.medal.drawBroze();
        }
    }

    draw() {
        this.ctx.drawImage(this.BG_IMG, 0, 0, this.canvas.width, this.canvas.height);

        if(!this.isGameStarted) {
            this.ground.update(this.SPEED);
            this.plane.draw();
            this.displayScore(this.score, 25, "Очки: ");
            this.ctx.drawImage(this.getReady_Img, this.canvas.width / 5, this.canvas.height / 2);
            return;
        }

        if (this.frameCount * this.SPEED > this.DISTANCE_BETWEEN_ROCKS) {
            this.rocks.push(new Rock(this.canvas));
            this.frameCount = 0;
        }
        this.updateRocks();
        this.ground.update(this.SPEED);
        this.plane.update();
        this.displayScore(this.score, 25, "Очки: ");

        if(checkCollision(this.plane, this.rocks, this.ground)) {
            this.avaria.play();
            this.stop();
        }
        this.frameCount++;
    }

    updateRocks() {
        if (this.score == 50) this.SPEED = 4.1;
        for (let i = 0; i < this.rocks.length; i++) {
            this.rocks[i].update(this.SPEED);
            if (this.rocks[i].isOffScreen()) {
                this.rocks.shift();
                i--;
                this.score++;
                this.sound.play();
            }
        }
    }

    initializeCotrols() {
        if('ontouchstart' in window) {
            document.addEventListener('touchstart', this.handleFlap);
        }
        else {
            document.addEventListener('mousedown', this.handleFlap);
        }
        document.addEventListener('keydown', this.handleFlap);
    }

    handleFlap = (event) => {
        if(event.type === 'keydown' && event.code !== 'Space') return;
        if(!this.isGameStarted) this.isGameStarted = true;
        this.plane.flap();
        if (!this.game){
            location.reload();
        }
        console.log('Key');
    }

    displayScore(score, height, text) {
        this.ctx.font = '60px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';

        this.ctx.lineWidth = 8;
        this.ctx.strokeStyle = '#533048';
        this.ctx.textBaseline = 'top';
        this.ctx.strokeText(text + score, this.canvas.width / 2, height);
        this.ctx.fillText(text + score, this.canvas.width / 2, height);
    }
}