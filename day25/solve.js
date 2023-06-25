const fs = require("fs");

fs.readFile("day25/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const t0 = performance.now()

  let conversions = []

  function convertToDecimal(snafu) {
    let sum = 0
    for(let i = snafu.length - 1; i >= 0; i--) {
      const value = Math.pow(5, snafu.length - 1 - i)
      const char = snafu.charAt(i)
      if(char === "2") {
        sum += (value * 2)
      } else if(char === "1") {
        sum += value
      } else if(char === "-") {
        sum += (-1 * value)
      } else if(char === "=") {
        sum += (-2 * value)
      }
    }
    return sum
  }

  function convertToSnafu(num) {
    let output = []
    do {
      let index = num % 5
      if(index > 2) {
        output.unshift(index === 3 ? "=" : "-")
        num = Math.trunc(num / 5) + 1
      } else {
        output.unshift(String(index))
        num = Math.trunc(num / 5)
      }
    } while (num != 0);
    return output.join("")
  }

  input.split("\n").filter(v => v).forEach((line) => {
    line = line.trim()
    conversions.push([line, convertToDecimal(line)])
  })

  let requiredFuel = conversions.reduce((res, [snafu, decimal]) => res + decimal, 0)

  console.log("Part 1:", convertToSnafu(requiredFuel))
  const t1 = performance.now()
  console.log(`Part 1 took ${(t1 - t0) / 1000} seconds.`)
})