import { V, Vector2, Vector2Like } from '@nw55/math-2d';
import { assert } from 'chai';
import { describe, test } from 'mocha';

const epsilon = 1e-15;

function assertVectorApproximately(actual: Vector2Like, expected: Vector2Like) {
    assert.approximately(actual.x, expected.x, epsilon);
    assert.approximately(actual.y, expected.y, epsilon);
}

describe('Vector2', () => {
    test('fromPolar / from', () => {
        assert.instanceOf(Vector2.fromPolar(0, 0), Vector2);
        assert.deepEqual(Vector2.fromPolar(0, 0), Vector2.zero);
        assert.deepEqual(Vector2.fromPolar(0, 1), V(1, 0));
        assertVectorApproximately(Vector2.fromPolar(Math.PI / 2, 1), V(0, 1));
        assertVectorApproximately(Vector2.fromPolar(Math.PI, 1), V(-1, 0));
        assertVectorApproximately(Vector2.fromPolar(-Math.PI / 2, 1), V(0, -1));

        assert.instanceOf(Vector2.from([1, 2]), Vector2);
        assert.deepEqual(Vector2.from([1, 2]), V(1, 2));
        assert.instanceOf(Vector2.from({ x: 1, y: 2 }), Vector2);
        assert.deepEqual(Vector2.from({ x: 1, y: 2 }), V(1, 2));
    });

    test('constructor / V', () => {
        assert.deepEqual<Vector2Like>(new Vector2(1, 2), { x: 1, y: 2 });
        assert.deepEqual<Vector2Like>(V(1, 2), { x: 1, y: 2 });
    });

    test('isZero / isInvalid', () => {
        assert.isTrue(Vector2.zero.isZero);
        assert.isTrue(V(0, 0).isZero);
        assert.isFalse(V(0, 1).isZero);

        assert.isTrue(Vector2.invalid.isInvalid);
        assert.isTrue(V(NaN, 0).isInvalid);
        assert.isTrue(V(0, NaN).isInvalid);
        assert.isTrue(V(NaN, NaN).isInvalid);
        assert.isFalse(V(1, 2).isInvalid);
    });

    test('length / squaredLength / angle', () => {
        assert.equal(V(0, 2).length, 2);
        assert.equal(V(3, 4).length, 5);
        assert.equal(V(-3, -4).length, 5);

        assert.equal(V(0, 2).squaredLength, 4);
        assert.equal(V(3, 4).squaredLength, 25);
        assert.equal(V(-3, -4).squaredLength, 25);

        assert.equal(V(0, 0).angle, 0);
        assert.approximately(V(0, 1).angle, Math.PI / 2, epsilon);
        assert.approximately(V(-1, 0).angle, Math.PI, epsilon);
        assert.approximately(V(0, -1).angle, -Math.PI / 2, epsilon);
    });

    test('unit / perpendicular / reverse', () => {
        assertVectorApproximately(V(0, 2).unit, V(0, 1));
        assertVectorApproximately(V(-2, 0).unit, V(-1, 0));
        assertVectorApproximately(V(2, 2).unit, V(Math.SQRT1_2, Math.SQRT1_2));

        assert.deepEqual(V(1, 2).perpendicular, V(2, -1));
        assert.deepEqual(V(1, 2).reverse, V(-1, -2));
    });

    test('floor / round / clamp', () => {
        assert.deepEqual(V(1.2, -4.5).floor(), V(1, -5));
        assert.deepEqual(V(1.2, -4.5).round(), V(1, -4));

        assert.deepEqual(V(5, -4.5).clamp({
            left: -1, top: -2,
            right: 3, bottom: 4
        }), V(3, -2));
    });

    test('plusX / plusY / plus / minus / times', () => {
        assert.deepEqual(V(1, 2).plusX(3), V(4, 2));
        assert.deepEqual(V(1, 2).plusY(3), V(1, 5));

        assert.deepEqual(V(1, 2).plus(3, 4), V(4, 6));
        assert.deepEqual(V(1, 2).plus({ x: 3, y: 4 }), V(4, 6));

        assert.deepEqual(V(1, 2).minus({ x: 3, y: 4 }), V(-2, -2));

        assert.deepEqual(V(1, 2).times(3), V(3, 6));
    });

    test('dot / cross', () => {
        assert.deepEqual(V(1, 2).dot({ x: 3, y: 4 }), 11);

        assert.deepEqual(V(1, 2).cross({ x: 3, y: 4 }), -2);
    });

    test('rotateBy / translateAndScale', () => {
        assertVectorApproximately(V(1, 2).rotateBy(Math.PI / 2), V(-2, 1));
        assertVectorApproximately(V(1, 2).rotateBy(-Math.PI), V(-1, -2));

        assert.deepEqual(V(1, 2).scaleAndTranslate({
            originOffset: V(1, 2),
            scale: -2
        }), V(-1, -2));
        assert.deepEqual(V(-1, -2).scaleAndTranslate({
            originOffset: V(1, 2),
            scale: -2
        }, true), V(1, 2));
    });
});
