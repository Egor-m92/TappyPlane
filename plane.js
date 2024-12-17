import { loadImage } from "./utils.js";

export class Plane {
    static planeImg0;
    width = 88;
    height = 73;
    hitboxWidth = 70;
    hitboxHeight = 65;
    flapPower = 4;
    gravity = 0.15;

    static async preloadImage() {
        Plane.planeImg0 = new Image();
        await loadImage(Plane.planeImg0, "./assets/planeRed1.png");
    }   

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.x = canvas.width / 5;
        this.y = canvas.height / 3;
        this.velocity = 0;
    }

    draw() {
        this.ctx.drawImage(
            Plane.planeImg0, 
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }

    flap() {
        this.velocity = -this.flapPower;
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        this.draw();
    }
}
