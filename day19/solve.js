const fs = require("fs");

fs.readFile("day19/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const t0 = performance.now()

  // 4 item arrays represents ore, clay, obsidian, geode
  const blueprints = []

  input.split("\n").filter(v => v).forEach((line) => {
    const numbers = line.match(/\d+/g).map((v) => parseInt(v))
    blueprints.push({
      id: numbers[0],
      costs: [
        [numbers[1], 0, 0, 0],
        [numbers[2], 0, 0, 0],
        [numbers[3], numbers[4], 0, 0],
        [numbers[5], 0, numbers[6], 0],
      ],
      maxCosts: [
        Math.max(numbers[1], numbers[2], numbers[3], numbers[5]),
        numbers[4],
        numbers[6],
        "priority",
      ],
    })
  })

  function search(blueprint, minutes) {
    let maxGeodes = 0
    let builds = [
      { 
        minutes: minutes, 
        resources: [0, 0, 0, 0], 
        robots: [1, 0, 0, 0], 
        order: [],
        maxRobots: [0, 0, 0],
      },
    ]
    while(builds.length > 0) {
      const build = builds.pop()
      /* Source: https://www.reddit.com/r/adventofcode/comments/zpihwi/comment/j0tls7a/
      * Idea: cut build branch if we can't to collect more geodes by building them every minute for the remaining time
      ** https://en.wikipedia.org/wiki/Triangular_number */
      if(maxGeodes > 0 && (build.resources[3] 
        + (build.robots[3] * build.minutes) 
        + ((build.minutes * (build.minutes - 1)) / 2)) <= maxGeodes) {
        continue
      }
      const nextBuilds = Array.from({ length: blueprint.costs.length }, (v, i) => i)
        .filter((goal) => {
          if(build.minutes <= 1) { return false }
          if(build.minutes === 2) { return blueprint.maxCosts[goal] === "priority"  }
          if(blueprint.maxCosts[goal] === "priority") { return true }
          // Since we build one robot a minute, we don't need to collect more resource than we can spend
          if((build.robots[goal] + 1) > blueprint.maxCosts[goal]) { return false }

          // Reduce branches that try to build previous robots again after building a new type
          if((goal >= 0 && goal <= 2) 
            && build.maxRobots[goal] > build.robots[goal]) { 
            return true
          }
          let next = build.robots.indexOf(0)
          if(next < 0) { next = build.robots.length - 1 }
          return goal >= (next - 1)
        }).map((goal) => {
          let requiredMinutes = Math.max(
            0, 
            ...blueprint.costs[goal].map((c, i) => {
              const missing = c - build.resources[i]
              return missing > 0 ? Math.ceil(missing / build.robots[i]) : 0
            })
          )
          const robots = build.robots.map((r, i) => goal === i ? (r + 1) : r)
          let maxRobots = [...build.maxRobots]
          if(build.robots.indexOf(0) === goal 
            && (goal >= 1 && goal <= 3)) {
            maxRobots[goal - 1] = Math.min(blueprint.maxCosts[goal - 1], robots[goal - 1] + 3)
          }
          requiredMinutes++
          return {
            minutes: build.minutes - requiredMinutes,
            resources: build.resources.map((r, i) => {
              return r + (requiredMinutes * build.robots[i]) - blueprint.costs[goal][i]
            }),
            robots: robots,
            maxRobots: maxRobots,
            order: [...build.order, [goal, build.minutes - requiredMinutes]]
          }
        }).filter((goalObj) => {
          return goalObj.minutes > 0
        })
      if(nextBuilds.length > 0) {
        for(const nextBuild of nextBuilds) {
          builds.push(nextBuild)
        }
      } else {
        build.resources = build.resources.map((r, i) => {
          return r + (build.minutes * build.robots[i])
        })
        build.remainingMinutes = build.minutes
        build.minutes = 0
        maxGeodes = Math.max(maxGeodes, build.resources[3])
      }
    }
    return maxGeodes
  }

  
  console.log("Part 1:", blueprints.reduce((acc, blueprint) => {
    return acc + blueprint.id * search(blueprint, 24)
  }, 0))
  const t1 = performance.now()
  console.log(`Part 1 took ${(t1 - t0) / 1000} seconds.`)
  console.log("Part 2:", blueprints.slice(0,3).reduce((acc, blueprint) => acc * search(blueprint, 32), 1))
  const t2 = performance.now()
  console.log(`Part 2 took ${(t2 - t1) / 1000} seconds.`)
})