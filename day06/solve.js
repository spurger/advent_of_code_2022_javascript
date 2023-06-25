const fs = require("fs");

fs.readFile("day06/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  input.split("\n").filter(v => v).forEach((line) => {
    if(!line) { return }
    let sequenceFoundAt
    let sequenceFoundAtPart2
    let chars = []
    for(let i = 0; i < line.length; i++) {
      if(chars.includes(line[i])) {
        let index = chars.lastIndexOf(line[i])
        chars = chars.splice(index+1)
      }
      chars.push(line[i])
      // Part 1
      if(!sequenceFoundAt && chars.length === 4) {
        sequenceFoundAt = i+1
      }
      // Part 2
      if(!sequenceFoundAtPart2 && chars.length === 14) {
        sequenceFoundAtPart2 = i+1
      }

      if(sequenceFoundAt && sequenceFoundAtPart2) { break; }
    }
    console.log("Part 1:", sequenceFoundAt)
    console.log("Part 2:", sequenceFoundAtPart2)
  })
})