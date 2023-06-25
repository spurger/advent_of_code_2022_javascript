// Note: running can take a minute

const fs = require("fs");

fs.readFile("day17/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  // x,y coordinate system, right then top direction
  const shapes = [
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

  const t0 = performance.now()

  let rocks = 0
  let currentJetstream = 0
  let height = 0
  const rockPositions = new Set()

  function calculateInitialPositions(shape) {
    return shape.map(position => {
      return [position[0] + 2, position[1] + 4 + height]
    })
  }

  const sequence = []
  let lastHeight = 0
  while(rocks < (jetstream.length * shapes.length)) {
    sequence.push(height - lastHeight)
    lastHeight = height
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
      if(pos[1] > height) { 
        height = pos[1] 
      }
      rockPositions.add(pos.join("/"))
    })
    rocks++
  }

  // Find repeating sequence
  const sequenceStr = sequence.join("/")
  const tried = new Set()
  let offset = 0
  let sequenceLength = 0
  for(let i = sequence.length - 2; i > sequenceLength/3*2; i--) {
    for(let j = sequence.length - 1; j > i; j--) {
      let str = sequence.slice(i, j).join("/")
      const regexp = new RegExp(str, "g")
      let match, firstIndex, lastIndex, length
      if((match = regexp.exec(sequenceStr)) !== null) {
        length = regexp.lastIndex - match.index
        if(match.index > length || tried.has(str)) { break }
        tried.add(str)
        firstIndex = match.index
        lastIndex = regexp.lastIndex
        while ((match = regexp.exec(sequenceStr)) !== null) {
          if((lastIndex + 1) === match.index) {
            lastIndex = regexp.lastIndex
            if((sequenceStr.length - length) < regexp.lastIndex) {
              offset = str.slice(0, firstIndex).split("/").length
              sequenceLength = str.split("/").length
              break
            }
          } else {
            break
          }
        }
      }
    }
    if(sequenceLength > 0) { break }
  }

  
  const searchedRockCount = 1000000000000
  const remaining = searchedRockCount % sequenceLength
  const offsetHeight = sequence.slice(0, remaining + 1).reduce((acc, curr) => acc + curr, 0)
  const sequenceHeight = sequence.slice(offset, offset + sequenceLength).reduce((acc, curr) => acc + curr, 0)
  
  const result = Math.floor(searchedRockCount / sequenceLength) * sequenceHeight + offsetHeight
  // sample: 1514285714288
  console.log("Part 2:", result)

  const t1 = performance.now()
  console.log(`Part 2 took ${(t1 - t0) / 1000.0} seconds.`)
})