// ? I tried including the setInterval inside a while loop, but it ran some code infintely. I thought that the while loop wouldn't loop until the setInterval ...
// ? 

// ? some functions need global variables to work so I've put the variables on top of the script document (instead of functions being there first). Is this a problem?
// ? I know functions are supposed to be on top of the script document. But what if you are modifying global variables with this function? Is it ok to have variables first and functions second? or should I call variables in as an argument instead?

// ! Other variables declaration
const movements = ['down','left','right','skipDown']
const rotationSideArray = ['topSide','bottomSide','rightSide','leftSide']

let dropNewShape = true
let intervalID = 0

let currentShape = {}
let currentRotation = []
// let currentRotationIndex = 0 // ! 0 is the default shape rotation to drop new shapes in the game // now as property in an object
let isFirstLine = true

// ! Used to prevent bugs (where class stays at currentClass instead of dead) when rotating/keydown close to dead shapes 
let isDropCheck = false


// ? is it bad practice to update global variables in a function? would you rather pass the variable as an argument inside the function and re-assigne with the returned values? what would you do?
// ! Global functions
function removeCurrentClass() {
  return currentRotation.forEach( (cellIndex) => {
    cells[cellIndex].removeAttribute('class')
  })
}

function moveShape(movementType,isRotation = false) {

  console.log('moveShape() / movementType is: ' + movementType)
  console.log('moveShape() / rotation is: ' + isRotation)

  // ! remove previous class
  currentRotation.forEach( (cellIndex) => {
    cells[cellIndex].removeAttribute('class')
    if (!movementType) {
      cells[cellIndex].classList.add(currentShape.deadClass)
      currentShape.currentRotationIndex = 0
    }
  })

  // ! Check that movementType is part of the list to direct flow towards the right conditional statements
  if (movements.includes(movementType) || isRotation) {
    // ? In this case, is it wise to update a global variable (as opposed to entering this global variable into the function as an argument and returning it to have its value re-assigned to the variable in question)?
    // ! Update currentShape.currentReferenceIndex global variable
    if (movementType === movements[0]) {
      console.log('moveShape() / going DOWN')
      currentShape.currentReferenceIndex += width
    } else if (movementType === movements[1]) {
      console.log('moveShape() / going LEFT')
      currentShape.currentReferenceIndex -= 1
    } else if (movementType === movements[2]) {
      console.log('moveShape() / going RIGHT')
      currentShape.currentReferenceIndex += 1
    } else if (movementType === movements[3]) { // placeholder for feature 'skipDown'
      return
    } else {
      return
    }

    currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)

    console.log('currentRotation is: ' + currentRotation)
  
    currentRotation.forEach( (cellIndex) => {
      cells[cellIndex].classList.add(currentShape.currentClass)
    })
  }
}

function generateNewShape() {
  const randomShapeIndex = Math.floor(Math.random() * shapesArray.length)
  const currentShape = shapesArray[randomShapeIndex]

  currentShape.currentReferenceIndex = currentShape.startIndex

  currentShape.currentRotationIndex = 0
  currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)

  currentRotation.forEach( (blockIndex) => {
    cells[blockIndex].classList.add(currentShape.currentClass)
  })

  return currentShape
}

// ! Checks for sideway/bottom/dead shapes collisions
function dropCheck(movementType) {

  let isDownwardCollision = false
  let isSidewayCollision = false

  // ! 2 movementtype of collisions. Return true if there is a collision for each movementtype
  if (movementType === movements[0]) {
    isDownwardCollision = currentRotation.some( (cellIndex) => {
      if ( (cellIndex + width) < (height * width) ) {
        return cells[cellIndex + width].classList.contains('dead') || !( (cellIndex + width) < (width * height) )
      } else {
        return !( (cellIndex + width) < (width * height) )
      }
    })
  } else {
    isSidewayCollision = currentRotation.some( (cellIndex) => {
      switch (true) {
        case movementType === movements[1]: return (cellIndex % width === 0) || cells[cellIndex - 1].classList.contains('dead')
        case movementType === movements[2]: return (cellIndex % width === width - 1) || cells[cellIndex + 1].classList.contains('dead')
      }
    })
  }

  if (!isDownwardCollision && !isSidewayCollision) {
    moveShape(movementType,isFirstLine)
  } else if (isDownwardCollision) {
    moveShape(false)
    currentShape.currentReferenceIndex = null
    dropNewShape = true
  }
}

