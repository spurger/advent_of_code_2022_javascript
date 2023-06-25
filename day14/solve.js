const fs = require("fs");

fs.readFile("day14/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  let scanValues = new Set()

  function mapToWall(pos) {
    return pos.join("/")
  }

  let highestY = 0

  input.split("\n").filter(v => v).forEach((line) => {
    let lastPosition
    line.split(/->/).map(v => {
      return v.trim().split(",").map(s => parseInt(s))
    }).forEach((coord) => {
      highestY = Math.max(highestY, coord[1])
      if(lastPosition) {
        if(coord[0] !== lastPosition[0]) {
          let start = Math.min(coord[0], lastPosition[0])
          let end = Math.max(coord[0], lastPosition[0])
          for(let x = start; x <= end; x++) {
            scanValues.add(mapToWall([x, coord[1]]))
          }
        } else if(coord[1] !== lastPosition[1]) {
          let start = Math.min(coord[1], lastPosition[1])
          let end = Math.max(coord[1], lastPosition[1])
          for(let y = start; y <= end; y++) {
            scanValues.add(mapToWall([coord[0], y]))
          }
        }
      }
      lastPosition = coord
    })
  })

  function simulate(part) {
    let simulationEnded = false
    let unitsOfSand = 0
    const copiedScanValues = new Set(scanValues)
    while(!simulationEnded) {
      unitsOfSand++
      let sandCannotMove = false
      let position = [500, 0]
      while(!sandCannotMove) {
        if(part === 1 && position[1] > highestY) {
          simulationEnded = true
          sandCannotMove = true
        } else if(part === 2 && position[1] + 1 >= (highestY + 2)) {
          sandCannotMove = true
        } else if(!copiedScanValues.has(mapToWall([position[0], position[1] + 1]))) {
          position[1]++
        } else if(!copiedScanValues.has(mapToWall([position[0] - 1, position[1] + 1]))) {
          position[0]--
          position[1]++
        } else if(!copiedScanValues.has(mapToWall([position[0] + 1, position[1] + 1]))) {
          position[0]++
          position[1]++
        } else {
          sandCannotMove = true
        }
      }
      if(copiedScanValues.has(mapToWall([position[0], position[1]]))) {
        simulationEnded = true
      }
      copiedScanValues.add(mapToWall([position[0], position[1]]))
    }
    return unitsOfSand - 1
  }
  
  console.log("Part 1:", simulate(1))
  console.log("Part 2:", simulate(2))
})