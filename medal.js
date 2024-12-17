import { loadImage } from "./utils.js";

export class Medal {
    static bronzeImg;
    static silverImg;
    static goldImg;

    static async preloadImage() {
        Medal.bronzeImg = new Image();
        await loadImage(Medal.bronzeImg, "./assets/medalBronze.png");
        Medal.silverImg = new Image();
        await loadImage(Medal.silverImg, "./assets/medalSilver.png");
        Medal.goldImg = new Image();
        await loadImage(Medal.goldImg, "./assets/medalGold.png");
    }
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.x = canvas.width / 3 + 57;
        this.y = canvas.height / 1.8;
    }

    drawSilver() {
        this.ctx.drawImage(
            Medal.silverImg,
            this.x,
            this.y);
    }
    drawGold() {
        this.ctx.drawImage(
            Medal.goldImg,
            this.x,
            this.y
        );
    }
    drawBroze() {
        this.ctx.drawImage(
            Medal.bronzeImg,
            this.x,
            this.y
        );
    }
}