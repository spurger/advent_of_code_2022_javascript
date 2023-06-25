const fs = require("fs");

function arrayFromString(str) {
  let [start, end] = str.split("-").map(s => parseInt(s))
  return Array.from({ length: end-start+1 }, (v, i) => i+start)
}

function containsEachOther(arr1, arr2) {
  return arr1.every(i => arr2.includes(i)) || arr2.every(i => arr1.includes(i))
}

function overlaps(arr1, arr2) {
  return arr1.some(i => arr2.includes(i))
}

fs.readFile("day04/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  let contains = 0
  let overlapCount = 0
  input.split("\n").filter(v => v).forEach((line) => {
    let [elf1_sections, elf2_sections] = 
      line.split(",").map(section => arrayFromString(section))
    if(containsEachOther(elf1_sections, elf2_sections)) {
      contains++
    }
    if(overlaps(elf1_sections, elf2_sections)) {
      overlapCount++
    }
  })
  console.log("Part 1:", contains)
  console.log("Part 2:", overlapCount)
})