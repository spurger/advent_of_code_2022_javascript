const fs = require("fs");

fs.readFile("day20/sample.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const t0 = performance.now()

  input.split("\n").filter(v => v).forEach((line) => {
    
  })

  console.log("Part 1:")
  const t1 = performance.now()
  console.log(`Part 1 took ${(t1 - t0) / 1000} seconds.`)

  console.log("Part 2:")
  const t2 = performance.now()
  console.log(`Part 2 took ${(t2 - t1) / 1000} seconds.`)
})