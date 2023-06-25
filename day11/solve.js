const fs = require("fs");

var operators = {
  '+': function(a, b) { return a + b },
  '*': function(a, b) { return a * b },
};

var limit = 1

class Monkey {
  constructor(id, isPart2 = false) {
    this.id = id
    this.isPart2 = isPart2
    this.items = []
    this.expression = {
      operator: "+",
      value: 0
    }
    this.divisible = ""
    this.throwToIndex = {
      "true": -1,
      "false": -1,
    }
    this.inspectionCount = 0
  }

  throwTo() {
    let throwToIndexes = []
    while(this.items.length > 0) {
      let old = this.items.shift()
      this.inspectionCount++
      old = operators[this.expression.operator](old, this.expression.value === "old" ? old : this.expression.value)
      if(!this.isPart2) {
        old = Math.floor(old / 3)
      } else {
        old = old % limit
      }
      let isTrue = old % this.divisible == 0
      throwToIndexes.push([this.throwToIndex[isTrue ? "true" : "false"], old])
    }
    return throwToIndexes
  }
}

fs.readFile("day11/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const monkeys = []
  const monkeysPart2 = []

  input.split("\n").filter(v => v).forEach((line) => {
    if(line.includes("Monkey")) {
      monkeys.push(new Monkey(monkeys.length))
      monkeysPart2.push(new Monkey(monkeys.length, true))
    } else if(line.includes("Starting items")) {
      monkeys[monkeys.length - 1].items = line.match(/\d+/g).map(item => parseInt(item))
      monkeysPart2[monkeys.length - 1].items = line.match(/\d+/g).map(item => parseInt(item))
    } else if(line.includes("Operation")) {
      let [old, operator, value] = line.split("=")[1].trim().split(" ")
      monkeys[monkeys.length - 1].expression.operator = operator
      monkeys[monkeys.length - 1].expression.value = value === "old" ? "old" : parseInt(value)
      monkeysPart2[monkeys.length - 1].expression.operator = operator
      monkeysPart2[monkeys.length - 1].expression.value = value === "old" ? "old" : parseInt(value)
    } else if(line.includes("Test")) {
      monkeys[monkeys.length - 1].divisible = parseInt(line.match(/\d+/g)[0])
      monkeysPart2[monkeys.length - 1].divisible = parseInt(line.match(/\d+/g)[0])
    } else if(line.includes("If true")) {
      monkeys[monkeys.length - 1].throwToIndex["true"] = parseInt(line.match(/\d+/g)[0])
      monkeysPart2[monkeys.length - 1].throwToIndex["true"] = parseInt(line.match(/\d+/g)[0])
    } else if(line.includes("If false")) {
      monkeys[monkeys.length - 1].throwToIndex["false"] = parseInt(line.match(/\d+/g)[0])
      monkeysPart2[monkeys.length - 1].throwToIndex["false"] = parseInt(line.match(/\d+/g)[0])
    }
  })

  for(const monkey of monkeysPart2) {
    limit *= monkey.divisible
  }

  // Simulate rounds
  for(let i = 0; i < 20; i++) {
    for(const monkey of monkeys) {
      let items = monkey.throwTo()
      for(let tuple of items) {
        monkeys[tuple[0]].items.push(tuple[1])
      }
    }
  }
  for(let i = 0; i < 10000; i++) {
    for(const monkey of monkeysPart2) {
      let items = monkey.throwTo()
      for(let tuple of items) {
        monkeysPart2[tuple[0]].items.push(tuple[1])
      }
    }
  }
  
  let inspections = monkeys.map(monkey => monkey.inspectionCount).sort((a, b) => b-a)
  console.log("Part 1:", inspections[0]*inspections[1])

  inspections = monkeysPart2.map(monkey => monkey.inspectionCount).sort((a, b) => b-a)
  console.log("Part 2:", inspections[0]*inspections[1])
  console.log(2713310158)
})