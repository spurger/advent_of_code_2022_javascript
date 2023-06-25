// Note: running can take several minutes

const fs = require("fs");

fs.readFile("day15/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const searchableRow = 2000000
  // const searchableRow = 10
  let minX, maxX, minY, maxY
  // store sensors
  const sensors = new Map()
  const beacons = new Set()
  // store beacons for y === searchableRow
  const beaconsInRow = new Set()

  function toKey(x,y) { return [x, y].join("/") }
  function fromKey(key) { return key.split("/").map(v => parseInt(v)) }
  function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
  }

  input.split("\n").filter(v => v).forEach((line) => {
    const [sx, sy, bx, by] = line.match(/-?\d+/g).map(v => parseInt(v))
    const mDist = manhattanDistance(sx, sy, bx, by)
    sensors.set(toKey(sx, sy), mDist)
    beacons.add(toKey(bx, by))
    if(by === searchableRow) {
      beaconsInRow.add(toKey(bx, by))
    }
    minX = Number.isInteger(minX) ? Math.min(minX, sx - mDist) : sx - mDist
    maxX = Number.isInteger(maxX) ? Math.max(maxX, sx + mDist) : sx + mDist
    minY = Number.isInteger(minY) ? Math.min(minY, sy - mDist) : sy - mDist
    maxY = Number.isInteger(maxY) ? Math.max(maxY, sy + mDist) : sy + mDist
  })

  function shouldConcat(p1, p2) {
    const [x1, x2] = p1
    const [x3, x4] = p2
    // -1 is to concat ranges within one distance, example: [1, 2], [3, 4] -> [1, 4]
    const leftLimit = Math.max(x1, x3 - 1); 
    const rightLimit = Math.min(x2, x4);
    return leftLimit <= rightLimit
  }

  function findRangesinRow(row) {
    let ranges = []
    for(const [posStr, mDist] of sensors) {
      const [x2, y2] = fromKey(posStr)
      const yDiff = Math.abs(row - y2)
      if(mDist >= yDiff) {
        const xRemaining = mDist - yDiff
        let range = [x2 - xRemaining, x2 + xRemaining]
        const concatenations = ranges.filter(r => shouldConcat(r, range))
        if(concatenations.length) {
          ranges = ranges.filter(r => !shouldConcat(r, range))
          const min = Math.min(range[0], ...concatenations.map(r => r[0]))
          const max = Math.max(range[1], ...concatenations.map(r => r[1]))
          range = [min, max]
        }
        ranges.push(range)
      }
    }
    return ranges.sort((r1, r2) => r1[0] - r1[1])
  }

  
  console.log("Part1 :", findRangesinRow(searchableRow).reduce((acc, r) => {
    return acc + (r[1] - r[0]) + 1
  }, 0) - beaconsInRow.size)

  const p2t0 = performance.now()

  for(let y = 0; y <= 4000000; y++) {
    let ranges = findRangesinRow(y)
    if(ranges.length > 1) {
      console.log("Part2 :", ((ranges[0][1] + 1) * 4000000) + y)
    }
  }

  const p2t1 = performance.now()
  console.log(`Part 2 took ${(p2t1 - p2t0) / 1000.0} seconds.`)
})