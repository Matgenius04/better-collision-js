let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let drawing = true;
let keydown = [];
const square = new Shape({
    x: 0,
    y: 0,
    points: [
        new Vector(-1, -1),
        new Vector(-1, 1),
        new Vector(0,2),
        new Vector(1, 1),
        new Vector(1, -1)
    ]
})
const pentagon = new Shape({
    x: 0,
    y: 0,
    points: [
        new Vector(-2, -1),
        new Vector(-1, 4),
        new Vector(0,3),
        new Vector(1, 1),
        new Vector(2, -3)
    ]
})

function setup() {
    let body = document.querySelector("body");
    c.width = body.clientWidth;
    c.height = body.clientHeight;
    ctx.save();
    ctx.translate(c.width / 2, c.height / 2);
    ctx.scale(1, -1);
    window.addEventListener("change", (ev) => {
        ctx.restore();
        c.width = body.clientWidth;
        c.height = body.clientHeight;
        ctx.translate(c.width / 2, c.height / 2);
        ctx.scale(1, -1);
    });
    window.addEventListener("keydown", (ev) => {
        if (!keydown.includes(ev.key.toLowerCase())) {
            keydown.push(ev.key.toLowerCase());
        }
    })
    window.addEventListener("keyup", (ev) => {
        if (keydown.includes(ev.key.toLowerCase())) {
            keydown.splice(keydown.findIndex((v) => ev.key.toLowerCase()),1);
        }
    })
    requestAnimationFrame(draw);
}

function draw() {
    if (drawing == true) {
        checkCombos();
        console.clear();
        ctx.clearRect(-c.width/2,-c.height/2,c.width,c.height);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        let shapes = [square,pentagon];
        console.log(JSON.stringify(shapes));
        let edgeNormals = square.getAxes();
        edgeNormals.forEach((v,i) =>edgeNormals[i]= v.multiply(100));
        console.log(JSON.stringify(edgeNormals));
        for (let i = 0; i < shapes.length; i++) {
            ctx.translate(shapes[i].x,shapes[i].y);
            let shapePoints = Object.create(shapes[i].points);
            shapePoints.forEach((v,i) => shapePoints[i] = v.multiply(100));
            ctx.moveTo(shapePoints[0].x, shapePoints[0].y);
            for (let j = 0; j < shapePoints.length; j++) {
                ctx.lineTo(shapePoints[(j+1)%shapePoints.length].x,shapePoints[(j+1)%shapePoints.length].y)
            }
            ctx.stroke();
            ctx.translate(-shapes[i].x,-shapes[i].y);
        }
        // for (let i = 0; i < edgeNormals.length; i++) {
        //     ctx.moveTo(squarePoints[i].x,squarePoints[i].y);
        //     ctx.lineTo(
        //         squarePoints[(i+1)%squarePoints.length].x,
        //         squarePoints[(i+1)%squarePoints.length].y
        //         );
        //     ctx.stroke();
        //     // ctx.moveTo(0,0);
        //     // ctx.lineTo(
        //     //     edgeNormals[i].x,
        //     //     edgeNormals[i].y
        //     // );
        //     // ctx.stroke();
        // }
        console.log(Shape.collision(square,pentagon))
    }
    setTimeout(()=>{
        requestAnimationFrame(draw);
    },1000/60);
}

function checkCombos() {
    console.log(keydown);
    if (keydown.includes("w")) {
        square.y++;
    }
    if (keydown.includes("a")) {
        square.x--;
    }
    if (keydown.includes("s")) {
        square.y--;
    }
    if (keydown.includes("d")) {
        square.x++;
    }
}

setup();