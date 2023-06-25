const fs = require("fs");

fs.readFile("day18/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const cubePositions = []
  let minimuns = [0, 0, 0]
  let maximums = [0, 0, 0]

  
  input.split("\n").filter(v => v).forEach((line) => {
    const pos = line.trim().split(",").map(v => parseInt(v))
    cubePositions.push(pos)
    minimuns = [Math.min(minimuns[0], pos[0]), Math.min(minimuns[1], pos[1]), Math.min(minimuns[2], pos[2])]
    maximums = [Math.max(maximums[0], pos[0]), Math.max(maximums[1], pos[1]), Math.max(maximums[2], pos[2])]
  })
  
  function isAdjacent([x1, y1, z1], [x2, y2, z2]) {
    return [
      Math.abs(x2 - x1) === 1, 
      Math.abs(y2 - y1) === 1, 
      Math.abs(z2 - z1) === 1,
    ].filter(v => v).length === 1 
    && [
      Math.abs(x2 - x1) === 0, 
      Math.abs(y2 - y1) === 0, 
      Math.abs(z2 - z1) === 0,
    ].filter(v => v).length === 2 
  }
  
  const adjacencyList = Array.from({ length: cubePositions.length }, (v, i) => 0)
  for(let i = 0; i < cubePositions.length; i++) {
    for(let j = 0; j < cubePositions.length; j++) {
      if(i !== j && isAdjacent(cubePositions[i], cubePositions[j])) {
        adjacencyList[i]++
      }
    }
  }

  let surface = adjacencyList.length * 6 - adjacencyList.reduce((acc, curr) => acc + curr, 0)

  console.log("Part 1:", surface)

  minimuns = minimuns.map((v) => v - 1)
  maximums = maximums.map((v) => v + 1)

  const cubeSet = new Set(cubePositions.map(pos => pos.join(",")))

  let queue = [minimuns]
  const visited = {}
  visited[minimuns.join(",")] = new Set()
  while(queue.length > 0) {
    let [x, y, z] = queue.shift()
    const queuedKey = [x, y, z].join(",")

    if(cubeSet.has(queuedKey)) { continue }

    let nextPoints = [
      [x + 1, y, z],
      [x - 1, y, z],
      [x, y + 1, z],
      [x, y - 1, z],
      [x, y, z + 1],
      [x, y, z - 1],
    ].filter(([nx, ny, nz]) => {
      return nx >= minimuns[0] && nx <= maximums[0] 
        && ny >= minimuns[1] && ny <= maximums[1] 
        && nz >= minimuns[2] && nz <= maximums[2] 
    })
    nextPoints.forEach((point) => {
      const key = point.join(",")
      if(!visited[key]) { visited[key] = new Set() }
      let visitedSides = visited[key]
      if(!visitedSides.has(queuedKey)) {
        queue.push(point)
        visitedSides.add(queuedKey)
        visited[queuedKey].add(key)
      }
    })
  }

  let outerSurface = 0
  cubePositions.forEach((point) => {
    const visitedSides = visited[point.join(",")]
    if(visitedSides) {
      outerSurface += visitedSides.size
    }
  })

  console.log("Part 2:", outerSurface)
})