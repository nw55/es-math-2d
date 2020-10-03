import { OffsetScaleTransformation, RectLike, Vector2Like } from './common';

export class Vector2 implements Vector2Like {
    static readonly zero = new Vector2(0, 0);
    static readonly x = new Vector2(1, 0);
    static readonly y = new Vector2(0, 1);
    static readonly invalid = new Vector2(NaN, NaN);

    static fromPolar(angle: number, length = 1) {
        return new Vector2(
            Math.cos(angle) * length,
            Math.sin(angle) * length
        );
    }

    static from(p: [number, number] | Vector2Like) {
        if (Array.isArray(p))
            return new Vector2(p[0], p[1]);
        if (p instanceof Vector2)
            return p;
        return new Vector2(p.x, p.y);
    }

    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get isZero() {
        return this.x === 0 && this.y === 0;
    }

    get isInvalid() {
        return isNaN(this.x) || isNaN(this.y);
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get squaredLength() {
        return this.x * this.x + this.y * this.y;
    }

    /** angle between -PI and PI (clockwise) */
    get angle() {
        return Math.atan2(this.y, this.x);
    }

    get unit() {
        return this.isZero ? this : this.times(1 / this.length);
    }

    get perpendicular() {
        return new Vector2(this.y, -this.x);
    }

    get reverse() {
        return new Vector2(-this.x, -this.y);
    }

    exactEquals(v: Vector2Like) {
        if (this === v)
            return true;
        return this.x === v.x && this.y === v.y;
    }

    floor() {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }

    round() {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }

    clamp(rect: RectLike) {
        return V(
            Math.min(Math.max(rect.left, this.x), rect.right),
            Math.min(Math.max(rect.top, this.y), rect.bottom)
        );
    }

    plusX(x: number) {
        return new Vector2(this.x + x, this.y);
    }

    plusY(y: number) {
        return new Vector2(this.x, this.y + y);
    }

    plus(v: Vector2Like): Vector2;
    plus(x: number, y: number): Vector2;
    plus(a: Vector2Like | number, b?: number) {
        if (typeof a === 'number')
            return new Vector2(this.x + a, this.y + b!);
        else
            return new Vector2(this.x + a.x, this.y + a.y);
    }

    minus(v: Vector2Like) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    times(s: number) {
        return new Vector2(this.x * s, this.y * s);
    }

    dot(v: Vector2Like) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vector2Like) {
        return this.x * v.y - this.y * v.x;
    }

    rotateBy(a: number) {
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        return new Vector2(
            cos * this.x - sin * this.y,
            sin * this.x + cos * this.y
        );
    }

    translateAndScale(transform: OffsetScaleTransformation | null, inverse = false) {
        if (transform === null)
            return this;
        if (inverse) {
            return new Vector2(
                (this.x - transform.originOffset.x) / transform.scale,
                (this.y - transform.originOffset.y) / transform.scale
            );
        }
        else {
            return new Vector2(
                this.x * transform.scale + transform.originOffset.x,
                this.y * transform.scale + transform.originOffset.y
            );
        }
    }

    toString(fractionDigits?: number) {
        if (this.isInvalid)
            return '(invalid)';
        if (fractionDigits === undefined)
            return `(${this.x}, ${this.y})`;
        return `(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)})`;
    }

    asTuple(): [number, number] {
        return [this.x, this.y];
    }

    getIntHashCode() {
        let hash = (17 * 31 + this.x | 0) | 0;
        hash = (((hash * 31) | 0) + this.y | 0) | 0;
        return hash;
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function V(x: number, y: number) {
    return new Vector2(x, y);
}
