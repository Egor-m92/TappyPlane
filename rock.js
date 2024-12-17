import { loadImage } from "./utils.js";

export class Rock {
    static width = 100;
    static topRockImg;
    static bottonRockImg;
    width = Rock.width;
    spacing = 160;

    static async preloadImages() {
        Rock.topRockImg = new Image();
        Rock.bottonRockImg = new Image();
        await Promise.all([
            loadImage(Rock.topRockImg, "./assets/rockDown.png"),
            loadImage(Rock.bottonRockImg, "./assets/rock.png"),
        ]);
    }

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvasHeight = canvas.height;
        this.top = this.canvasHeight / 10 + Math.round(Math.random() * this.canvasHeight / 3);
        this.botton = this.top + this.spacing;
        this.x = canvas.width;
    }

    draw() {
        this.ctx.drawImage(
            Rock.topRockImg,
            this.x,
            this.top - Rock.topRockImg.height
        );

        this.ctx.drawImage(
            Rock.bottonRockImg,
            this.x,
            this.botton
        );
    }

    update(speed = 3) {
        this.x -= speed;
        this.draw();
    }

    isOffScreen() {
        return this.x < - this.width;
    }
}