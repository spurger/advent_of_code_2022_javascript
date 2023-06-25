const fs = require("fs");

function followTail(headPosition, tailPosition) {
  const wDiff = headPosition[0] - tailPosition[0]
  const hDiff = headPosition[1] - tailPosition[1]

  if((Math.abs(wDiff) < 2) && (Math.abs(hDiff) < 2)) {
    return tailPosition
  }

  if((Math.abs(wDiff) > 1) && !hDiff) {
    return [tailPosition[0] + Math.sign(wDiff), tailPosition[1]]
  } else if((Math.abs(hDiff) > 1) && !wDiff) {
    return [tailPosition[0], tailPosition[1] + Math.sign(hDiff)]
  } else {
    return [tailPosition[0] + Math.sign(wDiff), tailPosition[1] + Math.sign(hDiff)]
  }
}

fs.readFile("day09/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const headPosition = [0, 0]
  let tailPosition = [0, 0]
  const visitedPositions = new Set(["0/0"])

  const part2 = {
    tailPositions: Array.from({ length: 9 }).fill(Array.from({ length: 2 }).fill(0)),
    visitedPositions: new Set(["0/0"])
  }

  input.split("\n").filter(v => v).forEach((line) => {
    const [dir, times] = line.split(" ")
      .map((v, i) => i === 1 ? parseInt(v) : v)
    for(let i = 0; i < times; i++) {
      switch(dir) {
        case "U": {
          headPosition[1]++
          break
        }
        case "D": {
          headPosition[1]-- 
          break
        }
        case "L": {
          headPosition[0]-- 
          break
        }
        case "R": {
          headPosition[0]++ 
          break
        }
      }
      tailPosition = followTail(headPosition, tailPosition)
      part2.tailPositions[0] = followTail(headPosition, part2.tailPositions[0])
      for(let i = 0; i < part2.tailPositions.length - 1; i++) {
        part2.tailPositions[i + 1] = followTail(part2.tailPositions[i], part2.tailPositions[i+1])
      }
      visitedPositions.add(tailPosition.join("/"))

      const lastTail = part2.tailPositions[part2.tailPositions.length - 1]
      part2.visitedPositions.add(lastTail.join("/"))
    }
  })

  console.log("Part 1:", visitedPositions.size)
  console.log("Part 2:", part2.visitedPositions.size)
})