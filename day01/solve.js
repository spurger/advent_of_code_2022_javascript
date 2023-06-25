const fs = require("fs");

fs.readFile("day01/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const elfInventory = []
  let tempArray = []
  input.split("\n").forEach((line) => {
    if(line === "") {
      elfInventory.push(tempArray)
      tempArray = []
    } else {
      tempArray.push(parseInt(line))
    }
  })
  const summarized = elfInventory.reduce((result, caloriesArray) => {
    result.push(caloriesArray.reduce((acc, val) => acc + val), 0)
    return result
  }, []).filter(v => v).sort((a, b) => b-a)

  console.log("Part 1:", summarized[0]);

  const topThree = [...summarized].slice(0, 3)

  console.log("Part 2:", topThree.reduce((acc, val) => acc + val, 0))
});