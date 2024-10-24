const canvas = document.createElement("canvas");
document.body.insertBefore(canvas, document.body.firstChild);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "-1";

let eyes = [];
let theta;

const mouse = {
    x: undefined,
    y: undefined,
};

window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Eye {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.irisRadius = Math.min(width, height) / 3;
        this.irisWidth = this.width * 0.8;
        this.irisHeight = this.height * 0.8;
        this.isBlinking = false;
        this.blinkTime = 0;
        this.blinkDuration = 20; // Blink duration in frames (slightly slower)
        this.pupilRadius = Math.min(this.width, this.height) / 5; // Adjusted pupil size
        this.pupilDotRadius = this.pupilRadius / 2; // Adjusted pupil dot size
    }

    draw() {
        // Check if the eye is blinking
        if (this.isBlinking) {
            // Draw closed eye
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.width, this.height / 5, 0, 0, Math.PI * 2, true);
            ctx.fillStyle = "#950019";
            ctx.fill();
            ctx.closePath();

            // Decrease blink time
            this.blinkTime--;
            if (this.blinkTime <= 0) {
                this.isBlinking = false;
            }
            return;
        }

        // draw eye (red part)
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2, true);
        ctx.fillStyle = "#A70010";
        ctx.fill();
        ctx.closePath();

        // draw iris (white part)
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.irisWidth, this.irisHeight, 0, 0, Math.PI * 2, true);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();

        // draw pupil
        let pupil_dx = mouse.x - this.x;
        let pupil_dy = mouse.y - this.y;
        theta = Math.atan2(pupil_dy, pupil_dx);

        let pupil_x = this.x + Math.cos(theta) * this.width / 2.5;
        let pupil_y = this.y + Math.sin(theta) * this.height / 2.5;

        ctx.beginPath();
        ctx.arc(pupil_x, pupil_y, this.pupilRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = "#A70010";
        ctx.fill();
        ctx.closePath();

        // draw pupil dot
        ctx.beginPath();
        ctx.arc(pupil_x, pupil_y, this.pupilDotRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = "#A70010";
        ctx.fill();
        ctx.closePath();
    }

    blink() {
        this.isBlinking = true;
        this.blinkTime = this.blinkDuration;
    }
}

function init() {
    eyes = [];
    let overlapping = false;
    let numberOfEyes = 1000;
    let protection = 10000;
    let counter = 0;

    while (eyes.length < numberOfEyes && counter < protection) {
        let eye = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.floor(Math.random() * 100) + 10,
            height: Math.floor(Math.random() * 100) + 10
        };

        overlapping = false;
        for (let i = 0; i < eyes.length; i++) {
            let previousEye = eyes[i];
            let dx = eye.x - previousEye.x;
            let dy = eye.y - previousEye.y;
            let distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < (Math.max(eye.width, eye.height) + Math.max(previousEye.width, previousEye.height))) {
                overlapping = true;
                break;
            }
        }
        if (!overlapping) {
            eyes.push(new Eye(eye.x, eye.y, eye.width, eye.height))
        }
        counter++;
    }
}

class App {
    RedirectTo(path) {
        window.location.pathname = path;
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, .25)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < eyes.length; i++) {
        eyes[i].draw();
    }
}

function triggerRandomBlinks() {
    const randomInterval = Math.random() * 2000 + 1000; // Random interval between 1 and 3 seconds
    setTimeout(() => {
        const numberOfBlinks = Math.floor(Math.random() * 20) + 1; // Random number of eyes to blink (between 1 and 5)
        for (let i = 0; i < numberOfBlinks; i++) {
            const randomEye = eyes[Math.floor(Math.random() * eyes.length)];
            randomEye.blink();
        }
        triggerRandomBlinks(); // Recursively call to keep the blinks happening
    }, randomInterval);
}

init();
animate();
triggerRandomBlinks();
let app = new App();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

