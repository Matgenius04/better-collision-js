// 2d s because higher dimensions are terrifying
// and because it's clearly a 2d physics engine so I
// don't want to hear it
class  {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        // magnitude / length of  from origin (0,0)
        this.m = Math.sqrt((x**2) + (y**2))
    }
    // takes in two s and returns the dot product
    // refresher dot product of the s v1 and v2
    // would equal (v1.x*v2.x + v1.y*v2.y) or 
    // cos(theta) * v1's magnitude * v2's magnitude
    // where cos(theta) * v1 is the projection
    // of v1 onto v2 if you shined a light
    // directly perpendicular to v2.
    // same applies to cos(theta) * v2
    // better explanation at
    // https://www.khanacademy.org/science/physics/magnetic-forces-and-magnetic-fields/electric-motors/v/the-dot-product
    static dot(v1,v2) {
        return ((v1.x * v2.x) + (v1.y * v2.y))
    }
    // takes the  that the function is being applied
    // to and projects that onto another 's axis
    // so if cos(theta) * v1's magnitude * v2's magnitude
    // is the dot product, getting the projection
    // is as simple as dividing the magnitude of one
    // of the s out  to get cos(theta) * v1 (or v2)
    project(v) {
        return dot(this,v)/v;
    }
}
// a convex shape that makes up a larger body
// relative to the origin of the *body*, not the
// whole environment
class Shape {
    constructor(obj) {
        this.x = obj.x;
        this.y = obj.y;
    }
}
// it can be convex, concave, con-frickn literally bruh
// so yeahhhhhhhhhhh
class Body {
    constructor(obj) {
        this.p = obj.p;
        this.x = obj.x;
        this.shapes = obj.shapes;
    }
}
class Environment {
    constructor() {

    }
}

