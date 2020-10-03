import { Rect, RectLike, V } from '@nw55/math-2d';
import { assert } from 'chai';
import { describe, test } from 'mocha';

describe('Rect', () => {
    test('circleBox / at / fromPoints / from', () => {
        assert.deepEqual(Rect.circleBox(V(1, 2), 3), new Rect(-2, -1, 4, 5));
        assert.instanceOf(Rect.circleBox(V(1, 2), 3), Rect);

        assert.deepEqual(Rect.at(V(1, 2), 3, 4), new Rect(1, 2, 4, 6));
        assert.instanceOf(Rect.at(V(1, 2), 3, 4), Rect);

        assert.deepEqual(Rect.fromPoints(V(1, 2), V(3, 4)), new Rect(1, 2, 3, 4));
        assert.deepEqual(Rect.fromPoints(V(0, 2), V(5, -3)), new Rect(0, -3, 5, 2));
        assert.instanceOf(Rect.fromPoints(V(1, 2), V(3, 4)), Rect);

        assert.deepEqual(Rect.from([1, 2, 3, 4]), new Rect(1, 2, 3, 4));
        assert.instanceOf(Rect.from([1, 2, 3, 4]), Rect);
        assert.deepEqual(Rect.from({ left: 1, top: 2, right: 3, bottom: 4 }), new Rect(1, 2, 3, 4));
        assert.instanceOf(Rect.from({ left: 1, top: 2, right: 3, bottom: 4 }), Rect);
    });

    test('constructor', () => {
        assert.deepEqual<RectLike>(new Rect(1, 2, 3, 4), { left: 1, top: 2, right: 3, bottom: 4 });
        assert.throws(() => new Rect(3, 2, 1, 4));
        assert.throws(() => new Rect(1, 4, 3, 2));
    });

    test('isZero / width / height', () => {
        assert.isTrue(Rect.zero.isZero);
        assert.isFalse(Rect.one.isZero);

        assert.equal(new Rect(1, 2, 5, 7).width, 4);
        assert.equal(new Rect(1, 2, 5, 7).height, 5);
    });

    test('topLeft / bottomRight / bottomLeft / topRight / size / center', () => {
        assert.deepEqual(new Rect(1, 2, 3, 4).topLeft, V(1, 2));
        assert.deepEqual(new Rect(1, 2, 3, 4).bottomRight, V(3, 4));
        assert.deepEqual(new Rect(1, 2, 3, 4).bottomLeft, V(1, 4));
        assert.deepEqual(new Rect(1, 2, 3, 4).topRight, V(3, 2));

        assert.deepEqual(new Rect(1, 2, 5, 7).size, V(4, 5));
        assert.deepEqual(new Rect(1, 2, 3, 4).center, V(2, 3));
    });

    test('getIntegerBounds', () => {
        assert.deepEqual(new Rect(-1, -2, 3, 4).getIntegerBounds(), new Rect(-1, -2, 3, 4));
        assert.deepEqual(new Rect(-4, -3, -2, -1).getIntegerBounds(), new Rect(-4, -3, -2, -1));
        assert.deepEqual(new Rect(-4.5, -3.4, -2.1, 1.2).getIntegerBounds(), new Rect(-5, -4, -2, 2));
        assert.deepEqual(new Rect(-1, -2, 3, 4).getIntegerBounds(true), new Rect(-1, -2, 4, 5));
        assert.deepEqual(new Rect(-4, -3, -2, -1).getIntegerBounds(true), new Rect(-4, -3, -1, 0));
        assert.deepEqual(new Rect(-4.5, -3.4, -2.1, 1.2).getIntegerBounds(true), new Rect(-5, -4, -2, 2));
    });

    test('at / moveBy', () => {
        assert.deepEqual(new Rect(1, 2, 3, 4).at(V(5, 6)), new Rect(5, 6, 7, 8));

        assert.deepEqual(new Rect(1, 2, 3, 4).moveBy(5, 6), new Rect(6, 8, 8, 10));
        assert.deepEqual(new Rect(1, 2, 3, 4).moveBy(V(5, 6)), new Rect(6, 8, 8, 10));
    });

    test('plusLeft / plusTop / plusRight / plusBottom / plus / extend', () => {
        assert.deepEqual(new Rect(10, 20, 30, 40).plusLeft(5), new Rect(15, 20, 30, 40));
        assert.deepEqual(new Rect(10, 20, 30, 40).plusTop(5), new Rect(10, 25, 30, 40));
        assert.deepEqual(new Rect(10, 20, 30, 40).plusRight(5), new Rect(10, 20, 35, 40));
        assert.deepEqual(new Rect(10, 20, 30, 40).plusBottom(5), new Rect(10, 20, 30, 45));

        assert.deepEqual(new Rect(10, 20, 30, 40).plus(1, 2, 3, 4), new Rect(11, 22, 33, 44));

        assert.deepEqual(new Rect(1, 2, 3, 4).extend(5), new Rect(-4, -3, 8, 9));
        assert.deepEqual(new Rect(1, 2, 3, 4).extend(5, 6), new Rect(-4, -4, 8, 10));
        assert.deepEqual(new Rect(1, 2, 3, 4).extend(5, 6, 7, 8), new Rect(-4, -4, 10, 12));
    });

    test('union / intersection', () => {
        assert.deepEqual(new Rect(1, 2, 3, 4).union(new Rect(5, 6, 7, 8)), new Rect(1, 2, 7, 8));
        assert.deepEqual(new Rect(1, 2, 7, 8).union(new Rect(3, 4, 5, 6)), new Rect(1, 2, 7, 8));

        assert.deepEqual(new Rect(1, 2, 3, 4).intersection(new Rect(5, 6, 7, 8)), Rect.zero);
        assert.deepEqual(new Rect(1, 2, 7, 8).intersection(new Rect(3, 4, 5, 6)), new Rect(3, 4, 5, 6));
        assert.deepEqual(new Rect(1, 2, 5, 6).intersection(new Rect(3, 4, 7, 8)), new Rect(3, 4, 5, 6));
    });

    test('intersects / intersectsInclusive / contains / includes', () => {
        assert.isFalse(new Rect(1, 2, 3, 4).intersects(new Rect(5, 6, 7, 8)));
        assert.isTrue(new Rect(1, 2, 7, 8).intersects(new Rect(3, 4, 5, 6)));
        assert.isTrue(new Rect(1, 2, 5, 6).intersects(new Rect(3, 4, 7, 8)));
        assert.isFalse(new Rect(1, 2, 3, 4).intersects(new Rect(3, 4, 5, 6)));

        assert.isFalse(new Rect(1, 2, 3, 4).intersectsInclusive(new Rect(5, 6, 7, 8)));
        assert.isTrue(new Rect(1, 2, 7, 8).intersectsInclusive(new Rect(3, 4, 5, 6)));
        assert.isTrue(new Rect(1, 2, 5, 6).intersectsInclusive(new Rect(3, 4, 7, 8)));
        assert.isTrue(new Rect(1, 2, 3, 4).intersectsInclusive(new Rect(3, 4, 5, 6)));

        assert.isFalse(new Rect(1, 2, 3, 4).contains(new Rect(5, 6, 7, 8)));
        assert.isTrue(new Rect(1, 2, 7, 8).contains(new Rect(3, 4, 5, 6)));
        assert.isFalse(new Rect(3, 4, 5, 6).contains(new Rect(1, 2, 7, 8)));
        assert.isFalse(new Rect(1, 2, 5, 6).contains(new Rect(3, 4, 7, 8)));
        assert.isTrue(new Rect(1, 2, 3, 4).contains(new Rect(1, 2, 3, 4)));

        assert.isTrue(new Rect(1, 2, 3, 4).includes(V(2, 3)));
        assert.isTrue(new Rect(1, 2, 3, 4).includes(V(2, 3), true));
        assert.isFalse(new Rect(1, 2, 3, 4).includes(V(0, 1)));
        assert.isFalse(new Rect(1, 2, 3, 4).includes(V(0, 1), true));
        assert.isFalse(new Rect(1, 2, 3, 4).includes(V(3, 2)));
        assert.isTrue(new Rect(1, 2, 3, 4).includes(V(3, 2), true));
    });

    test('scaleAndTranslate', () => {
        assert.deepEqual(new Rect(1, 2, 3, 4).scaleAndTranslate({
            originOffset: V(1, 2),
            scale: -2
        }), new Rect(-5, -6, -1, -2));
        assert.deepEqual(new Rect(-5, -6, -1, -2).scaleAndTranslate({
            originOffset: V(1, 2),
            scale: -2
        }, true), new Rect(1, 2, 3, 4));
    });
});
