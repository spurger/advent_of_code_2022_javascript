const fs = require("fs");

fs.readFile("day24/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString().split("\n").filter(v => v)

  const t0 = performance.now()

  let initialBlizzards = []
  let entry = []
  let targets = []

  let width
  let height = input.length - 3
  input.forEach((line, row) => {
    line = line.trim()
    if(!width) { width = line.length - 3 }
    for(let col = 0; col < line.length; col++) {
      const char = line.charAt(col)
      if([">", "<", "^", "v"].includes(char)) {
        initialBlizzards.push([col - 1, row - 1, char])
      }
    }
    if(row === 0) {
      entry = [line.indexOf(".") - 2, row]
    } else if(row === (input.length - 1)) {
      targets.push([line.indexOf(".") - 1, row - 1])
      targets.push(entry)
      targets.push(targets[0])
    }
  })

  function run(originalTargets) {
    let runTargets = [...originalTargets.map((pos) => [...pos])]
    let blizzards = initialBlizzards.map((arr) => [...arr])
    let minutes = 0
    let reachedPositions = new Set([entry].map((pos) => pos.join("/")))
    let best
    let currentTarget = runTargets.shift()
    while(!best && reachedPositions.size > 0) {
      blizzards.forEach((pos) => {
        if(pos[2] === ">") {
          pos[0]++
          if(pos[0] > width) { pos[0] = 0 }
        }
        if(pos[2] === "<") {
          pos[0]--
          if(pos[0] < 0) { pos[0] = width }
        }
        if(pos[2] === "^") {
          pos[1]--
          if(pos[1] < 0) { pos[1] = height }
        }
        if(pos[2] === "v") {
          pos[1]++
          if(pos[1] > height) { pos[1] = 0 }
        }
      })
      let blizzardsSet = new Set(blizzards.map(([x, y]) => [x, y].join("/")))
      minutes++
  
      let next = []
      let pArray = Array.from(reachedPositions)
        .map((pos) => pos.split("/").map(v => parseInt(v)))
      reachedPositions.clear()
      while(pArray.length > 0) {
        let pos = pArray.pop()
        next = [
          [pos[0], pos[1]],
          [pos[0], pos[1]+1], [pos[0], pos[1]-1],
          [pos[0]+1, pos[1]], [pos[0]-1, pos[1]],
        ].filter(([x, y]) => {
          if(originalTargets.some((pos) => x === pos[0] && y === pos[1])
          || (x === entry[0] && y === entry[1])) {
            return true
          }
          return x >= 0 && x <= width && y >= 0 && y <= height
            && !blizzardsSet.has([x, y].join("/"))
        })
        next.every((pos) => {
          reachedPositions.add(pos.join("/"))
          if(pos[0] === currentTarget[0] && pos[1] === currentTarget[1]) {
            if(runTargets.length > 0) {
              currentTarget = runTargets.shift()
              reachedPositions.clear()
              reachedPositions.add(pos.join("/"))
              pArray = []
            } else {
              best = minutes
            }
            return false
          }
          return true
        })
      }
    }
    return best
  }

  console.log("Part 1:", run(targets.slice(0, 1)))
  const t1 = performance.now()
  console.log(`Part 1 took ${(t1 - t0) / 1000} seconds.`)

  console.log("Part 2:", run(targets.slice(0, 3)))
  const t2 = performance.now()
  console.log(`Part 2 took ${(t2 - t1) / 1000} seconds.`)
})