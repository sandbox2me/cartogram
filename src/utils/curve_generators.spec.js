import curveGenerators from './curve_generators';

describe('generateQuadraticBezierCurve', function() {

    it('generates a single point accurately', function() {
        expect(curveGenerators.quadraticBezierCurve(
            { x: 0, y: 100, },
            { x: 100, y: 200, },
            { x: 200, y: 0, },
            1
        ).length).toBe(1);
    });

});
