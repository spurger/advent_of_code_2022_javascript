const fs = require("fs");

fs.readFile("day17/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  // x,y coordinate system, right then top direction
  let shapes = [
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
    [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [0, 1], [1, 0], [1, 1]],
  ]

  let jetstream = ""

  input.split("\n").filter(v => v).forEach((line) => {
    jetstream = line.trim()
  })

  let rocks = 0
  let currentJetstream = 0
  let height = 0
  const rockPositions = new Set()

  function calculateInitialPositions(shape) {
    return shape.map(position => {
      return [position[0] + 2, position[1] + 4 + height]
    })
  }

  while(rocks < 2022) {
    const shape = shapes[rocks % shapes.length]
    let shapePositions = calculateInitialPositions(shape)
    let rockStopped = false
    // calculate positions
    while(!rockStopped) {
      const side = jetstream.charAt(currentJetstream % jetstream.length) === ">" ? +1 : -1
      currentJetstream++

      const sidePositions =  shapePositions.map(([x, y]) => [x + side, y])
      if(sidePositions.every((pos) => 
        pos[0] >= 0 && pos[0] < 7 && !rockPositions.has(pos.join("/"))
      )) {
        shapePositions = sidePositions
      }

      const fallPositions =  shapePositions.map(([x, y]) => [x, y - 1])
      if(fallPositions.some(pos => rockPositions.has(pos.join("/")) || pos[1] <= 0)) {
        break
      } else {
        shapePositions = fallPositions
      }
    }
    
    shapePositions.forEach((pos) => {
      if(pos[1] > height) { height = pos[1] }
      rockPositions.add(pos.join("/"))
    })
    rocks++
  }

  // visual debugging

  // for(let y = height + 1; y > 0; y--)  {
  //   let str = ""
  //   for(let x = 0; x < 7; x++) {
  //     str += rockPositions.has([x,y].join("/")) ? "#" : "."
  //   }
  //   console.log(String(y).padStart(3, "0"), str)
  // }

  console.log("Part 1:", height)
})