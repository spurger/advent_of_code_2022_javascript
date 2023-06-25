const fs = require("fs");

fs.readFile("day10/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString().split("\n").filter(v => v)

  let x = 1
  let xChanges = []

  let observeAt = [20, 60, 100, 140, 180, 220]
  let observed = []
  let crt = Array.from({ length: 6 })
  for(let i = 0; i < crt.length; i++) {
    crt[i] = Array.from({ length: 40 })
  }

  for(let cycleCount = 1; cycleCount <= 240; cycleCount++) {
    x += xChanges.shift() || 0
    if(input[cycleCount-1]) {
      const [command, value] = input[cycleCount-1].split(" ").map((l, i) => i === 1 ? parseInt(l) : l)
      if(command === "addx") {
        xChanges.push(0)
        xChanges.push(value)
      } else {
        xChanges.push(0)
      }
    }

    const index = observeAt.indexOf(cycleCount)
    if(index > -1) {
      observed.push(observeAt[index] * x)
    }

    const crtColIndex = Math.floor((cycleCount - 1) / 40)
    const crtRowIndex = (cycleCount - 1) % 40
    if(crtRowIndex >= (x - 1) && crtRowIndex <= (x + 2)) {
      crt[crtColIndex][crtRowIndex] = "#"
    } else {
      crt[crtColIndex][crtRowIndex] = "."
    }
  }
  console.log("Part 1:", observed.reduce((acc, num) => acc + num))
  console.log("Part 2:")
  for(let i = 0; i < crt.length; i++) {
    console.log(i+1, crt[i].join(" "))
  }
})