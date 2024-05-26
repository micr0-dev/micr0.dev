const backgroundCanvas = document.getElementById('magneticCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

let mouse = {
    x: null,
    y: null,
    radius: 100
};

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Line {
    constructor(x, y, length, angle, strokeColor) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = angle;
        this.strokeColor = strokeColor;
    }

    draw() {
        const startX = this.x - this.length * Math.cos(this.angle);
        const startY = this.y - this.length * Math.sin(this.angle);
        const endX = this.x + this.length * Math.cos(this.angle);
        const endY = this.y + this.length * Math.sin(this.angle);
        backgroundCtx.beginPath();
        backgroundCtx.moveTo(startX, startY);
        backgroundCtx.lineTo(endX, endY);
        backgroundCtx.strokeStyle = this.strokeColor;
        backgroundCtx.lineWidth = 3;
        backgroundCtx.stroke();
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const angleToMouse = Math.atan2(dy, dx);

        const scroll = window.scrollY / 1000;

        let angleDiff = angleToMouse - this.angle + scroll;
        while (angleDiff > Math.PI) {
            angleDiff -= 2 * Math.PI;
        }
        while (angleDiff < -Math.PI) {
            angleDiff += 2 * Math.PI;
        }

        const strength = 0.05;
        this.angle += angleDiff * strength;

        this.angle = (this.angle + 2 * Math.PI) % (2 * Math.PI);

        this.draw();
    }

}

let linesArray;

function init() {
    linesArray = [];
    const spacing = 50;
    const strokeColor = getComputedStyle(document.body).getPropertyValue("background-color");

    const horizontalCount = Math.ceil(backgroundCanvas.width / spacing);
    const verticalCount = Math.ceil(backgroundCanvas.height / spacing);

    for (let i = 0; i < horizontalCount; i++) {
        for (let j = 0; j < verticalCount; j++) {
            const x = (i + 0.5) * spacing;
            const y = (j + 0.5) * spacing;
            const length = (Math.random() * 1) + 4;
            const angle = (Math.random() * 2 * Math.PI) - Math.PI;
            linesArray.push(new Line(x, y, length, angle, strokeColor));
        }
    }
}

let fps = 0;
let lastCalledTime;
const fpsThreshold = 5;
const frameSkipThreshold = 50;
let frameSkipCounter = 0;

function updateFPS() {
    if (!lastCalledTime) {
        lastCalledTime = performance.now();
        fps = 0;
        return;
    }
    const delta = (performance.now() - lastCalledTime) / 1000;
    lastCalledTime = performance.now();
    fps = 1 / delta;
}

function animate() {
    requestAnimationFrame(animate);
    updateFPS();

    if (fps > fpsThreshold) {
        backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        for (let i = 0; i < linesArray.length; i++) {
            linesArray[i].update();
        }
    } else {
        console.log("FPS: ", fps, "FPS too low, skipping frame");
        frameSkipCounter++;
        if (frameSkipCounter > frameSkipThreshold) {
            linesArray = [];
            return;
        }
    }
}

init();
animate();

window.addEventListener('resize', function () {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
    init();
});