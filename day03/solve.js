const fs = require("fs");

function charToPriority(code) {
  if(code >= 97) { return code - 96 }
  else return code - 38
}

fs.readFile("day03/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  let sum = 0
  input.split("\n").forEach((line) => {
    if(line) {
      let found
      for(let i = 0; i < line.length / 2; i++)
      {
        const char = line.charAt(i)
        if(line.indexOf(char, line.length / 2) > -1) {
          found = line.charCodeAt(i)
          break
        }
      }
      sum += charToPriority(found)
    }
  })
  console.log("Part 1:", sum)

  let splittedLines = input.split("\n").filter(v => v)
  let badgeSum = 0
  for(let i = 0; i < splittedLines.length; i += 3)
  {
    let found
    for(let j = 0; j < splittedLines[i].length; j++)
    {
      const char = splittedLines[i].charAt(j)
      if(splittedLines[i+1].indexOf(char) > -1 
        && splittedLines[i+2].indexOf(char) > -1) {
        found = splittedLines[i].charCodeAt(j)
        break
      }
    }
    badgeSum += charToPriority(found)
  }
  console.log("Part 2:", badgeSum)
})