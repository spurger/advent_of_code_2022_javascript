const fs = require("fs");

fs.readFile("day13/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const packets = []

  input.split("\n").filter(v => v).forEach((line, index) => {
    if(index % 3 === 0) {
      packets.push([JSON.parse(line.trim())])
    } else if(index % 3 === 1) {
      packets[packets.length - 1].push(JSON.parse(line.trim()))
    }
  })

  function compareArrays(left, right) {
    for(let i = 0; i < left.length; i++) {
      if(right[i] === undefined) { return "invalid" }
      if(Number.isInteger(left[i]) && Number.isInteger(right[i])) {
        if(left[i] < right[i]) { return "valid" }
        else if(left[i] > right[i]) { return "invalid" }
      } else if(Array.isArray(left[i]) && Array.isArray(right[i])) {
        let nestedComparison = compareArrays(left[i], right[i])
        if(["valid", "invalid"].includes(nestedComparison)) {
          return nestedComparison
        }
      } else {
        let nestedComparison = compareArrays(
          Array.isArray(left[i]) ? left[i] : [left[i]], 
          Array.isArray(right[i]) ? right[i] : [right[i]]
        )
        if(["valid", "invalid"].includes(nestedComparison)) {
          return nestedComparison
        }
      }
    }
    if(left.length < right.length) { return "valid" }

    return "continue"
  }

  const sortedPackets = []

  let sum = 0
  for(let i = 0; i < packets.length; i++) {
    let result = compareArrays(packets[i][0], packets[i][1])
    sum += result === "valid" ? (i + 1) : 0
    sortedPackets.push(packets[i][0], packets[i][1])
  }
  console.log("Part 1:", sum)

  sortedPackets.push([[2]], [[6]])
  sortedPackets.sort((p1, p2) => {
    let result = compareArrays(p1, p2)
    if(result === "valid") { return -1 }
    else if(result === "invalid") { return 1 }
    else return 0
  })
  sum = 1
  for(let i = 0; i < sortedPackets.length; i++) {
    if(compareArrays(sortedPackets[i], [[2]]) === "continue" 
      || compareArrays(sortedPackets[i], [[6]]) === "continue")
    sum *= (i + 1)
  }
  console.log("Part 2:", sum)
})