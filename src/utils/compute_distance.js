export default function computeDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2),
        Math.pow(point2.y - point1.y, 2)
    );
}
