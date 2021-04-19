// ? I tried including the setInterval inside a while loop, but it ran some code infintely. I thought that the while loop wouldn't loop until the setInterval ...
// ? 

// ? some functions need global variables to work so I've put the variables on top of the script document (instead of functions being there first). Is this a problem?
// ? I know functions are supposed to be on top of the script document. But what if you are modifying global variables with this function? Is it ok to have variables first and functions second? or should I call variables in as an argument instead?

// ! Other variables declaration
const movements = ['down','left','right','skipDown']

let dropNewShape = true
let intervalID = 0

let currentShape = {}
let currentRotation = []
let currentRotationIndex = 0 // ! 0 is the default shape rotation to drop new shapes in the game
let isFirstLine = true

// ? is it bad practice to update global variables in a function? would you rather pass the variable as an argument inside the function and re-assigne with the returned values? what would you do?
// ! Global functions
function collisionCheck(movement) {
  return currentRotation.some( (cellIndex) => {
    if (movement === movements[0]) {
      switch (true) {
        case cells[cellIndex + width]: return cells[cellIndex + width].classList.contains('dead') || !(cellIndex < (width * height) - width)
        default: return !(cellIndex < (width * height) - width)
      }
    } else if (movement === movements[1]){
      return (cellIndex % width === 0)
    } else if (movement === movements[2]) {
      return (cellIndex % width === width - 1)
    }
  })
}

function moveRotateShape(movement,isFirstLine) {

  console.log('moveRotateShape() / movement is: ' + movement)

  if (!movement) {
    console.log('changing class to DEAD')
    currentRotation.forEach( (cellIndex) => {
      cells[cellIndex].removeAttribute('class')
      cells[cellIndex].classList.add(currentShape.deadClass)
    })
  } else {
    // ! Check that movement is part of the list to direct flow towards the right conditional statements
    const isMovement = movements.some( (element) => {
      return movements.includes(element)
    })
  
    if (isMovement && !isFirstLine) {
      console.log('moveRotateShape() / !isFirstLine')
  
      currentRotation.forEach( (cellIndex) => {
        cells[cellIndex].removeAttribute('class')
      })
    
      // ? In this case, is it wise to update a global variable (as opposed to entering this global variable into the function as an argument and returning it to have its value re-assigned to the variable in question)?
      // ! Update currentShape.currentReferenceIndex global variable
      if (movement === movements[0]) {
        console.log('moveRotateShape() / going down')
        currentShape.currentReferenceIndex += width
      } else if (movement === movements[1]) {
        console.log('moveRotateShape() / going left')
        currentShape.currentReferenceIndex -= 1
      } else if (movement === movements[2]) {
        console.log('moveRotateShape() / going right')
        currentShape.currentReferenceIndex += 1
      } else if (movement === movements[3]) { // placeholder for feature 'skipDown'
        return
      } else {
        return
      }
    }

    currentRotation = currentShape.rotationsArray(currentRotationIndex)
  
    console.log('currentRotation is: ' + currentRotation)
  
    currentRotation.forEach( (cellIndex) => {
      cells[cellIndex].classList.add(currentShape.currentClass)
    })
  }
}

function generateNewShape(currentRotationIndex) {
  const randomShapeIndex = Math.floor(Math.random() * shapesArray.length)
  const currentShape = shapesArray[randomShapeIndex]

  currentShape.currentReferenceIndex = currentShape.startIndex

  currentRotation = currentShape.rotationsArray(currentRotationIndex)
  console.log('currentRotation is: ' + currentRotation)

  currentRotation.forEach( (blockIndex) => {
    cells[blockIndex].classList.add(currentShape.currentClass)
  })

  return currentShape
}

