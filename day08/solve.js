const fs = require("fs");

function isVisible(grid, row, col) {
  const height = grid[row][col]
  if(row === 0 || row === (grid.length - 1) 
    || col === 0 || col === (grid[row].length - 1)) {
    return true
  }
  // Order: top, bottom, left, right
  const visible = Array.from({ length: 4 }).fill(true)
  for(let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    if(rowIndex < row && grid[rowIndex][col] >= height) { visible[0] = false }
    if(rowIndex > row && grid[rowIndex][col] >= height) { visible[1] = false }
  }
  for(let colIndex = 0; colIndex < grid[row].length; colIndex++) {
    if(colIndex > col && grid[row][colIndex] >= height) { visible[2] = false }
    if(colIndex < col && grid[row][colIndex] >= height) { visible[3] = false }
  }
  return visible.some(v => v)
}

function calculateScenicScore(grid, row, col) {
  const height = grid[row][col]
  // Order: top, bottom, left, right
  const scores = Array.from({ length: 4 }).fill(0)
  for(let rowIndex = row-1; rowIndex >= 0; rowIndex--) {
    if(grid[rowIndex][col] < height) { scores[0]++ }
    else { scores[0]++; break; }
  }
  for(let rowIndex = row+1; rowIndex < grid.length; rowIndex++) {
    if(grid[rowIndex][col] < height) { scores[1]++ }
    else { scores[1]++; break; }
  }
  for(let colIndex = col-1; colIndex >= 0; colIndex--) {
    if(grid[row][colIndex] < height) { scores[2]++ }
    else { scores[2]++; break; }
  }
  for(let colIndex = col+1; colIndex < grid[row].length; colIndex++) {
    if(grid[row][colIndex] < height) { scores[3]++ }
    else { scores[3]++; break; }
  }

  return scores.reduce((acc, mul) => acc * mul, 1)
}

fs.readFile("day08/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const grid = []
  const visibleGrid = []
  const scenicScoresGrid = []
  input.split("\n").filter(v => v).forEach((line) => {
    const row = line.trim().split('').map(v => parseInt(v))
    grid.push(row)
    visibleGrid.push(Array.from({ length: row.length }).fill(0))
    scenicScoresGrid.push(Array.from({ length: row.length }).fill(0))
  })
  let visibleCount = 0
  for(let row = 0; row < grid.length; row++) {
    for(let col = 0; col < grid[row].length; col++) {
      const visible = isVisible(grid, row, col) ? 1 : 0
      visibleGrid[row][col] = visible
      if(visible) { visibleCount++ }
      scenicScoresGrid[row][col] = calculateScenicScore(grid, row, col)
    }
  }

  console.log("Part 1:", visibleCount)

  let bestScenicScore = 0
  for(let row = 0; row < grid.length; row++) {
    bestScenicScore = Math.max(bestScenicScore, ...scenicScoresGrid[row])
  }

  console.log("Part 2:", bestScenicScore)
})