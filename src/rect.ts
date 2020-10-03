import { OffsetScaleTransformation, RectLike, Vector2Like } from './common';
import { V } from './vector';

export class Rect implements RectLike {
    /** (0, 0, 0, 0) */
    static zero = new Rect(0, 0, 0, 0);
    /** (0, 0, 1, 1) */
    static one = new Rect(0, 0, 1, 1);
    /** (-1, -1, 1, 1) */
    static unitBox = new Rect(-1, -1, 1, 1);

    static circleBox(center: Vector2Like, radius: number) {
        return new Rect(
            center.x - radius,
            center.y - radius,
            center.x + radius,
            center.y + radius
        );
    }

    static at(pos: Vector2Like, width: number, height: number) {
        return new Rect(
            pos.x,
            pos.y,
            pos.x + width,
            pos.y + height
        );
    }

    static fromPoints(p1: Vector2Like, p2: Vector2Like) {
        return new Rect(
            Math.min(p1.x, p2.x),
            Math.min(p1.y, p2.y),
            Math.max(p1.x, p2.x),
            Math.max(p1.y, p2.y)
        );
    }

    static from(rect: [number, number, number, number] | RectLike) {
        if (Array.isArray(rect))
            return new Rect(rect[0], rect[1], rect[2], rect[3]);
        return new Rect(rect.left, rect.top, rect.right, rect.bottom);
    }

    readonly left: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;

    constructor(left: number, top: number, right: number, bottom: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    get isZero() {
        return this.width === 0 || this.height === 0;
    }

    get width() {
        return this.right - this.left;
    }
    get height() {
        return this.bottom - this.top;
    }

    get topLeft() {
        return V(this.left, this.top);
    }
    get bottomRight() {
        return V(this.right, this.bottom);
    }
    get bottomLeft() {
        return V(this.left, this.bottom);
    }
    get topRight() {
        return V(this.right, this.top);
    }

    get size() {
        return V(this.right - this.left, this.bottom - this.top);
    }
    get center() {
        return V((this.left + this.right) / 2, (this.top + this.bottom) / 2);
    }

    get integerBounds() {
        return new Rect(
            Math.floor(this.left),
            Math.floor(this.top),
            1 - Math.ceil(-this.right),
            1 - Math.ceil(-this.bottom)
        );
    }

    at(pos: Vector2Like) {
        return Rect.at(pos, this.width, this.height);
    }

    plusLeft(left: number) {
        return new Rect(this.left + left, this.top, this.right, this.bottom);
    }
    plusTop(top: number) {
        return new Rect(this.left, this.top + top, this.right, this.bottom);
    }
    plusRight(right: number) {
        return new Rect(this.left, this.top, this.right + right, this.bottom);
    }
    plusBottom(bottom: number) {
        return new Rect(this.left, this.top, this.right, this.bottom + bottom);
    }
    plus(left: number, top: number, right: number, bottom: number) {
        return new Rect(this.left + left, this.top + top, this.right + right, this.bottom + bottom);
    }

    extend(all: number): Rect;
    extend(x: number, y: number): Rect; // eslint-disable-line @typescript-eslint/unified-signatures
    extend(left: number, top: number, right: number, bottom: number): Rect;
    extend(left: number, top?: number, right?: number, bottom?: number) {
        if (top === undefined)
            top = left;
        if (right === undefined)
            right = left;
        if (bottom === undefined)
            bottom = top;
        return new Rect(this.left - left, this.top - top, this.right + right, this.bottom + bottom);
    }

    moveBy(x: number, y: number): Rect;
    moveBy(v: Vector2Like): Rect;
    moveBy(x: number | Vector2Like, y?: number) {
        if (typeof x === 'number') {
            return new Rect(
                this.left + x,
                this.top + y!,
                this.right + x,
                this.bottom + y!
            );
        }
        else {
            return new Rect(
                this.left + x.x,
                this.top + x.y,
                this.right + x.x,
                this.bottom + x.y
            );
        }
    }

    union(rect: RectLike) {
        let newLeft: number;
        let newTop: number;
        let newRight: number;
        let newBottom: number;
        if (this.left === this.right) {
            newLeft = rect.left;
            newRight = rect.right;
        }
        else {
            newLeft = Math.min(this.left, rect.left);
            newRight = Math.max(this.right, rect.right);
        }
        if (this.top === this.bottom) {
            newTop = rect.top;
            newBottom = rect.bottom;
        }
        else {
            newTop = Math.min(this.top, rect.top);
            newBottom = Math.max(this.bottom, rect.bottom);
        }
        return new Rect(newLeft, newTop, newRight, newBottom);
    }

    intersection(rect: RectLike) {
        const left = Math.max(this.left, rect.left);
        const top = Math.max(this.top, rect.top);
        const right = Math.min(this.right, rect.right);
        const bottom = Math.min(this.bottom, rect.bottom);
        if (left >= right || top >= bottom)
            return Rect.zero;
        return new Rect(left, top, right, bottom);
    }

    /** always returns false if one rect is empty */
    intersects(rect: RectLike) {
        const left = Math.max(this.left, rect.left);
        const right = Math.min(this.right, rect.right);
        if (left >= right)
            return false;
        const top = Math.max(this.top, rect.top);
        const bottom = Math.min(this.bottom, rect.bottom);
        if (top >= bottom)
            return false;
        return true;
    }

    /** can be used with empty rects */
    intersectsInclusive(rect: RectLike) {
        return this.left <= rect.right && this.right >= rect.left && this.top <= rect.bottom && this.bottom >= rect.top;
    }

    contains(rect: RectLike) {
        return rect.left >= this.left && rect.right <= this.right && rect.top >= this.top && rect.bottom <= this.bottom;
    }

    includes(v: Vector2Like) {
        return v.x >= this.left && v.x < this.right && v.y >= this.top && v.y < this.bottom;
    }

    translateAndScale(transform: OffsetScaleTransformation | null, inverse = false) {
        if (transform === null)
            return this;
        if (inverse) {
            return new Rect(
                (this.left - transform.originOffset.x) / transform.scale,
                (this.top - transform.originOffset.y) / transform.scale,
                (this.right - transform.originOffset.x) / transform.scale,
                (this.bottom - transform.originOffset.y) / transform.scale
            );
        }
        else {
            return new Rect(
                this.left * transform.scale + transform.originOffset.x,
                this.top * transform.scale + transform.originOffset.y,
                this.right * transform.scale + transform.originOffset.x,
                this.bottom * transform.scale + transform.originOffset.y
            );
        }
    }

    excatEquals(other: Rect) {
        if (this === other)
            return true;
        return this.left === other.left && this.top === other.top && this.right === other.right && this.bottom === other.bottom;
    }

    toString(fractionDigits?: number) {
        if (fractionDigits === undefined)
            return `(${this.left}, ${this.top}, ${this.right}, ${this.bottom})`;
        return `(${this.left.toFixed(fractionDigits)}, ${this.top.toFixed(fractionDigits)}, ${this.right.toFixed(fractionDigits)}, ${this.bottom.toFixed(fractionDigits)})`;
    }

    asTuple(): [number, number, number, number] {
        return [this.left, this.top, this.right, this.bottom];
    }

    getIntHashCode() {
        let hash = (17 * 31 + this.left | 0) | 0;
        hash = (((hash * 31) | 0) + this.top | 0) | 0;
        hash = (((hash * 31) | 0) + this.right | 0) | 0;
        hash = (((hash * 31) | 0) + this.bottom | 0) | 0;
        return hash;
    }
}