// ! Checks for sideway/bottom/dead shapes collisions
function dropCheck(movement) {

  // ! Return true if there is a collision
  const isCollision = currentRotation.some( (cellIndex) => {
    
    if (movement === movements[0]) {
      switch (true) {
        case cells[cellIndex + width]: return cells[cellIndex + width].classList.contains('dead') || !( (cellIndex + width) <= (width * height) )
        default: return !(cellIndex < (width * height) - width)
      }
    } else if (movement === movements[1]) {
      return (cellIndex % width === 0)
    } else if (movement === movements[2]) {
      return (cellIndex % width === width - 1)
    }
  })



  // const collision1 = currentRotation.some( (cellIndex) => {
  //   if (movement === movements[0]) {
  //     switch (true) {
  //       case cells[cellIndex + width]: return cells[cellIndex + width].classList.contains('dead') || !(cellIndex < (width * height) - width)
  //       default: return !(cellIndex < (width * height) - width)
  //     }
  //   } else if (movement === movements[1]){
  //     return (cellIndex % width === 0)
  //   } else if (movement === movements[2]) {
  //     return (cellIndex % width === width - 1)
  //   }
  // })



  const dropCheck = currentRotation.map( (blockIndex) => {

    // ! If (the next line is not out of range) && (the next line doesn't contain a dead shape) {true = drop it width down}
    if ( (blockIndex + width) < (height * width) && !(cells[blockIndex + width].classList.contains('dead')) ) {
      return true
    // ! If (the next line is out of range) || (the next line contains a dead shape) {false = mark shape class as dead}
    } else if ( ( (blockIndex + width) >= (height * width) ) || (cells[blockIndex + width].classList.contains('dead')) ) {
      return false
    }
  })

  const dropCheckConsolidate = dropCheck.every( (boolean) => {
    return boolean === true
  })
  
  console.log(`dropCheckConsolidate is: ${dropCheckConsolidate}`)

  if (dropCheckConsolidate && isFirstLine) {
    moveRotateShape(movements[0],isFirstLine)
    isFirstLine = false
  } else if (dropCheckConsolidate && !isFirstLine) {
    moveRotateShape(movements[0])
  } else if (!dropCheckConsolidate) {
    moveRotateShape(false)
    currentShape.currentReferenceIndex = null
    dropNewShape = true
  }
}

function rowCheckToClear() {

  // ! Check lines from bottom to top
  for (let i = (width * height) ; i >= 10; i -= 10) {
    const rowArray = cells.slice(i - width, i)
    console.log(`slicing from ${i - width} to ${i}`)
    const allDead = rowArray.every( (cell) => {
      return cell.classList.contains('dead')
    })

    console.log(rowArray)
    console.log(allDead)

    if (allDead) {
      rowArray.forEach( (cell) => {
        cell.removeAttribute('class')
        // or rowArray.className = null
      })

      // ! shift all blocks above with class dead to += width
      const deadCellsToShiftDown = cells.filter( (cell,index) => {
        if (cell.classList.contains('dead')) {
          return index
        }
      })

      deadCellsToShiftDown.forEach( (cellIndex) => {
        console.log(cellIndex)
        cellIndex += width
        console.log(cellIndex)
        cells[cellIndex].classList.add('dead')
      })
    }    
  
  // When dead shapes have different styles
  // shapesArray.forEach( (shape) => {
  //   shape.currentClass
  // })
  }
}

