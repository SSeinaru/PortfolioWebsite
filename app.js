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

window.addEventListener("mousemove", function(e){
    mouse.x = e.clientX; 
    mouse.y = e.clientY;
});

class Eye {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.irisRadius = Math.min(width, height) / 3;
        this.irisWidth = this.width * 0.8;
        this.irisHeight = this.height * 0.8; 
    }
    draw(){
        // draw eye (red part)
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2, true);
        ctx.fillStyle = "#950019"; 
        ctx.fill();
        ctx.closePath();

        // draw iris (white part)
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.irisWidth, this.irisHeight, 0, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fill();
        ctx.closePath();

        // draw pupil
        let pupil_dx = mouse.x - this.x;
        let pupil_dy = mouse.y - this.y;
        theta = Math.atan2(pupil_dy, pupil_dx)

        let pupilRadius = Math.min(this.width, this.height) / 4;
        let pupil_x = this.x + Math.cos(theta) * this.width/2.5;
        let pupil_y = this.y + Math.sin(theta) * this.height/2.5;

        ctx.beginPath();
        ctx.arc(pupil_x, pupil_y, pupilRadius, 0, Math.PI * 2, true)
        ctx.fillStyle = "#87CEEB"; 
        ctx.fill();
        ctx.closePath();

        // draw pupil dot
        ctx.beginPath();
        ctx.arc(pupil_x, pupil_y, pupilRadius / 2, 0, Math.PI * 2, true)
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
    }
}

function init(){
    eyes = [];
    let overlapping = false;
    let numberOfEyes = 1000;
    let protection = 10000;
    let counter = 0;

    while(eyes.length < numberOfEyes && counter < protection) {
        let eye = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.floor(Math.random() * 100) + 10,
            height: Math.floor(Math.random() * 100) + 10
        };
    
        overlapping = false; 
        for (let i = 0; i < eyes.length; i++){
            let previousEye = eyes[i];
            let dx = eye.x - previousEye.x;
            let dy = eye.y - previousEye.y;
            let distance = Math.sqrt(dx*dx + dy*dy)
            if (distance < (Math.max(eye.width, eye.height) + Math.max(previousEye.width, previousEye.height))){
                overlapping = true;
                break;
            }
        }
        if (!overlapping){
            eyes.push(new Eye(eye.x, eye.y, eye.width, eye.height))
        }
        counter++;
    }
}

function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, .25)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < eyes.length; i++){
        eyes[i].draw();
    }
}

init();
animate();

window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});
