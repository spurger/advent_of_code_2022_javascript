const fs = require("fs");

fs.readFile("day21/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const t0 = performance.now()

  let monkeys = {}

  input.split("\n").filter(v => v.trim()).forEach((line) => {
    let names = line.match(/[a-z]+/g)
    if(names.length > 1) {
      let operand = line.match(/[+\-*/]+/)[0]
      monkeys[names[0]] = [names[1], names[2], operand]
    } else {
      let number = parseInt(line.match(/\d+/)[0])
      monkeys[names[0]] = number
    }
  })

  function opposite(operand) {
    switch(operand) {
      case "+": return "-"
      case "-": return "+"
      case "*": return "/"
      case "/": return "*"
    }
  }

  function calculate(r1, r2, operand) {
    switch(operand) {
      case "+": return r1 + r2
      case "-": return r1 - r2
      case "*": return r1 * r2
      case "/": return r1 / r2
    }
  }

  function resolve(dependencies) {
    const _dependencies = {}
    Object.keys(dependencies).forEach((key) => {
      _dependencies[key] = Array.isArray(dependencies[key]) 
        ? [...dependencies[key]] : dependencies[key]
    })
    let keepGoing = true
    while(keepGoing) {
      let keys = Object.keys(_dependencies).filter((key) => Array.isArray(_dependencies[key]))
      keepGoing = false
      for(const key of keys) {
        let [first, second, operand] = _dependencies[key]
        if(typeof _dependencies[first] === "number") {
          _dependencies[key][0] = _dependencies[first]
          first = _dependencies[first]
        }
        if(typeof _dependencies[second] === "number") {
          _dependencies[key][1] = _dependencies[second]
          second = _dependencies[second]
        }
        const isFirstN = typeof first === "number"
        const isSecondN = typeof second === "number"
        if(isFirstN && isSecondN) {
          if(operand !== "=") {
            _dependencies[key] = calculate(first, second, operand)
            keepGoing = true
          }
        }
      }
    }
    return _dependencies
  }
  
  console.log("Part 1:", resolve(monkeys)["root"])
  const t1 = performance.now()
  console.log(`Part 1 took ${(t1 - t0) / 1000} seconds.`)

  // Resolve to everything we can then use binary search and try matching root's values
  monkeys["root"][2] = "="
  monkeys["humn"] = "x"
  let resolvedMonkeys = resolve(monkeys)
  let left = 0
  let right = Number.MAX_SAFE_INTEGER
  let result
  while(left <= right) {
    const mid = Math.floor((right - left) / 2) + left
    resolvedMonkeys["humn"] = mid
    const resolved = resolve(resolvedMonkeys)
    if(resolved["root"][0] > resolved["root"][1]) {
      left = mid + 1
    } else if(resolved["root"][0] < resolved["root"][1]) {
      right = mid - 1
    } else {
      result = mid
      left = right + 1
    }
  }

  console.log("Part 2:", result)
  const t2 = performance.now()
  console.log(`Part 2 took ${(t2 - t1) / 1000} seconds.`)
})