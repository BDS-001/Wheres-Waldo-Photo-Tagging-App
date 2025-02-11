export function calculateOverlap(rect1, rect2) {
    //rect 1 larger than rect 2
    const { x: x1, y: y1, width: w1, height: h1 } = rect1
    const { x: x2, y: y2, width: w2, height: h2 } = rect2

    //subtract left most right edge and the right mose left edge, msut be greater than 0
    const overlapWidth = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1. x2))

    //subtract lowest(number) y bottom value with the highest(number) top value
    const overlapHeight = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2))

    //check how much of rect 2 overlaps into rect1
    const rect2Area = w2 * h2
    const overlapArea = overlapWidth * overlapHeight

    return rect2Area <= 0 || overlapArea <= 0 ? 0 :  Math.round((overlapArea / rect2Area) * 100)

}

module.exports = {
    calculateOverlap,
  };