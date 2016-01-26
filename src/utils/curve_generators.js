import computeDistance from './compute_distance';

/**
 * generateQuadraticBezierCurve
 * derived from: http://math.stackexchange.com/questions/1360891/find-quadratic-bezier-curve-equation-based-on-its-control-points
 *
 * @param  {Object} controlPoint0 x, y coords for the first control point
 * @param  {Object} controlPoint1 x, y coords for the second control point
 * @param  {Object} controlPoint2 x, y coords for the third control point
 * @param  {Integer} steps the number of points to generate
 * @return {Array<Object>} an array of x,y coordinates for the number of steps specified
 */
export function generateQuadraticBezierCurve(
    controlPoint0,
    controlPoint1,
    controlPoint2,
    steps
) {
    let curvePoints = [];

    for (let i = 0; i<steps; i++) {
        let position = i / steps;

        let positionSquared = position * position;
        let negativePosition = 1 - position;
        let negativePositionSquared = negativePosition * negativePosition;

        let a = negativePositionSquared;
        let b = negativePosition * position * 2;
        let c = positionSquared;

        curvePoints.push({
            x: a * controlPoint0.x + b * controlPoint1.x + c * controlPoint2.x,
            y: a * controlPoint0.y + b * controlPoint1.y + c * controlPoint2.y
        });
    }

    return curvePoints;
};

/**
 * Given a set of curve points, we can estimate the arc length
 * @param  {Object} controlPoint0 x, y coords for the first control point
 * @param  {Object} controlPoint1 x, y coords for the second control point
 * @param  {Object} controlPoint2 x, y coords for the third control point
 * @param  {Integer} steps the number of points to generate
 * @return {Array<Object>} an array of x,y coordinates for the number of steps specified
 */
export function estimateArcLength(curvePoints) {
    let approximateArcLength = 0;
    let previousPoint = curvePoints[0];

    curvePoints.forEach((point) => {
        approximateArcLength += computeDistance(previousPoint, point);
        previousPoint = point;
    });

    return approximateArcLength;
}

/**
 * Creates a points linearly spaced along a bezier curve
 * @param  {[type]} controlPoint0
 * @param  {[type]} controlPoint1 [description]
 * @param  {[type]} controlPoint2 [description]
 * @param  {[type]} steps         [description]
 * @return {[type]}               [description]
 */
export function generateLinearSpacedQuadraticBezierCurve(
    controlPoint0,
    controlPoint1,
    controlPoint2,
    steps
) {
    let RESOLUTION_MULTIPLIER = 100;
    let quadraticPoints = generateQuadraticBezierCurve(
        controlPoint0,
        controlPoint1,
        controlPoint2,
        steps * RESOLUTION_MULTIPLIER
    );

    let arcLength = estimateArcLength(quadraticPoints);
    let segmentLength = arcLength/(steps - 1);
    let linearCurvePoints = [];
    let nextPointDistance = 0;
    let segmentsFound = 0;

    let previousPoint = quadraticPoints[0];

    for (let i = 0; i < quadraticPoints.length; i++) {
        if (linearCurvePoints.length >= steps) {
            break;
        }

        if (computeDistance(previousPoint, quadraticPoints[i]) > nextPointDistance) {
            linearCurvePoints.push(quadraticPoints[i]);
            segmentsFound += 1;
            nextPointDistance = Math.min(segmentsFound * segmentLength, arcLength);
        }
    }

    // guarentees we get the last point
    if (steps > linearCurvePoints.length) {
       linearCurvePoints.push(quadraticPoints[quadraticPoints.length - 1]);
    }

    return linearCurvePoints;
}

export default {
    estimateArcLength: estimateArcLength,
    quadraticBezierCurve: generateQuadraticBezierCurve,
    linearSpacedQuadraticBezierCurve: generateLinearSpacedQuadraticBezierCurve,
}
