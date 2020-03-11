let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let drawing = true;
let keydown = {};
const square = new Shape({
    x: 0,
    y: 0,
    points: [
        new Vector(-1, -1),
        new Vector(-1, 1),
        // new Vector(0,2),
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
        if (!keydown[ev.key.toLowerCase()]) {
            keydown[ev.key.toLowerCase()] = true;
        }
    })
    window.addEventListener("keyup", (ev) => {
        if (keydown[ev.key.toLowerCase()]) {
            keydown[ev.key.toLowerCase()] = false;
        }
    })
    requestAnimationFrame(draw);
}

function draw() {
    ctx.clearRect(-c.width/2,-c.height/2,c.width,c.height);
    if (drawing == true) {
        console.clear();
        checkCombos();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        let shapes = [square,pentagon];
        // console.dir(shapes);
        let edgeNormals = square.getAxes();
        edgeNormals.forEach((v,i) =>edgeNormals[i]= v.multiply(100));
        // console.log(JSON.stringify(edgeNormals));
        for (let i = 0; i < shapes.length; i++) {
            console.log(shapes[i]);
            let shapePoints = [];
            console.log(shapePoints);
            for (let j = 0; j < shapes[i].points.length; j++) {
                shapePoints.push(shapes[i].points[j].eAdd(new Vector(shapes[i].x,shapes[i].y)).multiply(100));
            }
            ctx.beginPath();
            ctx.moveTo(shapePoints[0].x, shapePoints[0].y);
            for (let j = 0; j < shapePoints.length; j++) {
                ctx.lineTo(shapePoints[(j+1)%shapePoints.length].x,shapePoints[(j+1)%shapePoints.length].y)
            }
            ctx.stroke();
        }
        for (let i = 0; i < edgeNormals.length; i++) {
            ctx.moveTo(square.points[i].x,square.points[i].y);
            ctx.lineTo(
                square.points[(i+1)%square.points.length].x,
                square.points[(i+1)%square.points.length].y
                );
            ctx.stroke();
            // ctx.moveTo(0,0);
            // ctx.lineTo(
            //     edgeNormals[i].x,
            //     edgeNormals[i].y
            // );
            // ctx.stroke();
        }
        console.log(Shape.collision(square,pentagon))
    }
    setTimeout(()=>{
        requestAnimationFrame(draw);
    },1000/60);
}

function checkCombos() {
    console.log(keydown);
    if (keydown["w"]) {
        square.y++;
    }
    if (keydown["a"]) {
        square.x--;
    }
    if (keydown["s"]) {
        square.y--;
    }
    if (keydown["d"]) {
        square.x++;
    }
}

setup();