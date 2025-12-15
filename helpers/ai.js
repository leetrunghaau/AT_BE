function matchPercentage(distance, minDistance = 0.2, maxDistance = 10) {
    if (distance < minDistance) distance = minDistance;
    if (distance > maxDistance) distance = maxDistance;
    let match = 1 - (distance - minDistance) / (maxDistance - minDistance);
    return match;
}
module.exports = {
    matchPercentage
}