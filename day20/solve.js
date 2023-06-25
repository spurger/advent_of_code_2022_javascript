const fs = require("fs");

fs.readFile("day20/input.txt", (err, data) => {
  if (err) throw err;

  const input = data.toString()

  let t0 = performance.now()

  let numArray = []

  input.split("\n").filter(v => v).forEach((line) => {
    numArray.push(parseInt(line.trim()))
  })

  function prepareToMix(array) {
    return array.map((v, i) => [v, i])
  }

  function mixing(array) {
    const maxIndex = array.length - 1
    for(let i = 0; i < array.length; i++) {
      let numIndex = array.findIndex(([num, index]) => index === i)
      if(array[numIndex][0] !== 0) {
        let newIndex = numIndex + array[numIndex][0]
        if(newIndex > maxIndex) {
          newIndex = newIndex % maxIndex
        } else if(newIndex < 0) {
          newIndex = maxIndex + (newIndex % maxIndex)
        }
        if(newIndex === 0) {
          newIndex = maxIndex
        } 
        array.splice(newIndex, 0, array.splice(numIndex, 1)[0])
      }
    }
    return array
  }

  function getCoordinates(mixedArray) {
    let indexOfZero = mixedArray.findIndex(([num, index]) => num === 0)
    return [
      mixedArray[(indexOfZero + 1000) % mixedArray.length],
      mixedArray[(indexOfZero + 2000) % mixedArray.length],
      mixedArray[(indexOfZero + 3000) % mixedArray.length],
    ].reduce((acc, [num, index]) => acc + num, 0)
  }
  console.log("Part 1:", getCoordinates(mixing(prepareToMix(numArray))))
  let t1 = performance.now()
  console.log(`Part 1 took ${(t1 - t0) / 1000} seconds.`)

  const decryptionKey = 811589153
  numArray = numArray.map(num => num * decryptionKey)
  let mix = prepareToMix(numArray)
  for(let i = 0; i < 10; i++) {
    mix = mixing(mix)
  }
  console.log("Part 2:", getCoordinates(mix))
  let t2 = performance.now()
  console.log(`Part 2 took ${(t2 - t1) / 1000} seconds.`)
})