function topRowCollisionCheck() {
  return currentRotation.some( (cellIndex) => {
    return cells[cellIndex].classList.contains('dead')
  })
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
// replace blockIndexes by rightSide
const iShape = {
  startIndex: 4,
  currentReferenceIndex: null,
  currentClass: 'i',
  deadClass: 'dead',
  rightSide() {
    return [this.currentReferenceIndex + 2,this.currentReferenceIndex + 1,this.currentReferenceIndex,this.currentReferenceIndex - 1]
  },
  topSide() {
    return [this.currentReferenceIndex - 20,this.currentReferenceIndex - 10,this.currentReferenceIndex,this.currentReferenceIndex + 10]
  },
  rotationsArray(arrayIndex) {
    const rotationsArray = [this.rightSide(),this.topSide()] // ! default rotation goes first
    return rotationsArray[arrayIndex]
  },
}

const shapesArray = [iShape]

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
  
  // Only add the below if it didn't work in the function generateNewShape()
  // currentRotation.blockIndexes.forEach( (blockIndex) => {
  //   cells[blockIndex].classList.add(currentShape.currentClass)
  // })

  intervalID = setInterval( () => {

    // ? Why does VScode want me to stick a comma at the end of the currentShape declaration?
    // ! Define our variables of the shape currently dropping
    
    console.log('_________start_________')

    // enter top row collision stuff here
    if (dropNewShape) {

      currentShape = generateNewShape(currentRotationIndex)
      const isCollision = topRowCollisionCheck()

      if (isCollision) {
        alert('Game is over, you lost!')
        clearInterval(intervalID)
        return // test if return is needed
      } else {
        isFirstLine = true
        dropNewShape = false
      }
    }


    const dropCheck = currentRotation.map( (blockIndex) => {

      // ! If (the next line is not out of range) && (the next line doesn't contain a dead shape) {true = drop it width down}
      if ( (blockIndex + width) < (height * width) && !(cells[blockIndex + width].classList.contains('dead')) ) {
        return true
      // ! If (the next line is out of range) || (the next line contains a dead shape) {false = mark shape class as dead}
      } else if ( ( (blockIndex + width) >= (height * width) ) || (cells[blockIndex + width].classList.contains('dead')) ) {
        return false
      }
    })

    const dropCheckConsolidate = dropCheck.every( (boolean) => {
      return boolean === true
    })
    
    console.log(`dropCheckConsolidate is: ${dropCheckConsolidate}`)

    if (dropCheckConsolidate && isFirstLine) {
      moveRotateShape(movements[0],isFirstLine)
      isFirstLine = false
    } else if (dropCheckConsolidate && !isFirstLine) {
      moveRotateShape(movements[0])
    } else if (!dropCheckConsolidate) {
      moveRotateShape(false)
      currentShape.currentReferenceIndex = null
      dropNewShape = true
    }

    // rowCheckToClear()

  },1000)
















  document.addEventListener('keydown', (event) => {

    console.log('keydown activated, currentRotation is: ' + currentRotation)
    
    console.log(collisionCheck(movements[0]))
    console.log(collisionCheck(movements[1]))
    console.log(collisionCheck(movements[2]))

    // ? Here, would it be better to keep all ifs in series of else ifs or better to keep each separated?
    // ! If (upArrow key is pressed) && (the end of the shape.rotation() array is reached) {go back to the start of this array}
    if ( (event.key === 'ArrowUp') && (currentRotationIndex === (currentRotation.length - 1)) ) {
      currentRotationIndex = 0
      currentRotation = currentShape.rotationsArray(currentRotationIndex)
    } else if (event.key === 'ArrowUp') {
      currentRotationIndex++
      currentRotation = currentShape.rotationsArray(currentRotationIndex)
    }

    // ! If (downArrow key is pressed) && (the shape blocks are not on the last line) {drop the shape down}
    if (event.key === 'ArrowDown' && !collisionCheck(movements[0])) {
      console.log('arrow down')
      moveRotateShape(movements[0])
    }

    // ! If (leftArrow key is pressed) && (the shape blocks are not on the left edge) {move the shape left}
    if (event.key === 'ArrowLeft' && !collisionCheck(movements[1])) {
      console.log('arrow left')
      moveRotateShape(movements[1])
    }

    // ! If (rightArrow key is pressed) && (the shape blocks are not on the right edge) {move the shape right}
    if (event.key === 'ArrowRight' && !collisionCheck(movements[2])) {
      console.log('arrow right')
      moveRotateShape(movements[2])
    }

  })














})
