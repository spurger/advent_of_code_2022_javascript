const fs = require("fs");

const values = {
  A: 1, // "Rock"
  B: 2, // "Paper"
  C: 3, // "Scissors"
  X: 1, // "Rock"
  Y: 2, // "Paper"
  Z: 3, // "Scissors"
}

function equals(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index])
}

const winPairs = [["C", "X"],["A", "Y"], ["B", "Z"]]
function isWin(pair) {
  return winPairs.some(p => equals(p, pair))
}

const losePairs = [["B", "X"],["C", "Y"], ["A", "Z"]]
function isLose(pair) {
  return losePairs.some(p => equals(p, pair))
}

fs.readFile("day02/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  let totalScoreOnPlayedValue = 0
  let totalScoreOnExpectedResult = 0
  input.split("\n").forEach((line) => {
    if(line) {
      const [opponentValue, yourValue] = line.split(' ')
      if(values[opponentValue] === values[yourValue]) {
        totalScoreOnPlayedValue += 3
      } else if(isWin([ opponentValue, yourValue ])) {
        totalScoreOnPlayedValue += 6
      } else if(isLose([ opponentValue, yourValue ])) {
        totalScoreOnPlayedValue += 0
      }
      totalScoreOnPlayedValue += values[yourValue]

      const result = yourValue
      if(result === "Y") {
        totalScoreOnExpectedResult += 3 + values[opponentValue]
      } else if(result === "X") {
        totalScoreOnExpectedResult += values[losePairs.find(pair => pair[0] === opponentValue)[1]]
      } else if(result === "Z") {
        totalScoreOnExpectedResult += 6 + values[winPairs.find(pair => pair[0] === opponentValue)[1]]
      }
    }
  })
  console.log("Part 1:", totalScoreOnPlayedValue)
  console.log("Part 2:", totalScoreOnExpectedResult)
});