function isTopCollision(rotation) {
  return rotation.some( (cellIndex) => {
    return (cellIndex < 0)
  })
}

function isBottomCollision(rotation) {
  return rotation.some( (cellIndex) => {
    return (cellIndex >= width * height)
  })
}

function isCollisionDeadShape(rotation) {
  return rotation.some( (cellIndex) => {
    return cells[cellIndex].classList.contains('dead')
  })
}

function isSidesCollision(shape = currentShape,referenceIndex = false) {
  if (shape && !referenceIndex &&
    ( (shape.currentReferenceIndex % width < shape.leftBoundaryReferenceRemainder) ||
    (shape.currentReferenceIndex % width < shape.rightBoundaryReferenceRemainder) ) ) {
    return true
  } else if ( (referenceIndex % width < shape.leftBoundaryReferenceRemainder) ||
  (referenceIndex % width < shape.rightBoundaryReferenceRemainder) ) {
    return true
  }
}

function evaluateConditions(array) {
  const booleanArray = []
  array.forEach( (element) => {
    if (element) {
      booleanArray.push(element)
    }
  })
  if (booleanArray.length === 1) {
    return true
  } else {
    return false
  }
}

function rotationBoundaryCheck() {

  // ! define the next rotation variables to make collision checks
  let predictiveRotationIndex // outputs which rotation
  let predictiveRotation // outputs the chosen rotation index
  let predictiveReferenceIndex
  let collisionErrors = 0
  let predictionCorrectionCount = 0

  if (currentShape.currentRotationIndex >= (currentShape.allRotations(currentShape.currentReferenceIndex).length - 1)) {
    predictiveRotationIndex = 0
  } else {
    predictiveRotationIndex = currentShape.currentRotationIndex + 1
  }

  predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)

  // ! separate variables for different collision detections, which will be treated differently
  const isTopCollision = isTopCollision(predictiveRotation)

  const isBottomCollision = isBottomCollision(predictiveRotation)

  const isCollisionDeadShape = isCollisionDeadShape(predictiveRotation)

  const isSidesCollision = isSidesCollision(currentShape)

  // ! if no more than one of the conditions below is true, treat accordingly
  if (evaluateConditions(isTopCollision,isBottomCollision,isCollisionDeadShape,isSidesCollision)){
    
    removeCurrentClass()
    
    if (isTopCollision) {
      currentShape.currentReferenceIndex = (currentShape.currentReferenceIndex % width) + (currentShape.topBoundaryReferenceHeight)
    } else if (isBottomCollision) {
      currentShape.currentReferenceIndex -= currentShape.bottomBoundaryReferenceHeight
    // ! we need to filter out which block(s) of the predictive rotation is in collision with another dead shape.
    // !if the new rotation is horizontal (top or bottom side), the collision is either above or below.
    // ! on the opposite, it will be a sideway collision.
    } else if (isCollisionDeadShape) {

      const switchToSide = currentShape.getCurrentSide(predictiveRotationIndex)      

      let isCollision = true
      
      // ! entering a while loop to calculate how much a shape has to shift
      while (isCollision) {

        // ! for each cells of the predictive shape which is in collision with a dead shape
        predictiveRotation.forEach( (cellIndex) => {
          if (cells[cellIndex].classList.contains('dead')) {

            // ! if making a vertical shape rotation
            if ( (switchToSide === rotationSideArray[0]) || (switchToSide === rotationSideArray[1]) ) {

              // ! shift down width steps (collision above)
              if (cellIndex < currentShape.currentReferenceIndex) {
                predictiveReferenceIndex = currentShape.currentReferenceIndex + width
              }
              
              // ! shift up width steps (collision below)
              if (cellIndex > currentShape.currentReferenceIndex) {
                predictiveReferenceIndex = currentShape.currentReferenceIndex - width
              }

              predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)
              if (isBottomCollision(predictiveRotation) || isTopCollision(predictiveRotation)) {
                collisionErrors++
              }

              if (isCollisionDeadShape(predictiveRotation)) {
                predictionCorrectionCount++
              }

            // ! if making a horizontal shape rotation
            }  else if ( (switchToSide === rotationSideArray[2]) || (switchToSide === rotationSideArray[3]) ) {

              // ! shift right 1 steps (collision left)
              if (cellIndex < currentShape.currentReferenceIndex) {
                predictiveReferenceIndex = currentShape.currentReferenceIndex + 1
              }

              // ! shift right 1 steps (collision left)
              if (cellIndex > currentShape.currentReferenceIndex) {
                predictiveReferenceIndex = currentShape.currentReferenceIndex - 1
              }

              predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)
              if (isSidesCollision(currentShape,predictiveReferenceIndex)) {
                collisionErrors++
              }
              
              if (isCollisionDeadShape(predictiveRotation)) {
                predictionCorrectionCount++
              }
            }
          }
        })

        if (collisionErrors > 0 || predictionCorrectionCount > 2) {
          isCollision = false
          return
        }
        // ! check if there are still collisions
        const remainingCollisions = predictiveRotation.filter( (cellIndex) => {
          return cells[cellIndex].classList.contains('dead')
        })

        // ! if collisions remain, keep in the while loop and carry on
        if (remainingCollisions.length <= 0) {
          isCollision = false
        }
      }
      
    } else if (isSidesCollision) {

      const leftSideRedTape = []
      const rightSideRedTape = []
      
      for (let i = 0; i < height * width; i += 10) {
        const leftRedTapeSlices = cells.slice(i,i + currentShape.leftBoundaryReferenceRemainder)
        const rightRedTapeSlices = cells.slice( (i + 1) + currentShape.rightBoundaryReferenceRemainder, i + width)
        leftSideRedTape.push(leftRedTapeSlices)
        rightSideRedTape.push(rightRedTapeSlices)
      }

      if (leftSideRedTape.includes(currentShape.currentReferenceIndex)) {
        currentShape.currentReferenceIndex += ( currentShape.leftBoundaryReferenceRemainder - (currentShape.currentReferenceIndex % width) )
      } else if (rightSideRedTape.includes(currentShape.currentReferenceIndex)) {
        currentShape.currentReferenceIndex -= ( width - (currentShape.currentReferenceIndex % width) )
      }
    }

    currentRotation = currentShape.rotationsArray(predictiveRotationIndex)

    currentRotation.forEach( (cellIndex) => {
      cells[cellIndex].classList.add(currentShape.currentClass)
    })
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
// rightSide to topSide
// topSide to leftSide
// leftSide to bottomSide
// bottomSide to rightSide

