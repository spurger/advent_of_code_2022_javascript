const fs = require("fs");

fs.readFile("day23/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const t0 = performance.now()

  // N, E, S, W
  let borders = [0, 0, 0, 0]
  const elfs = []
  let elfCoords = new Set()
  function mapCoords() {
    borders = borders.fill(0)
    elfCoords = new Set(elfs.map((pos) => pos.join("/")))
    elfs.forEach((pos) => {
      borders[0] = Math.min(borders[0], pos[1])
      borders[1] = Math.max(borders[1], pos[0])
      borders[2] = Math.max(borders[2], pos[1])
      borders[3] = Math.min(borders[3], pos[0])
    })
  }
  const directions = ["N", "S", "W", "E"]
  const proposed = new Map()

  input.split("\n").filter(v => v).forEach((line, row) => {
    line.split("").forEach((c, col) => {
      if(c === "#") {
        elfs.push([col, row])
      }
    })
  })

  function shouldMove(x, y) {
    return [
      [x-1, y-1], [x, y-1], [x+1, y-1],
      [x-1, y], [x+1, y],
      [x-1, y+1], [x, y+1], [x+1, y+1],
    ].map((pos) => pos.join("/")).some((pos) => elfCoords.has(pos))
  }

  function findDirection(x, y, dir) {
    let checking = []
    switch(dir) {
      case "N": {
        checking = [[x-1,y-1], [x, y-1], [x+1,y-1]]
        break
      }
      case "S": {
        checking = [[x-1,y+1], [x, y+1], [x+1,y+1]]
        break
      }
      case "E": {
        checking = [[x+1,y+1], [x+1,y], [x+1,y-1]]
        break
      }
      case "W": {
        checking = [[x-1,y+1], [x-1,y], [x-1,y-1]]
        break
      }
    }
    return checking.map((pos) => pos.join("/")).every((pos) => !elfCoords.has(pos))
  }

  function move(x, y, dir) {
    switch(dir) {
      case "N": return [x, y-1]
      case "S": return [x, y+1]
      case "E": return [x+1, y]
      case "W": return [x-1, y]
    }
  }

  function draw() {
    let content = ""
    for(let y = borders[0] - 1; y <= borders[2] + 1; y++) {
      let str = ""
      for(let x = borders[3] - 1; x <= borders[1] + 1; x++) {
        str += elfCoords.has([x, y].join("/")) ? "#" : "."
      }
      content += str
      content += "\n"
    }
    try {
      fs.writeFileSync('day23/output.txt', content);
      console.log("output.txt created successfully")
    } catch (err) {
      console.error(err);
    }
  }

  mapCoords()
  let round = 0
  let sum = 0
  let t1
  while(true) {
    const moves = []
    for(let index = 0; index < elfs.length; index++) {
      let pos = elfs[index]
      if(!shouldMove(pos[0], pos[1])) {
        continue
      }
      const targetDir = directions.find((dir) => findDirection(pos[0], pos[1], dir))
      const targetPos = move(pos[0], pos[1], targetDir)
      if(targetPos) {
        proposed.set(targetPos.join("/"), (proposed.get(targetPos.join("/")) || 0) + 1)
        moves.push([index, targetPos])
      }
    }

    if(moves.length === 0) {
      break
    }

    moves.forEach(([index, pos]) => {
      if(pos && proposed.get(pos.join("/")) === 1) {
        elfs[index] = pos
      }
    })


    directions.push(...directions.splice(0, 1))
    mapCoords()
    proposed.clear()
    round++
    if(round === 10) {
      for(let y = borders[0]; y <= borders[2]; y++) {
        for(let x = borders[3]; x <= borders[1]; x++) {
          if(!elfCoords.has([x, y].join("/"))) {
            sum++
          }
        }
      }
      console.log("Part 1:", sum)
      t1 = performance.now()
      console.log(`Part 1 took ${(t1 - t0) / 1000} seconds.`)
    }
  }

  console.log("Part 2:", round + 1)
  const t2 = performance.now()
  console.log(`Part 2 took ${(t2 - t1) / 1000} seconds.`)
})