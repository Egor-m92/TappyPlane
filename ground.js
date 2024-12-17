import { loadImage } from "./utils.js";

export class Groud {
    static groundImg;
    width = 808;
    height = 71;

    static async preloadImage() {
        Groud.groundImg = new Image();
        await loadImage(Groud.groundImg, "./assets/groundDirt.png");
    }

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.x = 0;
        this.y = canvas.height - this.height;
    }

    draw() {
        this.ctx.drawImage(
            Groud.groundImg,
            this.x,
            this.y
        );

        this.ctx.drawImage(
            Groud.groundImg,
            this.x + this.width,
            this.y
        );
    }

    update(speed = 3) {
        this.x -= speed;
        if (this.x <= -this.width) this.x = 0;
        this.draw();
    }


}