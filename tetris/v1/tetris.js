// ! Functions
function moveTransformShape(rotation,index,movement) {
  cells[index].classList.remove(rotation.currentClass)

  if (movement === movements[0]) {
    currentRotation.currentIndex += width
  } else if (movement === movements[1]) {
    currentShape.currentIndex -= 1
  } else if (movement === movements[2]) {
    currentShape.currentIndex += 1
  } else if (movement === movements[3]) { // placeholder for feature 'skipDown'
    return
  } else {
    return
  }
  
  if (movement === undefined) {
    cells[index].classList.add(rotation.deadClass)
  } else {
    cells[index].classList.add(rotation.currentClass)
  }
}

function generateNewShape() {
  const randomShapeIndex = Math.floor(Math.random() * shapesArray.length)
  const currentShape = shapesArray[randomShapeIndex]
  currentRotation.currentIndex = currentRotation.startIndex
  
  currentRotation.blockIndexes.forEach( (blockIndex) => {
    cells[blockIndex].classList.add(currentShape.currentClass)
  })

  return currentShape
}

function clearLine() {

  cells.forEach( (cell,index) => {
    cell
  })
  const linesArray = cells.slice(n,width)


  for (let i = 0; i < cells.length; i += 10) {
    return Array.from(cells.slice(i,width))
  }

}


// ! DOM elements
const elements = {
  play: document.querySelector('#play'),
  grid: document.querySelector('#grid'),
}

// ! Grid Properties/elements
const width = 10
const height = 20
elements.grid.style.width = `${width * 30}px`
elements.grid.style.height = `${height * 30}px`
const cells = []

// ! Generate the grid
for (let index = 0; index < width * height; index++) {
  const div = document.createElement('div')
  elements.grid.appendChild(div)
  div.innerHTML = index
  cells.push(div)
}

// ! Shapes objects & array
// add all other shapes when testing is successful
const iShape = {
  currentClass: 'i',
  deadClass: 'dead',
  rotations: [this.rightSide,this.topSide], // default rotation goes first
  topSide: {
    startIndex: null,
    currentIndex: this.topSide.startIndex,
    blockIndexes: [this.topSide.currentIndex - 20,this.topSide.currentIndex - 10,this.topSide.currentIndex,this.topSide.currentIndex + 10],
  },
  rightSide: {
    startIndex: 4,
    currentIndex: this.rightSide.startIndex,
    blockIndexes: [this.rightSide.currentIndex + 2,this.rightSide.currentIndex + 1,this.rightSide.currentIndex,this.rightSide.currentIndex - 1],
  },
}

const shapesArray = [iShape]

// ! Other variables declaration
const movements = ['down','left','right','skipDown']

let intervalID

let isRunning

let currentShape
let currentRotation
let currentRotationIndex = 0 // ! 0 is the default shape rotation to drop new shapes with

elements.play.addEventListener('click', () => {

  // ! Prevent intervalIDs to loop on themsleves
  if (intervalID !== 0) {
    return
  }

  // ! Clear all classes (blocks) from divs (cells) = restart the game
  // maybe use this.className = null
  cells.forEach( (cell) => {
    cell.removeAttribute('class')
  })

  isRunning = true

  while (isRunning) {

    currentShape = generateNewShape()
    currentRotation = currentShape.rotations[currentRotationIndex]
    
    // Only add the below if it didn't work in the function generateNewShape()
    // currentRotation.blockIndexes.forEach( (blockIndex) => {
    //   cells[blockIndex].classList.add(currentShape.currentClass)
    // })

    intervalID = setInterval(
      currentRotation.blockIndexes.forEach( (blockIndex) => {

        // ! If (the next line is not out of range) && (the next line doesn't contain a dead shape)
        if ( ( (blockIndex + width) <= (((height * width) - width) + (blockIndex % width)) ) && (cells[blockIndex + width].classList !== 'dead') ) {
          moveTransformShape(currentRotation,blockIndex,movements[0])
        // ! If (the next line is out of range) || (the next line contains a dead shape)
        } else if ( ( (blockIndex + width) > (((height * width) - width) + (blockIndex % width)) ) || (cells[blockIndex + width].classList === 'dead') ) {
          moveTransformShape(currentRotation,blockIndex)
        }
      }),800)


    document.addEventListener('keydown', (event) => {

      currentRotation.forEach( (blockIndex) => {

        // ? Here, would it be better to keep all ifs in series of else ifs or better to keep each separated?
        // ! If (upArrow key is pressed) && (the end of the shape.rotations array is reached) {go back to the start of this array}
        if ( (event.key === 'ArrowUp') && (currentRotationIndex === (currentRotation.length - 1)) ) {
          currentRotation = currentShape.rotations[currentRotationIndex = 0]
        } else {
          currentRotation = currentShape.rotations[currentRotationIndex++]
        }

        // ! If (downArrow key is pressed) && (the shape blocks are not on the last line) {drop the shape down}
        if ( (event.key === 'ArrowDown') && !(blockIndex >= (width * height) - width) ) {
          moveTransformShape(currentRotation,blockIndex,movements[0])
        }

        // ! If (leftArrow key is pressed) && (the shape blocks are not on the left edge) {move the shape left}
        if ( (event.key === 'ArrowLeft') && !(blockIndex % width === 0) ) {
          moveTransformShape(currentRotation,blockIndex,movements[1])
        }

        // ! If (rightArrow key is pressed) && (the shape blocks are not on the right edge) {move the shape right}
        if ( (event.key === 'ArrowRight') && !(blockIndex % width === width - 1) ) {
          moveTransformShape(currentRotation,blockIndex,movements[2])
        }

      })

    })

  }














})
