// 2d vectors because higher dimensions are terrifying
// and because it's clearly a 2d physics engine so I
// don't want to hear it
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // magnitude / length of vector from origin (0,0)
        this.m = this.magnitude();
    }
    // takes in two vectors and returns the dot product
    // refresher: dot product of the vectors v1 and v2
    // would equal (v1.x*v2.x + v1.y*v2.y) or 
    // cos(theta) * v1's magnitude * v2's magnitude
    // where cos(theta) * v1 is the projection
    // of v1 onto v2 if you shined a light
    // directly perpendicular to v2.
    // same applies to cos(theta) * v2
    // better explanation at
    // https://www.khanacademy.org/science/physics/magnetic-forces-and-magnetic-fields/electric-motors/v/the-dot-product
    static dot(v1, v2) {
        return ((v1.x * v2.x) + (v1.y * v2.y))
    }
    // takes the vector that the function is being applied
    // to (this) and projects that onto another vector (v)'s axis
    // so if cos(theta) * v1's magnitude * v2's magnitude
    // is the dot product, getting the projection
    // is as simple as dividing the magnitude of one
    // of the vectors out to get cos(theta) * v1 (or v2)
    project(v) {
        return Vector.dot(this, v);
    }
    // returns the magnitude using
    // the classic distance formula
    // / pythagorean's theorem
    magnitude() {
        return Math.sqrt((this.x ** 2) + (this.y ** 2));
    }
    // normalizes vector by dividing by
    // magnitude (think of dividing by the hypotenuse
    // of a right triangle to get a length of 1)
    normalize() {
        return this.divide(this.m);
    }
    // scalar addition
    add(n) {
        return new Vector(this.x + n, this.y + n);
    }
    // scalar subtraction
    subtract(n) {
        return new Vector(this.x - n, this.y - n);
    }
    // scalar multiplication
    multiply(n) {
        return new Vector(this.x * n, this.y * n);
    }
    // scalar division
    divide(n) {
        return new Vector(this.x / n, this.y / n);
    }
    // e stands for element, so
    // it's basically just element
    // to element addition
    eAdd(v = new Vector()) {
        return new Vector(this.x+v.x,this.y+v.y);
    }
    // element to element subtraction
    eSubtract(v = new Vector()) {
        return new Vector(this.x-v.x,this.y-v.y);
    }
    // element to element multiplication
    eMultiply(v = new Vector()) {
        return new Vector(this.x-v.x,this.y-v.y);
    }
    // element to element division
    eDivide(v = new Vector()) {
        return new Vector(this.x-v.x,this.y-v.y);
    }
    // get perpendicular vector by swapping
    // x and y and then negating one of them
    perpendicular() {
        return new Vector(this.y, -this.x);
    }
}
// a convex shape that makes up a larger body
// relative to the origin of the *body*, not the
// whole environment
// from http://www.dyn4j.org/2010/01/sat/
class Shape {
    constructor(obj = {
        x: 0,
        y: 0,
        // points are in a connect-the-dots fashion
        // where the first point in the array is then
        // connected to the next point
        points: [
            // arbitrary square that's
            // centered around the origin
            new Vector(-1, -1), 
            new Vector(-1, 1), 
            new Vector(1, 1), 
            new Vector(1, -1)
        ]
    }) {
        this.x = obj.x;
        this.y = obj.y;
        this.points = obj.points;
        // gets the edge normals
        // so it can later be used
        // to be projected on
        this.axes = this.getAxes();
    }
    // inputs this.points (as array of vectors)
    // outputs edge normals/axes to test
    // that are automatically normalized
    getAxes() {
        let output = [];
        // for each point
        for (let i = 0; i < this.points.length; i++) {
            // create the two points
            // get the first point
            let p1 = this.points[i];
            // get the next point in array
            // if last point, then connect
            // back to the first point again
            let p2 = this.points[(i+1)%(this.points.length)];
            // get vector representing the side
            // made by connecting p1 and p2
            let edge = p1.eSubtract(p2);
            // get the perpendicular vector
            // of the edge and then normalize
            let normal = edge.perpendicular().normalize();
            output.push(normal);
        }
        return output;
    }
    // inputs a normalized vector and outputs
    // an object with the min and max 
    // of the projection. NOT THE SAME AS
    // THE VECTOR FUNCTION project()
    project(axis = new Vector()) {
        let min, max;
        for (let i = 0;i < this.points.length; i++) {
            let p = axis.project(this.points[i]);
            if (!min || p < min) {
                min = p;
            } else if (!max || p > max) {
                max = p;
            }
        }
        return {min: min,max: max};
    }
    static collision(s1 = new Shape, s2 = new Shape) {
        let ol;
        let smallestAxis;
        for (let i = 0; i < s1.axes.length; i++) {
            let axis = s1[i]; // element selected is axis;
            let p1 = s1.project(axis); // projects the shape s1 onto the axis
            let p2 = s2.project(axis); // projects the shape s2 onto the axis
            // still need to explain
            let o = overlap(p1, p2);
            console.log(o);
            if (!o) {
                return false;
            } else {
                if (o == p1.max-p1.min || o == p2.max-p2.min) {
                    let mins = Math.abs(p1.min - p2.min);
                    let maxes = Math.abs(p1.max - p2.max);
                    if (mins < maxes) {
                        o += mins;
                      } else {
                        o += maxes;
                      }
                }
                if (!ol || o < ol) {
                    ol = o;
                    smallestAxis = axis;
                }
            }
        }
        for (let i = 0; i < s2.axes.length; i++) {
            let axis = s2[i];
            let p1 = s1.project(axis);
            let p2 = s2.project(axis);
            let o = !overlap(p1, p2)
            console.log(o);
            if (!o) {
                return false
            } else {
                if (o == p1.max-p1.min || o == p2.max-p2.min) {
                    let mins = Math.abs(p1.min - p2.min);
                    let maxes = Math.abs(p1.max - p2.max);
                    if (mins < maxes) {
                        o += mins;
                      } else {
                        o += maxes;
                      }
                }
                if (!ol || o < ol) {
                    ol = o;
                    smallestAxis = axis;
                }
            }
        }
        // gets minimum translation vector which
        // tells what is the nearest point to the
        let mtv = new Vector(smallestAxis.x, smallestAxis.y).multiply(ol);
        console.log("collision!")
        return mtv;
    }
}
// it can be convex, concave, con-frickn literally bruh
// so yeahhhhhhhhhhh
class Body {
    constructor(obj = {
        p: {
            x: 0,
            y: 0,
            r: 0, // in radians
        }
    }) {
        this.p = obj.p;
        this.x = obj.x;
        this.shapes = obj.shapes;
    }
}
class Environment {
    constructor() {

    }
}

function overlap(p1 = {min: 0, max: 0}, p2 = {min: 0, max: 0}) {
    if (Math.max(p1.min,p2.min) < Math.min(p1.max,p2.max)) {
        return Math.min(p1.max - p1.min, p1.max - p2.min, p2.max - p1.min, p2.max - p2.min);
    }
    return false;
}