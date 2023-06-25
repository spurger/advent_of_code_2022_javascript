const fs = require("fs");

// const filename = "sample.txt"
const filename = "input.txt"

const dimension = filename === "input.txt" ? 50 : 4

fs.readFile(`day22/${filename}`, (err, data) => {
  if (err) throw err;

  const input = data.toString().split("\n").filter(v => v)

  const t0 = performance.now()

  let board = Array.from({ length: input.length - 1 })
  let boardRowBoundaries = []
  let boardColBoundaries = []
  let path = []
  // keeps track on which position we visited for drawing
  let trail = new Map()

  let boardWidth = 0
  input.forEach((line) => {
    if(line.match(/\d+/)) {
      const regex = /(\d+)(R|L)?/g
      let match = regex.exec(line)
      while (match != null) {
        path.push([parseInt(match[1]), match[2]])
        match = regex.exec(line);
      }
    } else {
      boardWidth = Math.max(boardWidth, line.length)
    }
  })
  board = board.map((v) => Array.from({ length: boardWidth }, (v) => " "))
  for(let row = 0; row < board.length - 1; row++) { 
    boardRowBoundaries.push({ min: null, max: null }) 
  }
  for(let col = 0; col < boardWidth - 1; col++) {
    boardColBoundaries.push({ min: null, max: null }) 
  }

  function nonNull() {
    return [...arguments].filter(v => v !== null)
  }

  input.forEach((line, row) => {
    if(!line.match(/\d+/)) {
      for(let col = 0; col < line.length; col++) {
        let char = line.charAt(col)
        if(char === "#" || char === ".") {
          board[row][col] = char
          boardRowBoundaries[row].min = 
            Math.min(...nonNull(boardRowBoundaries[row].min, col))
          boardRowBoundaries[row].max = 
            Math.max(...nonNull(boardRowBoundaries[row].max, col))
          boardColBoundaries[col].min = 
            Math.min(...nonNull(boardColBoundaries[col].min, row))
          boardColBoundaries[col].max = 
            Math.max(...nonNull(boardColBoundaries[col].max, row))
        }
      }
    }
  })

  let [x, y] = [0, 0]
  const cubeSheets = {}
  let nextId = 1
  while(y <= board.length) {
    let yMax = y + dimension - 1
    while(x <= boardWidth) {
      let xMax = x + dimension - 1
      const rows = boardRowBoundaries.filter((v, i) => i >= y && i <= yMax)
      if(rows.length > 0 && rows.every((boundary) => x >= boundary.min && xMax <= boundary.max)) {
        cubeSheets[nextId] = {x, xMax, y, yMax}
        nextId++
      }
      x += dimension
    }
    y += dimension
    x = 0
  }

  function currentSheet({ row, col }) {
    for(let id in cubeSheets) {
      const sheet = cubeSheets[id]
      if(col >= sheet.x && col <= sheet.xMax 
        && row >= sheet.y && row <= sheet.yMax) {
        return sheet
      }
    }
    return -1
  }

  // folding surfaces on edges based on visualization (see visual.png)
  if(filename === "sample.txt") {
    cubeSheets[1] = { 
      ...cubeSheets[1], 
      "U": ({ row, col }) => ({
        row: cubeSheets[2].y,
        col: cubeSheets[2].xMax - (col - cubeSheets[1].x),
        facing: "D",
      }),
      "R": ({ row, col }) => ({
        row: cubeSheets[6].y + (cubeSheets[1].yMax - row),
        col: cubeSheets[6].xMax,
        facing: "L",
      }),
      "L": ({ row, col }) => ({
        row: cubeSheets[3].y,
        col: cubeSheets[3].x + row - cubeSheets[1].y,
        facing: "D",
      }),
    }
    cubeSheets[2] = {
      ...cubeSheets[2], 
      "U": ({ row, col }) => ({
        row: cubeSheets[1].y,
        col: cubeSheets[1].x + (cubeSheets[2].xMax - col),
        facing: "D",
      }),
      "D": ({ row, col }) => ({
        row: cubeSheets[5].yMax,
        col: cubeSheets[5].x + (cubeSheets[2].xMax - col),
        facing: "U",
      }),
      "L": ({ row, col }) => ({
        row: cubeSheets[6].yMax,
        col: cubeSheets[6].x + (cubeSheets[2].yMax - row),
        facing: "U",
      }),
    }
    cubeSheets[3] = {
      ...cubeSheets[3], 
      "U": ({ row, col }) => ({
        row: cubeSheets[1].y + (col - cubeSheets[3].y),
        col: cubeSheets[1].x,
        facing: "R",
      }),
      "D": ({ row, col }) => ({
        row: cubeSheets[5].yMax - (col - cubeSheets[3].x),
        col: cubeSheets[5].x,
        facing: "R",
      }),
    }
    cubeSheets[4] = {
      ...cubeSheets[4], 
      "R": ({ row, col }) => ({ 
        row: cubeSheets[6].y, 
        col: cubeSheets[6].x + cubeSheets[4].yMax - row, 
        facing: "D", 
      }),
    }
    cubeSheets[5] = {
      ...cubeSheets[5], 
      "D": ({ row, col }) => ({
        row: cubeSheets[2].yMax,
        col: cubeSheets[2].xMax - (col - cubeSheets[5].x),
        facing: "U",
      }),
      "L": ({ row, col }) => ({
        row: cubeSheets[3].yMax,
        col: cubeSheets[3].xMax - (row - cubeSheets[5].y),
        facing: "U",
      }),
    }
    cubeSheets[6] = {
      ...cubeSheets[6], 
      "U": ({ row, col }) => ({
        row: cubeSheets[4].y + (cubeSheets[6].xMax - col),
        col: cubeSheets[4].xMax,
        facing: "L",
      }),
      "R": ({ row, col }) => ({
        row: cubeSheets[1].y + (row - cubeSheets[6].y),
        col: cubeSheets[1].xMax,
        facing: "L",
      }),
      "D": ({ row, col }) => ({
        row: cubeSheets[2].y + (cubeSheets[6].xMax - col),
        col: cubeSheets[2].x,
        facing: "R",
      }),
    }
  } else if(filename === "input.txt") {
    cubeSheets[1] = { 
      ...cubeSheets[1], 
      "U": ({ row, col }) => ({
        row: cubeSheets[6].y + (col - cubeSheets[1].x),
        col: cubeSheets[6].x,
        facing: "R",
      }),
      "L": ({ row, col }) => ({
        row: cubeSheets[4].y + (cubeSheets[1].yMax - row),
        col: cubeSheets[4].x,
        facing: "R",
      }),
    }
    cubeSheets[2] = {
      ...cubeSheets[2], 
      "U": ({ row, col }) => ({
        row: cubeSheets[6].yMax,
        col: cubeSheets[6].x + (col - cubeSheets[2].x),
        facing: "U",
      }),
      "R": ({ row, col }) => ({
        row: cubeSheets[5].y + (cubeSheets[2].yMax - row),
        col: cubeSheets[5].xMax,
        facing: "L",
      }),
      "D": ({ row, col }) => ({
        row: cubeSheets[3].y + (col - cubeSheets[2].x),
        col: cubeSheets[3].xMax,
        facing: "L",
      }),
    }
    cubeSheets[3] = {
      ...cubeSheets[3], 
      "R": ({ row, col }) => ({
        row: cubeSheets[2].yMax,
        col: cubeSheets[2].x + (row - cubeSheets[3].y),
        facing: "U",
      }),
      "L": ({ row, col }) => ({
        row: cubeSheets[4].y,
        col: cubeSheets[4].x + (row - cubeSheets[3].y),
        facing: "D",
      }),
    }
    cubeSheets[4] = {
      ...cubeSheets[4], 
      "U": ({ row, col }) => ({
        row: cubeSheets[3].y + (col - cubeSheets[4].x),
        col: cubeSheets[3].x,
        facing: "R",
      }),
      "L": ({ row, col }) => ({
        row: cubeSheets[1].yMax - (row - cubeSheets[4].y),
        col: cubeSheets[1].x,
        facing: "R",
      }),
    }
    cubeSheets[5] = {
      ...cubeSheets[5], 
      "R": ({ row, col }) => ({
        row: cubeSheets[2].yMax - (row - cubeSheets[5].y),
        col: cubeSheets[2].xMax,
        facing: "L",
      }),
      "D": ({ row, col }) => ({
        row: cubeSheets[6].y + (col - cubeSheets[5].x),
        col: cubeSheets[6].xMax,
        facing: "L",
      }),
    }
    cubeSheets[6] = {
      ...cubeSheets[6], 
      "R": ({ row, col }) => ({
        row: cubeSheets[5].yMax,
        col: cubeSheets[5].x + (row - cubeSheets[6].y),
        facing: "U",
      }),
      "D": ({ row, col }) => ({
        row: cubeSheets[2].y,
        col: cubeSheets[2].x + (col - cubeSheets[6].x),
        facing: "D",
      }),
      "L": ({ row, col }) => ({
        row: cubeSheets[1].y,
        col: cubeSheets[1].x + (row - cubeSheets[6].y),
        facing: "D",
      }),
    }
  }
  
  const facings = ["U", "R", "D", "L"]
  const dirChars = ["^", ">", "v", "<"]
  function changeFacing(oldFacing, newFacing) {
    if(!newFacing) { return oldFacing }
    let facingIndex = facings.indexOf(oldFacing)
    if(newFacing === "L") {
      if(facingIndex === 0) { return facings[facings.length - 1] }
      facingIndex = (facingIndex - 1) % facings.length
      return facings[facingIndex]
    } else if(newFacing === "R") {
      if(facingIndex === (facings.length - 1)) { return facings[0] }
      facingIndex = (facingIndex + 1) % facings.length
      return facings[facingIndex]
    }
  }

  function getNext(pos, isCube = false) {
    let nextPos = { ...pos }
    let sheet
    if(isCube) { sheet = currentSheet(pos) }
    if(pos.facing === "U") {
      nextPos.row--
      if(nextPos.row < boardColBoundaries[nextPos.col].min) {
        if(isCube) {
          nextPos = sheet["U"] ? sheet["U"](pos) : false
        } else {
          nextPos.row = boardColBoundaries[nextPos.col].max
        }
      }
    } else if(pos.facing === "R") {
      nextPos.col++
      if(nextPos.col > boardRowBoundaries[nextPos.row].max) {
        if(isCube) {
          nextPos = sheet["R"] ? sheet["R"](pos) : false
        } else {
          nextPos.col = boardRowBoundaries[nextPos.row].min
        }
      }
    } else if(pos.facing === "D") {
      nextPos.row++
      if(nextPos.row > boardColBoundaries[nextPos.col].max) {
        if(isCube) {
          nextPos = sheet["D"] ? sheet["D"](pos) : false
        } else {
          nextPos.row = boardColBoundaries[nextPos.col].min
        }
      }
    } else if(pos.facing === "L") {
      nextPos.col--
      if(nextPos.col < boardRowBoundaries[nextPos.row].min) {
        if(isCube) {
          nextPos = sheet["L"] ? sheet["L"](pos) : false
        } else {
          nextPos.col = boardRowBoundaries[nextPos.row].max
        }
      }
    } 
    if(!nextPos) { console.error({ getNext: "error", ...pos }); return false; }
    let element = board[nextPos.row][nextPos.col]
    if(element === "#") {
      return false
    } else {
      return nextPos
    }
  }

  function followPath(path, position, isCube = false) {
    let pos = { ...position }
    // draw
    trail.set([pos.row, pos.col].join("/"), "S")
    path.forEach(([steps, nextDir]) => {
      for(let step = 1; step <= steps; step++) {
        const nextElement = getNext(pos, isCube)
        if(!nextElement) {
          break
        } else {
          pos = nextElement
          // draw
          trail.set([pos.row, pos.col].join("/"), dirChars.find((d, i) => facings.indexOf(pos.facing) === i))
        }
      }
      pos.facing = changeFacing(pos.facing, nextDir)
      // draw
      trail.set([pos.row, pos.col].join("/"), dirChars.find((d, i) => facings.indexOf(pos.facing) === i))
    })
    // draw
    trail.set([pos.row, pos.col].join("/"), pos.facing)
    return pos
  }

  function calcPassword(pos) {
    return (pos.row * 1000) 
      + (pos.col * 4) 
      + (facings.indexOf(pos.facing) + 3) % facings.length
  }

  let position = { row: 0, col: board[0].indexOf("."), facing: "R" }
  let finalPosition = followPath(path, position)
  finalPosition.row++
  finalPosition.col++
  let password = calcPassword(finalPosition)

  // draws board into text file
  function drawPath() {
    let content = ""
    for(let row = 0; row < board.length; row++) {
      let str = ""
      for(let col = 0; col < boardWidth; col++) {
        str += trail.get([row, col].join("/")) || board[row][col]
      }
      content += str
      content += "\n"
    }
  
    try {
      fs.writeFileSync('day22/output.txt', content);
      console.log("output.txt created successfully")
    } catch (err) {
      console.error(err);
    }
  }
  
  console.log("Part 1:", password)
  const t1 = performance.now()
  console.log(`Part 1 took ${(t1 - t0) / 1000} seconds.`)

  trail.clear()
  
  position = { row: 0, col: board[0].indexOf("."), facing: "R" }
  finalPosition = followPath(path, position, true)
  finalPosition.row++
  finalPosition.col++
  password = calcPassword(finalPosition)
  
  console.log("Part 2:", password)
  const t2 = performance.now()
  console.log(`Part 2 took ${(t2 - t1) / 1000} seconds.`)
})