export function degToRad(angle) {
    return angle * 0.01745329252;
};

export function fixNum(n, fix=3) {
    return Number(n.toFixed(fix));
}

export class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new V2(this.x, this.y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    copy(_v2) {
        this.x = _v2.x;
        this.y = _v2.y;
    }

    equals(_v2) {
        return (this.x === _v2.x && this.y === _v2.y);
    }

    sub(_v2) {
        return new V2(this.x - _v2.x, this.y - _v2.y);
    }

    multiply(_v2) {
        return new V2(this.x * _v2.x, this.y * _v2.y);
    }

    dot(_v2) {
        return (this.x * _v2.x) + (this.y * _v2.y);
    }

    cross(_v2) {
        return new V2(_v2.y, -_v2.x);
    }
};

/*
    Math from http://www.blackpawn.com/texts/pointinpoly/
*/
export function isPointInTriangle(point, triangleVertices) {
    let v0 = triangleVertices[2].sub(triangleVertices[0]);
    let v1 = triangleVertices[1].sub(triangleVertices[0]);
    let v2 = point.sub(triangleVertices[0]);

    let dot00 = v0.dot(v0);
    let dot01 = v0.dot(v1);
    let dot02 = v0.dot(v2);
    let dot11 = v1.dot(v1);
    let dot12 = v1.dot(v2);

    let inv = 1 / (dot00 * dot11 - dot01 * dot01);
    let u = (dot11 * dot02 - dot01 * dot12) * inv;
    let v = (dot00 * dot12 - dot01 * dot02) * inv;

    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);
}

export function _isPointInTriangle(p, [p0, p1, p2]) {
    var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    var sign = A < 0 ? -1 : 1;
    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}
