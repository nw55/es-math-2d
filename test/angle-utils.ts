import { angleUtils } from '@nw55/math-2d';
import { assert } from 'chai';
import { describe, test } from 'mocha';

describe('angleUtils', () => {
    test('degrees', () => {
        assert.equal(angleUtils.degrees(Math.PI / 2), 90);
        assert.equal(angleUtils.degrees(-Math.PI / 2), -90);
        assert.equal(angleUtils.degrees(4 * Math.PI), 720);
    });

    test('fromDegrees', () => {
        assert.equal(angleUtils.fromDegrees(90), Math.PI / 2);
        assert.equal(angleUtils.fromDegrees(-90), -Math.PI / 2);
        assert.equal(angleUtils.fromDegrees(720), 4 * Math.PI);
    });

    test('positive', () => {
        assert.equal(angleUtils.positive(Math.PI / 2), Math.PI / 2);
        assert.equal(angleUtils.positive(-Math.PI / 2), 3 * Math.PI / 2);
        assert.equal(angleUtils.positive(4 * Math.PI), 0);
    });

    test('normalize', () => {
        assert.equal(angleUtils.normalize(Math.PI / 2), Math.PI / 2);
        assert.equal(angleUtils.normalize(-Math.PI / 2), -Math.PI / 2);
        assert.equal(angleUtils.normalize(3 * Math.PI / 2), -Math.PI / 2);
        assert.equal(angleUtils.normalize(4 * Math.PI), 0);
    });
});
