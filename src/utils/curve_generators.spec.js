import {
    generateQuadraticBezierCurve,
    generateLinearSpacedQuadraticBezierCurve,
} from './curve_generators';

describe('generateQuadraticBezierCurve', function() {

    it('generates a single point', function() {
        expect(generateQuadraticBezierCurve(
            { x: 0, y: 100, },
            { x: 100, y: 200, },
            { x: 200, y: 0, },
            1
        ).length).toBe(1);
    });

    it('generates 3 points at the control points', function() {
        let curve = generateLinearSpacedQuadraticBezierCurve(
            { x: 0, y: 0, },
            { x: 100, y: 0, },
            { x: 200, y: 0, },
            5
        );

        expect(Math.abs(curve[0].x) < 1).toBeTruthy();
        expect(curve[0].y).toBe(0);

        expect(curve[2].x).toBe(100);
        expect(curve[2].y).toBe(0);

        expect(Math.abs(200 - curve[4].x) < 1).toBeTruthy();
        expect(curve[4].y).toBe(0);

        expect(curve.length).toBe(5);
    });

});