const iShape = {
  startIndex: 4,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  currentClass: 'i',
  deadClass: 'dead',
  leftBoundaryReferenceRemainder: 2,
  rightBoundaryReferenceRemainder: 8,
  topBoundaryReferenceHeight: width * 2,
  bottomBoundaryReferenceHeight: width * 1,
  rightSide(referenceIndex) {
    return [referenceIndex + 2,referenceIndex + 1,referenceIndex,referenceIndex - 1]
  },
  topSide(referenceIndex) {
    return [referenceIndex - 20,referenceIndex - 10,referenceIndex,referenceIndex + 10]
  },
  allRotations(referenceIndex) {
    return [this.rightSide(referenceIndex),this.topSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
    if (rotationArrayIndex === 0) {
      return 'rightSide'
    } else if (rotationArrayIndex === 1) {
      return 'topSide'
    }
  },
  predictiveRotationCoordinates(referenceIndex = this.currentReferenceIndex,rotationIndex = this.currentRotationIndex) {
    return this.allRotations(referenceIndex)[rotationIndex]
  },
}

const oShape = {
  startIndex: 14,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  currentClass: 'o',
  deadClass: 'dead',
  leftBoundaryReferenceRemainder: 1,
  rightBoundaryReferenceRemainder: 8,
  topBoundaryReferenceHeight: width * 1,
  bottomBoundaryReferenceHeight: 0,
  rightSide(referenceIndex) {
    return [referenceIndex - 10,referenceIndex - 9,referenceIndex,referenceIndex + 1]
  },
  allRotations(referenceIndex) {
    return [this.rightSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
    if (rotationArrayIndex === 0) {
      return 'rightSide'
    }
  },
  predictiveRotationCoordinates(referenceIndex = this.currentReferenceIndex,rotationIndex = this.currentRotationIndex) {
    return this.allRotations(referenceIndex)[rotationIndex]
  },
}

const tShape = {
  startIndex: 14,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  currentClass: 't',
  deadClass: 'dead',
  leftBoundaryReferenceRemainder: 1,
  rightBoundaryReferenceRemainder: 8,
  topBoundaryReferenceHeight: width * 1,
  bottomBoundaryReferenceHeight: width * 1,
  rightSide(referenceIndex) {
    return [referenceIndex,referenceIndex - 10,referenceIndex + 1,referenceIndex + 10]
  },
  topSide(referenceIndex) {
    return [referenceIndex,referenceIndex - 1,referenceIndex - 10,referenceIndex + 1]
  },
  leftSide(referenceIndex) {
    return [referenceIndex,referenceIndex - 10,referenceIndex - 1,referenceIndex + 10]
  },
  bottomSide(referenceIndex) {
    return [referenceIndex,referenceIndex - 1,referenceIndex + 10,referenceIndex + 1]
  },
  allRotations(referenceIndex) {
    return [this.topSide(referenceIndex),this.rightSide(referenceIndex),this.bottomSide(referenceIndex),this.leftSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
    if (rotationArrayIndex === 0) {
      return 'topSide'
    } else if (rotationArrayIndex === 1) {
      return 'rightSide'
    } else if (rotationArrayIndex === 2) {
      return 'bottomSide'
    } else if (rotationArrayIndex === 3) {
      return 'leftSide'
    }
  },
  predictiveRotationCoordinates(referenceIndex = this.currentReferenceIndex,rotationIndex = this.currentRotationIndex) {
    return this.allRotations(referenceIndex)[rotationIndex]
  },
}

const jShape = {
  startIndex: 14,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  currentClass: 'j',
  deadClass: 'dead',
  leftBoundaryReferenceRemainder: 2,
  rightBoundaryReferenceRemainder: 7,
  topBoundaryReferenceHeight: width * 2,
  bottomBoundaryReferenceHeight: width * 2,
  rightSide(referenceIndex) {
    return [referenceIndex - 10,referenceIndex,referenceIndex + 1,referenceIndex + 2]
  },
  topSide(referenceIndex) {
    return [referenceIndex - 1,referenceIndex,referenceIndex - 10,referenceIndex - 20]
  },
  leftSide(referenceIndex) {
    return [referenceIndex - 2,referenceIndex - 1,referenceIndex,referenceIndex + 10]
  },
  bottomSide(referenceIndex) {
    return [referenceIndex + 1,referenceIndex,referenceIndex + 10,referenceIndex + 20]
  },
  allRotations(referenceIndex) {
    return [this.rightSide(referenceIndex),this.topSide(referenceIndex),this.leftSide(referenceIndex),this.bottomSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
    if (rotationArrayIndex === 0) {
      return 'rightSide'
    } else if (rotationArrayIndex === 1) {
      return 'topSide'
    } else if (rotationArrayIndex === 2) {
      return 'leftSide'
    } else if (rotationArrayIndex === 3) {
      return 'bottomSide'
    }
  },
  predictiveRotationCoordinates(referenceIndex = this.currentReferenceIndex,rotationIndex = this.currentRotationIndex) {
    return this.allRotations(referenceIndex)[rotationIndex]
  },
}

const jReverseShape = {
  startIndex: 15,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  currentClass: 'j-reverse',
  deadClass: 'dead',
  leftBoundaryReferenceRemainder: 2,
  rightBoundaryReferenceRemainder: 7,
  topBoundaryReferenceHeight: width * 2,
  bottomBoundaryReferenceHeight: width * 2,
  rightSide(referenceIndex) {
    return [referenceIndex + 10,referenceIndex,referenceIndex + 1,referenceIndex + 2]
  },
  topSide(referenceIndex) {
    return [referenceIndex + 1,referenceIndex,referenceIndex - 10,referenceIndex - 20]
  },
  leftSide(referenceIndex) {
    return [referenceIndex - 2,referenceIndex - 1,referenceIndex,referenceIndex - 10]
  },
  bottomSide(referenceIndex) {
    return [referenceIndex - 1,referenceIndex,referenceIndex + 10,referenceIndex + 20]
  },
  allRotations(referenceIndex) {
    return [this.leftSide(referenceIndex),this.topSide(referenceIndex),this.rightSide(referenceIndex),this.bottomSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
    if (rotationArrayIndex === 0) {
      return 'leftSide'
    } else if (rotationArrayIndex === 1) {
      return 'topSide'
    } else if (rotationArrayIndex === 2) {
      return 'rightSide'
    } else if (rotationArrayIndex === 3) {
      return 'bottomSide'
    }
  },
  predictiveRotationCoordinates(referenceIndex = this.currentReferenceIndex,rotationIndex = this.currentRotationIndex) {
    return this.allRotations(referenceIndex)[rotationIndex]
  },
}

const sShape = {
  startIndex: 14,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  currentClass: 's',
  deadClass: 'dead',
  leftBoundaryReferenceRemainder: 1,
  rightBoundaryReferenceRemainder: 8,
  topBoundaryReferenceHeight: width * 1,
  bottomBoundaryReferenceHeight: width * 1,
  rightSide(referenceIndex) {
    return [referenceIndex - 1,referenceIndex,referenceIndex - 10,referenceIndex - 9]
  },
  topSide(referenceIndex) {
    return [referenceIndex - 10,referenceIndex,referenceIndex + 1,referenceIndex + 11]
  },
  allRotations(referenceIndex) {
    return [this.rightSide(referenceIndex),this.topSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
    if (rotationArrayIndex === 0) {
      return 'rightSide'
    } else if (rotationArrayIndex === 1) {
      return 'topSide'
    }
  },
  predictiveRotationCoordinates(referenceIndex = this.currentReferenceIndex,rotationIndex = this.currentRotationIndex) {
    return this.allRotations(referenceIndex)[rotationIndex]
  },
}

const sReverseShape = {
  startIndex: 14,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  currentClass: 's-reverse',
  deadClass: 'dead',
  leftBoundaryReferenceRemainder: 1,
  rightBoundaryReferenceRemainder: 8,
  topBoundaryReferenceHeight: width * 1,
  bottomBoundaryReferenceHeight: width * 1,
  leftSide(referenceIndex) {
    return [referenceIndex - 11,referenceIndex - 10,referenceIndex,referenceIndex + 1]
  },
  topSide(referenceIndex) {
    return [referenceIndex - 10,referenceIndex,referenceIndex - 1,referenceIndex + 9]
  },
  allRotations(referenceIndex) {
    return [this.leftSide(referenceIndex),this.topSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
    if (rotationArrayIndex === 0) {
      return 'leftSide'
    } else if (rotationArrayIndex === 1) {
      return 'topSide'
    }
  },
  predictiveRotationCoordinates(referenceIndex = this.currentReferenceIndex,rotationIndex = this.currentRotationIndex) {
    return this.allRotations(referenceIndex)[rotationIndex]
  },
}

// const shapesArray = [iShape,tShape,oShape,jShape,jReverseShape,sShape,sReverseShape]
const shapesArray = [iShape]
// const shapesArray = [tShape]
// const shapesArray = [oShape]
// const shapesArray = [jShape]
// const shapesArray = [jReverseShape]
// const shapesArray = [sShape]
// const shapesArray = [sReverseShape]

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

  intervalID = setInterval( () => {

    // ? Why does VScode want me to stick a comma at the end of the currentShape declaration?
    // ! Define our variables of the shape currently dropping
    
    console.log('_________start_________')

    isDropCheck = false
    isFirstLine = false

    if (dropNewShape) {

      currentShape = generateNewShape()

      const isTopRowCollision = topRowCollisionCheck()

      if (isTopRowCollision) {
        alert('Game is over, you lost!')
        clearInterval(intervalID)
        return // test if return is needed
      }

      isFirstLine = true
      dropNewShape = false
      console.log('dropping new shape')
    }

    if (!isFirstLine){
      dropCheck(movements[0])
      isDropCheck = true
    }

    // rowCheckToClear()

  },500)
















  document.addEventListener('keydown', (event) => {
    // ? Here, would it be better to keep all ifs in series of else ifs or better to keep each separated?
    // ! If (upArrow key is pressed) && (the end of the shape.rotation() array is reached) {go back to the start of this array}
    if (event.key === 'ArrowUp') {
      console.log('____rotating')
      rotationBoundaryCheck()

      if (isDropCheck) {
        dropCheck(movements[0])
        isDropCheck = false
      }
    }
    // ! If (downArrow key is pressed) && (the shape blocks are not on the last line) {drop the shape down}
    if (event.key === 'ArrowDown') {
      dropCheck(movements[0])
    }

    // ! If (leftArrow key is pressed) && (the shape blocks are not on the left edge) {move the shape left}
    if (event.key === 'ArrowLeft') {
      dropCheck(movements[1])
    }

    // ! If (rightArrow key is pressed) && (the shape blocks are not on the right edge) {move the shape right}
    if (event.key === 'ArrowRight') {
      dropCheck(movements[2])
    }

  })














})
