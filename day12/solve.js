const fs = require("fs");

fs.readFile("day12/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const grid = []
  let startingPos = [-1, -1]
  let endingPos = [-1, -1]

  input.split("\n").filter(v => v).forEach((line) => {
    let row = line.trim()
    const startIndex = row.indexOf("S") // S
    const endIndex = row.indexOf("E") // E
    if(startIndex > -1) {
      startingPos = [grid.length, startIndex]
      row = row.replace(/S/, "a")
    }
    if(endIndex > -1) {
      endingPos = [grid.length, endIndex]
      row = row.replace(/E/, "z")
    }
    grid.push(row)
  })

  function toMapKey(pos) {
    return pos.join("/")
  }

  function fromMapKey(key) {
    return key.split("/")
  }

  function getGridNeighbours(pos) {
    let [row, col] = pos
    let top = [row - 1, col]
    let right = [row, col + 1]
    let bottom = [row + 1, col]
    let left = [row, col - 1]
    return [top, right, bottom, left].filter((p) => {
      return p[0] >= 0 && p[0] < grid.length 
        && p[1] >= 0 && p[1] < grid[p[0]].length
        && grid[p[0]].charCodeAt(p[1]) - grid[pos[0]].charCodeAt(pos[1]) <= 1
    })
  }

  function writeOutput(visited) {
    let content = "\n"
    for(let r = 0; r < grid.length; r++) {
      for(let c = 0; c < grid[r].length; c++) {
        if(visited.has(toMapKey([r, c]))) {
          content += grid[r].charAt(c).toUpperCase()
        } else {
          content += grid[r].charAt(c)
        }
      }
      content += "\n"
    }
    fs.writeFile('./day12/output.txt', content, err => {
      if (err) {
        console.error(err)
      }
      console.log("output.txt was created successfully")
    })
  }

  function searchInGrid(from) {
    let queue = [from]
    let visited = new Map()
    visited.set(toMapKey(queue[0]), 0)
    while(queue.length > 0) {
      let position = queue.shift()
      let steps = visited.get(toMapKey(position))
      let neighbours = getGridNeighbours(position)
      for(const neighbour of neighbours) {
        const neighbourKey = toMapKey(neighbour)
        if(!visited.has(neighbourKey)) {
          visited.set(neighbourKey, steps + 1)
          queue.push(neighbour)
        } else {
          let visitedSteps = visited.get(neighbourKey)
          if((steps + 1) < visitedSteps) {
            visited.set(neighbourKey, steps + 1)
          }
        }
      }
    }

    return visited
  }

  

  console.log("Part 1:", searchInGrid(startingPos).get(toMapKey(endingPos)))

  let hikingTrailSteps = (grid.length * grid[0].length) + 1
  for(let row = 0; row < grid.length; row++) {
    for(let col = 0; col < grid[row].length; col++) {
      if(grid[row].charAt(col) === "a") {
        const steps = searchInGrid([row, col]).get(toMapKey(endingPos))
        if(steps > 0) {
          hikingTrailSteps = Math.min(hikingTrailSteps, steps)
        }
      }
    }
  }
  console.log("Part 2:", hikingTrailSteps)
})