// Note: running can take a minute

const fs = require("fs");

fs.readFile("day16/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const valves = new Map()

  input.split("\n").filter(v => v).forEach((line) => {
    const _valves = line.match(/[A-Z]{2}/g)
    const valve = _valves.shift()
    const rate = parseInt(line.match(/rate=\d+/g)[0].split("=")[1])
    valves.set(valve, { connected: _valves, rate: rate })
  })

  function toMap(name1, name2) {
    return [name1, name2].join("->")
  }

  let t0 = performance.now()

  const routeCosts = new Map()
  for(let current of valves.keys()) {
    for(let target of valves.keys()) {
      if(current === target) {
        routeCosts.set(toMap(current, target), 0)
      } else {
        let queue = [current]
        let visited = new Map([[current, 0]])
        while(queue.length > 0) {
          let queuedValve = queue.shift()
          let steps = visited.get(queuedValve)
          for(const connectedValve of valves.get(queuedValve).connected) {
            if(!visited.has(connectedValve)) {
              visited.set(connectedValve, steps + 1)
              queue.push(connectedValve)
            } else {
              visited.set(connectedValve, Math.min(visited.get(connectedValve), steps + 1))
            }
          }
        }
        if(visited.has(target)) {
          routeCosts.set(toMap(current, target), visited.get(target))
        }
      }
    }
  }

  for (let k of valves.keys()) {
    if (valves.get(k).rate === 0) {
      valves.delete(k)
    }
  }

  function getNextValves(currentValve) {
    let nextValves = []
    let possibleValves = Array.from(valves, ([name, value]) => ({ name, value }))
      .filter(v => {
        return !currentValve.path.includes(v.name)
      });
    possibleValves.forEach((v) => {
      const minutes = currentValve.minutes - routeCosts.get(toMap(currentValve.name, v.name)) - 1
      if(minutes >= 0) {
        nextValves.push({
          name: v.name,
          path: [...currentValve.path, v.name],
          minutes: minutes,
          pressure: currentValve.pressure + (v.value.rate * minutes)
        })
      }
    })

    return nextValves
  }

  function runQueue(minutes) {
    let queue = [
      { name: "AA", path: [], minutes, pressure: 0 },
    ]
    let _paths = []
    while(queue.length > 0) {
      const currentValve = queue.shift()
      const nextValves = getNextValves(currentValve)
      for(const next of nextValves) {
        _paths.push(next)
        queue.push(next)
      }
    }
    _paths.sort((p1, p2) => p2.pressure - p1.pressure)
    return _paths
  }

  let paths = runQueue(30)
  console.log("Part 1:", paths[0].pressure, paths.length)
  let t1 = performance.now()
  console.log(`Part 1 took ${(t1 - t0) / 1000.0} seconds.`)

  paths = runQueue(26)
  let pairs = []
  for(let i = 0; i < paths.length; i++) {
    for(let j = i + 1; j < paths.length; j++) {
      if(i !== j) {
        const isDifferent = paths[i].path.every((p) => {
          return !paths[j].path.includes(p)
        })
        if(isDifferent) {
          pairs.push([paths[i], paths[j]])
          break
        }
      }
    }
  }

  pairs.sort((p1, p2) => {
    return (p2[0].pressure + p2[1].pressure) - (p1[0].pressure + p1[1].pressure)
  })

  console.log("Part 2:", pairs[0][0].pressure + pairs[0][1].pressure)
  let t2 = performance.now()
  console.log(`Part 2 took ${(t2 - t1) / 1000.0} seconds.`)
})