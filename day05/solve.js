const fs = require("fs");

class CargoCrates {
  constructor(crateMover) {
    // First item is the bottom item
    this.rows = []
    // Input rows that need to be parsed to init rows
    this.createRowsFrom = []
    // 9000 or 9001
    this.crateMover = crateMover
  }

  createRows() {
    const crateNumbers = this.createRowsFrom[0].match(/[0-9]/g)
    crateNumbers.forEach((num, index) => {
      const items = []
      this.createRowsFrom.slice(1).forEach(line => {
        const item = line[(index * 4) + 1]
        if(item !== " ") {
          items.push(item)
        }
      })
      this.rows.push(items)
    })
  }

  execute(command) {
    const args = command.split(' ')
    const move = parseInt(args[1])
    const from = parseInt(args[3]) - 1
    const to = parseInt(args[5]) - 1
    const moving = this.rows[from].splice(this.rows[from].length - move)
    if(this.crateMover === 9000) {
      this.rows[to].push(...moving.reverse())
    } else if(this.crateMover === 9001) {
      this.rows[to].push(...moving)
    }
  }

  getTopCrates() {
    return this.rows.map(row => row[row.length - 1]).join('')
  }
}

fs.readFile("day05/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()
  let endOfCrateInput = false
  const cargoCrates9000 = new CargoCrates(9000)
  const cargoCrates9001 = new CargoCrates(9001)
  input.split("\n").forEach((line) => {
    if(!line) {
      return
    }
    if(line === "\r") {
      endOfCrateInput = true
      cargoCrates9000.createRows()
      cargoCrates9001.createRows()
      return
    }
    /* Commands */
    if(endOfCrateInput) {
      cargoCrates9000.execute(line)
      cargoCrates9001.execute(line)
    } /* Crates */ else {
      cargoCrates9000.createRowsFrom.unshift(line)
      cargoCrates9001.createRowsFrom.unshift(line)
    }
  })
  console.log("Part 1:", cargoCrates9000.getTopCrates())
  console.log("Part 2:", cargoCrates9001.getTopCrates())
})