const fs = require("fs");

class ElfDeviceSystem {
  constructor() {
    this.path = []
    this.files = {}
  }

  getDirectory(path) {
    let current = this.files
    for(let i = 1; i < path.length; i++) {
      current = current[path[i]]
    }
    return current
  }

  cd(path) {
    if(path === "..") {
      if(this.path.length > 0) {
        this.path = this.path.slice(0, -1)
      }
    } else if(path === "/") {
      this.path = ["/"]
    } else {
      this.path.push(path)
    }
  }

  addFile(size, name) {
    const currentDirectory = this.getDirectory(this.path)
    currentDirectory[name] = parseInt(size)
  }

  addDirectory(name) {
    const currentDirectory = this.getDirectory(this.path)
    currentDirectory[name] = {}
  }

  execute(line) {
    let command = line.split(" ").map(v => v.trim())
    if(command[0] === "$") {
      if(command[1] === "cd") {
        this.cd(command[2])
      }
    } else {
      if(command[0] === "dir") {
        this.addDirectory(command[1])
      } else {
        this.addFile(command[0], command[1])
      }
    }
  }

  getDirectorySize(path = ["/"]) {
    const currentDirectory = this.getDirectory(path)
    let size = 0
    Object.keys(currentDirectory).forEach((name) => {
      if(typeof currentDirectory[name] === "object") {
        size += this.getDirectorySize([...path, name])
      } else {
        size += currentDirectory[name]
      }
    })
    return size
  }

  getDirectoryPaths(path = ["/"]) {
    const currentDirectory = this.getDirectory(path)
    const paths = []
    Object.keys(currentDirectory).forEach((name) => {
      if(typeof currentDirectory[name] === "object") {
        paths.push([...path, name])
        const innerPaths = this.getDirectoryPaths([...path, name])
        if(innerPaths.length > 0) {
          paths.push(...innerPaths)
        }
      }
    })
    return paths
  }
}

fs.readFile("day07/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  const fileSystem = new ElfDeviceSystem()

  input.split("\n").filter(v => v).forEach((line) => {
    fileSystem.execute(line)
  })
  const paths = fileSystem.getDirectoryPaths(["/"]).map((path) => {
    return { path, size: fileSystem.getDirectorySize(path) }
  }).filter(({ size }) => size < 100000)
  console.log("Part 1:", paths.reduce((acc, current) => acc += current.size, 0))

  const totalSpace = 70000000
  const requiredFreeSpace = 30000000
  const unusedSpace = totalSpace - fileSystem.getDirectorySize()
  const deleteAboveThis = requiredFreeSpace - unusedSpace
  const deletable = fileSystem.getDirectoryPaths(["/"])
    .map((path) => fileSystem.getDirectorySize(path))
    .filter((size) => size > deleteAboveThis)
    .sort((a, b) => a - b)
  console.log("Part 2:", deletable[0])

  // Other solution that focuses only what needed

  let path = []
  let sizes = []
  input.split("\n").filter(v => v).forEach((line) => {
    const command = line.split(" ").map(v => v.trim())
    if(command[0] === "$") {
      if(command[1] === "cd") {
        if(command[2] === "..") {
          path = path.slice(0, -1)
        } else if(command[2] === "/") {
          path = [...path, "root"]
        } else {
          path = [...path, command[2]]
        }
      }
    } else {
      if(command[0] !== "dir") {
        sizes.push({ path, size: parseInt(command[0]) })
      } else {
        sizes.push({ path, size: 0 })
      }
    }
  })
  const reduced = sizes.reduce((res, curr) => {
    const path = curr.path.join('/')
    if(!res[path]) { 
      res[path] = curr.size 
    } else {
      res[path] += curr.size
    }
    Object.keys(res).forEach(key => {
      if(path !== key && path.match(key)) {
        res[key] += curr.size
      }
    })
    return res
  }, {})
  const sum = Object.values(reduced).filter(v => v < 100000).reduce((acc, curr) => acc += curr, 0)

  const requiredSpace = 30000000 - ( 70000000 - reduced["root"])
  const deletedDirectorySpace = Object.values(reduced)
    .filter(v => v > requiredSpace)
    .sort((a, b) => a - b)

  console.log("Part 1:", sum)
  console.log("Part 2:", deletedDirectorySpace[0])
})