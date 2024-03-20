const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let eyes = [];
let theta;

const mouse = {
    x: undefined,
    y: undefined,
};



window.addEventListener("mousemove", function(e){
    mouse.x = event.x; 
    mouse.y = event.y;
});

class Eye {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius; 
    }
    draw(){
    
    
    // draw eye
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "950019";

    ctx.closePath();

    // draw iris
    let iris_dx = mouse.x - this.x;
    let iris_dy = mouse.y - this.y;
    theta = Math.atan2(iris_dy, iris_dx);
    let iris_x = this.x + Math.cos(theta) * this.radius/10;
    let iris_y = this.y + Math.sin(theta) * this.radius/10;
    let irisRadius = this.radius/1.2;

    ctx.beginPath();
    ctx.arc(iris_x, iris_y, irisRadius, 0, Math.PI * 2, true);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    // pupil
    let pupil_dx = mouse.x - this.x;
    let pupil_dy = mouse.y - this.y;
    theta = Math.atan2(pupil_dy, pupil_dx)

    let pupilRadius = this.radius / 2.5;
    let pupil_x = this.x + Math.cos(theta) * this.radius/1.9;
    let pupil_y = this.y + Math.sin(theta) * this.radius/1.9;

    ctx.beginPath();
    ctx.arc(pupil_x, pupil_y, pupilRadius, 0, Math.PI * 2, true)
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    //draw mouse
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 1, 0, Math.PI * 2, true)
    ctx.fillStyle = "gold";
    ctx.fill();
    ctx.closePath();

    var img = document.getElementById("card");
    ctx.drawImage(img, 525, 50);
    }
}
function init(){
    
    eyes = [];
    let overlapping = false;
    let numberOfEyes = 100;
    let protection = 10000;
    let counter = 0;

    while(eyes.length < numberOfEyes && counter < protection) {
        let eye = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.floor(Math.random() * 100) + 10
        };
    
        overlapping = false; 
        for (let i = 0; i < eyes.length; i++){
            let previousEye = eyes[i];
            let dx = eye.x - previousEye.x;
            let dy = eye.y - previousEye.y;
            let distance = Math.sqrt(dx*dx + dy*dy)
            if (distance < (eye.radius + previousEye.radius)){
                overlapping = true;
                break;
            }
        }
        if (!overlapping){
            eyes.push(new Eye(eye.x, eye.y, eye.radius))
        }
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
    canvas.width = this.innerWidth;
    canvas.height = this.innerHeight;
    init();
})

$(function(){

    var t;
    $("body").mousemove(function(){

        clearTimeout(t); //Clear restore volume function

        //Mute
        var audio = document.getElementById("audio");
        audio.volume=0.0;

        //Time restore volume
        t = setTimeout(function(){
            var audio = document.getElementById("audio");
            audio.volume=1.0;
        }, 200);
    });
});