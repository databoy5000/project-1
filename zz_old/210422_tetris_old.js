// ? I tried including the setInterval inside a while loop, but it ran some code infintely. I thought that the while loop wouldn't loop until the setInterval ...
// ? 

// ? some functions need global variables to work so I've put the variables on top of the script document (instead of functions being there first). Is this a problem?
// ? I know functions are supposed to be on top of the script document. But what if you are modifying global variables with this function? Is it ok to have variables first and functions second? or should I call variables in as an argument instead?

// ! Other variables declaration
const movements = ['down','left','right','skipDown']
// const rotationSideArray = ['topSide','bottomSide','rightSide','leftSide']
const deadClasses = ['i-dead','t-dead','o-dead','j-dead','j-reverse-dead','s-dead','s-reverse-dead']

let dropNewShape = true
let intervalID = 0

let currentShape = {}
let currentRotation = []
// let currentRotationIndex = 0 // ! 0 is the default shape rotation to drop new shapes in the game // now as property in an object
let isFirstLine = true
let shapeIsDead // ! to avoid 'keydowns' after a shape is dead/dropped

let isPaused = false // ! variable for paused game

let linesCleared = 0 // ! for scoring

// ! Used to prevent bugs where class stays at currentClass instead of dead when rotating/keydown close to dead shapes 
// let isDropCheck = false

// // ! These allow sideway collision boundaries for currentShapes
// let leftSideRedTape = []
// let rightSideRedTape = []

// ! rows full of dead shapes
let fullRows = []


// ? is it bad practice to update global variables in a function? would you rather pass the variable as an argument inside the function and re-assigne with the returned values? what would you do?
// ! Global functions
function generateNewShape() {
  const randomShapeIndex = Math.floor(Math.random() * shapesArray.length)
  const currentShape = shapesArray[randomShapeIndex]

  currentShape.currentReferenceIndex = currentShape.startIndex

  currentShape.currentRotationIndex = 0
  currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)

  currentRotation.forEach( (cellIndex) => {
    cells[cellIndex].classList.add(currentShape.currentClass)
  })

  return currentShape
}

function removeCurrentClass(rotation = currentRotation) {
  return rotation.forEach( (cellIndex) => {
    cells[cellIndex].removeAttribute('class')
  })
}

function addCurrentClass(rotation = currentRotation) {
  return rotation.forEach( (cellIndex) => {
    cells[cellIndex].classList.add(currentShape.currentClass)
  })
}

// function sideCollisionBoundaries() {

//   const cellsIndexArray = cells.map( (cell,index) => {
//     return index
//   })

//   for (let i = 0; i < height * width; i += 10) {
//     const leftRedTapeSlices = cellsIndexArray.slice(i,i + currentShape.leftBoundaryReferenceRemainder)

//     leftRedTapeSlices.forEach( (cellIndex) => {
//       leftSideRedTape.push(cellIndex)
//     })

//     const rightRedTapeSlices = cellsIndexArray.slice( (i + 1) + currentShape.rightBoundaryReferenceRemainder, i + width)

//     rightRedTapeSlices.forEach( (cellIndex) => {
//       rightSideRedTape.push(cellIndex)
//     })
//   }
// }


function moveShape(movementType,isRotation = false) {

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
      currentShape.currentReferenceIndex += width
    } else if (movementType === movements[1]) {
      currentShape.currentReferenceIndex -= 1
    } else if (movementType === movements[2]) {
      currentShape.currentReferenceIndex += 1
    } else if (movementType === movements[3]) { // placeholder for feature 'skipDown'
      return
    } else {
      return
    }

    currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
  
    addCurrentClass(currentRotation)
  }
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
    console.log(cellIndex)
    return (cellIndex < 0)
  })
}

function isBottomCollision(rotation) {
  return rotation.some( (cellIndex) => {
    return (cellIndex >= width * height)
  })
}

function isCollisionDeadShape(rotation) {
  // ! Only make checks on 'in range cells', else function will return 'undefined'.
  const filteredInRangeCells = rotation.filter( (cellIndex) => {
    return cellIndex >= 0 && cellIndex < width * height
  })

  return filteredInRangeCells.some( (cellIndex) => {
    return cells[cellIndex].classList.contains('dead')
  })
}

function isSidesCollision(subCurrentRotation,subPredictiveRotation) {
  // ! Only make checks on cells in range, else function will return 'undefined'.
  const filteredIndexes = subPredictiveRotation
    .filter(cellIndex => cellIndex >= 0 && cellIndex < 200)
    .map(cellIndex => subPredictiveRotation.indexOf(cellIndex))

  // ! detect if the predictive shape has gone too far left
  const leftBoundaryViolated = filteredIndexes.some( (arrayIndex) => {
    const currentRemainder = subCurrentRotation[arrayIndex] % width
    const predictiveRemainder = subPredictiveRotation[arrayIndex] % width 

    return (currentRemainder < 2) && (predictiveRemainder > 7)
  })

  // ! detect if the predictive shape has gone too far right
  const rightBoundaryViolated = filteredIndexes.some( (arrayIndex) => {
    const currentRemainder = subCurrentRotation[arrayIndex] % width
    const predictiveRemainder = subPredictiveRotation[arrayIndex] % width 

    return (predictiveRemainder < 2) && (currentRemainder > 7)
  })

  if (leftBoundaryViolated || rightBoundaryViolated) {
    return true
  } else {
    return false
  }
}

function sideCorrection(currentRotation = currentRotation,subPredictiveRotationIndex) {

  // ! subPreditiveRotationIndex named to avoid conflicts with preditiveRotationIndex. sub to the function.
  let subPredictiveReferenceIndex = currentShape.currentReferenceIndex
  let subPredictiveRotation = currentShape.predictiveRotationCoordinates(subPredictiveReferenceIndex,subPredictiveRotationIndex)
  
  let isRunning = true

  while (isRunning) {

    // ! if the predictive shape has gone too far left, shift it +1
    const rightCorrection = currentRotation.some( (cellIndex,coordinatesIndex) => {
      const currentRemainder = currentRotation[coordinatesIndex] % width
      const predictiveRemainder = subPredictiveRotation[coordinatesIndex] % width 

      return (currentRemainder < 2) && (predictiveRemainder > 7)
    })

    // ! if the predictive shape has gone too far right, shift it -1
    const leftCorrection = currentRotation.some( (cellIndex,coordinatesIndex) => {
      const currentRemainder = currentRotation[coordinatesIndex] % width
      const predictiveRemainder = subPredictiveRotation[coordinatesIndex] % width 

      return (predictiveRemainder < 2) && (currentRemainder > 7)
    })

    if (rightCorrection) {
      // correctionValue++
      subPredictiveReferenceIndex++
      subPredictiveRotation = currentShape.predictiveRotationCoordinates(subPredictiveReferenceIndex,subPredictiveRotationIndex)
    } else if (leftCorrection) {
      // correctionValue--
      subPredictiveReferenceIndex--
      subPredictiveRotation = currentShape.predictiveRotationCoordinates(subPredictiveReferenceIndex,subPredictiveRotationIndex)
    } else {
      isRunning = false
    }
  }
  return subPredictiveReferenceIndex
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

function evaluateMultipleCollisions(array) {
  const booleanArray = []
  array.forEach( (element) => {
    if (element) {
      booleanArray.push(element)
    }
  })
  if (booleanArray.length > 1) {
    return true
  } else {
    return false
  }
}

function rotationBoundaryCheck() {

  // ! define the next rotation variables to make collision checks
  let predictiveRotationIndex // outputs which rotation
  let predictiveRotation // outputs the chosen rotation index
  let predictiveReferenceIndex = currentShape.currentReferenceIndex
  // let collisionErrors = 0
  // let predictionCorrectionCount = 0

  if (currentShape.currentRotationIndex >= (currentShape.allRotations(currentShape.currentReferenceIndex).length - 1)) {
    predictiveRotationIndex = 0
  } else {
    predictiveRotationIndex = currentShape.currentRotationIndex + 1
  }

  // const switchToSide = currentShape.getCurrentSide(predictiveRotationIndex)

  predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)

  // ! separate variables for different collision detections, which will be treated differently
  const topCollisionResult = isTopCollision(predictiveRotation)
  console.log('topCollisionResult: ' + topCollisionResult)

  const bottomCollisionResult = isBottomCollision(predictiveRotation)
  console.log('bottomCollisionResult: ' + bottomCollisionResult)

  const collisionDeadShapeResult = isCollisionDeadShape(predictiveRotation)
  console.log('collisionDeadShapeResult: ' + collisionDeadShapeResult)

  const sidesCollisionResult = isSidesCollision(currentRotation,predictiveRotation)
  console.log('sidesCollisionResult: ' + sidesCollisionResult)

  const collisionsArray = [topCollisionResult,bottomCollisionResult,collisionDeadShapeResult,sidesCollisionResult]

  console.log('evaluateConditions: ' + evaluateConditions(collisionsArray))

  // ! if no more than one of the conditions below is true, treat accordingly
  if (evaluateConditions(collisionsArray)) {
    
    if (topCollisionResult) {
      removeCurrentClass()
      currentShape.currentReferenceIndex = (currentShape.currentReferenceIndex % width) + (currentShape.topBoundaryReferenceHeight)
      currentShape.currentRotationIndex = predictiveRotationIndex
      currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
      addCurrentClass(currentRotation)
    } else if (bottomCollisionResult) {
      removeCurrentClass()
      currentShape.currentReferenceIndex -= currentShape.bottomBoundaryReferenceHeight
      currentShape.currentRotationIndex = predictiveRotationIndex
      currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
      addCurrentClass(currentRotation)
    // ! we need to filter out which block(s) of the predictive rotation is in collision with another dead shape.
    // !if the new rotation is horizontal (top or bottom side), the collision is either above or below.
    // ! on the opposite, it will be a sideway collision.
    } else if (collisionDeadShapeResult) {

      const resultsArray = []

      predictiveRotation.forEach( (deadCellIndex) => {
        if (cells[deadCellIndex].classList.contains('dead')) {

          predictiveReferenceIndex = currentShape.currentReferenceIndex

          // ! shift down width steps (collision above)
          if (deadCellIndex < (currentShape.currentReferenceIndex - (currentShape.currentReferenceIndex % width)) ) {
            resultsArray.push(width)
          }

          // ! shift up width steps (collision below)
          if (deadCellIndex > (currentShape.currentReferenceIndex + (width - 1) - (currentShape.currentReferenceIndex % width)) ) {
            resultsArray.push(-width)
          }

          // ! shift 1 step right if dead cell index is on the left of the reference index 
          if (deadCellIndex % width < currentShape.currentReferenceIndex % width) {
            resultsArray.push(1)
          }

          // ! shift 1 step left if dead cell index is on the right of the reference index 
          if (deadCellIndex % width > currentShape.currentReferenceIndex % width) {
            resultsArray.push(-1)
          }
        }
      })

      const allCombinations = []

      resultsArray.map( (initialCombination) => {
        allCombinations.push(initialCombination)
      })

      // ! if more than 1 result, try combinations for the best outcome
      if (resultsArray.length > 1) {
        for (let i = 0; i < resultsArray.length - 1; i++) {
          allCombinations.push(resultsArray[i]*2)
          for (let j = i + 1; j < resultsArray.length; j++) {
            allCombinations.push(resultsArray[i] + resultsArray[j])
            allCombinations.push(resultsArray[j] * 2)
          }
        }
      }

      // ! checking combinations
      allCombinations.forEach( (result) => {
        predictiveReferenceIndex += result
        predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)
        
        const winningCombination = predictiveRotation.every( (cellIndex,iterationIndex) => {

          const currentRemainder = currentRotation[iterationIndex] % width
          const predictiveRemainder = predictiveRotation[iterationIndex] % width 

          let leftSideCollision = false
          let rightSideCollision = false

          if ( (currentRemainder < 2) && !(predictiveRemainder > 7) ) {
            leftSideCollision = true
          }

          if ( (predictiveRemainder < 2) && (currentRemainder > 7) ) {
            rightSideCollision = true
          }

          return (cellIndex > 0) && // ! out of range check
          (cellIndex < width * height) && // ! out of range check
          !cells[cellIndex].classList.contains('dead') && // ! does not contain dead class check
          !leftSideCollision && !rightSideCollision // ! no sideway collisions
        })

        if (winningCombination) {
          removeCurrentClass()
          currentShape.currentReferenceIndex = predictiveReferenceIndex
          currentShape.currentRotationIndex = predictiveRotationIndex
          currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
          addCurrentClass(currentRotation)
        } else {
          return
        }
      })

    } else if (sidesCollisionResult) {

      predictiveReferenceIndex = sideCorrection(currentRotation,predictiveRotationIndex)
      predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)

      if (isCollisionDeadShape(predictiveRotation)) {
        return
      } else {
        removeCurrentClass()
        currentShape.currentReferenceIndex = predictiveReferenceIndex
        currentShape.currentRotationIndex = predictiveRotationIndex
        currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
        addCurrentClass(currentRotation)
      }
    }
  } else if (evaluateMultipleCollisions(collisionsArray)) {
    return
  } else {
    removeCurrentClass()
    currentShape.currentRotationIndex = predictiveRotationIndex
    currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
    addCurrentClass(currentRotation)
  }
}

function clearFullRows() {

  // ! Check lines from bottom to top
  for (let i = 0 ; i <= (width * height) - width; i += 10) {
    const rowArray = cells.slice(i, i + width)
    const isFull = rowArray.every( (cell) => cell.classList.contains('dead') )

    if (isFull) {
      console.log(isFull)
      fullRows.push(rowArray)
      rowArray.forEach( div => div.removeAttribute('class') )
    }
  }
}

function shiftRowsDown(emptyRows) {

  if (emptyRows.length > 0) {
    emptyRows.forEach( (row) => {
      const cellIndexesToDrop = []

      const rowIndexesArray = row.map(rowCell => cells.findIndex(cell => cell === rowCell))
      const rowSmallestIndex = Math.min(...rowIndexesArray)

      for (let i = rowSmallestIndex - 1; i >= 0; i--) {
        if (cells[i].classList.contains('dead')) {
          cells[i].removeAttribute('class')
          cellIndexesToDrop.push(i + width)
        }
      }

      cellIndexesToDrop.forEach( (cellIndex) => {
        cells[cellIndex].classList.add('dead')
      })

    })
  }
}

// ! DOM elements
const elements = {
  play: document.querySelector('#play'),
  grid: document.querySelector('#grid'),
  pause: document.querySelector('#pause'),
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

// for (let i = 200; i >= 100; i -= width) {
//   const sliced = cells.slice(i - width, i - 2)
//   sliced.forEach( (cell) => cell.classList.add('dead'))
// }



// ! Shapes objects & array
// add all other shapes when testing is successful
// replace blockIndexes by rightSide
// rightSide to topSide
// topSide to leftSide
// leftSide to bottomSide
// bottomSide to rightSide

const iShape = {
  startIndex: 5,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  currentClass: 'i',
  deadClass: 'dead',
  // leftBoundaryReferenceRemainder: 2,
  // rightBoundaryReferenceRemainder: 8,
  // topBoundaryReferenceHeight: width * 2,
  // bottomBoundaryReferenceHeight: width * 1,
  rightSide(referenceIndex) {
    return [referenceIndex - 2,referenceIndex - 1,referenceIndex,referenceIndex + 1]
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
  // getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
  //   if (rotationArrayIndex === 0) {
  //     return 'rightSide'
  //   } else if (rotationArrayIndex === 1) {
  //     return 'topSide'
  //   }
  // },
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
  // leftBoundaryReferenceRemainder: 1,
  // rightBoundaryReferenceRemainder: 8,
  // topBoundaryReferenceHeight: width * 1,
  // bottomBoundaryReferenceHeight: 0,
  rightSide(referenceIndex) {
    return [referenceIndex - 10,referenceIndex - 9,referenceIndex,referenceIndex + 1]
  },
  allRotations(referenceIndex) {
    return [this.rightSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  // getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
  //   if (rotationArrayIndex === 0) {
  //     return 'rightSide'
  //   }
  // },
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
  // leftBoundaryReferenceRemainder: 1,
  // rightBoundaryReferenceRemainder: 8,
  // topBoundaryReferenceHeight: width * 1,
  // bottomBoundaryReferenceHeight: width * 1,
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
  // getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
  //   if (rotationArrayIndex === 0) {
  //     return 'topSide'
  //   } else if (rotationArrayIndex === 1) {
  //     return 'rightSide'
  //   } else if (rotationArrayIndex === 2) {
  //     return 'bottomSide'
  //   } else if (rotationArrayIndex === 3) {
  //     return 'leftSide'
  //   }
  // },
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
  // leftBoundaryReferenceRemainder: 2,
  // rightBoundaryReferenceRemainder: 7,
  // topBoundaryReferenceHeight: width * 2,
  // bottomBoundaryReferenceHeight: width * 2,
  rightSide(referenceIndex) {
    return [referenceIndex - 10,referenceIndex,referenceIndex + 1,referenceIndex + 2]
  },
  topSide(referenceIndex) {
    return [referenceIndex - 1,referenceIndex,referenceIndex - 10,referenceIndex - 20]
  },
  leftSide(referenceIndex) {
    return [referenceIndex + 10,referenceIndex,referenceIndex - 1,referenceIndex - 2]
  },
  bottomSide(referenceIndex) {
    return [referenceIndex + 1,referenceIndex,referenceIndex + 10,referenceIndex + 20]
  },
  allRotations(referenceIndex) {
    return [this.rightSide(referenceIndex),this.bottomSide(referenceIndex),this.leftSide(referenceIndex),this.topSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  // getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
  //   if (rotationArrayIndex === 0) {
  //     return 'rightSide'
  //   } else if (rotationArrayIndex === 1) {
  //     return 'topSide'
  //   } else if (rotationArrayIndex === 2) {
  //     return 'leftSide'
  //   } else if (rotationArrayIndex === 3) {
  //     return 'bottomSide'
  //   }
  // },
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
  // leftBoundaryReferenceRemainder: 2,
  // rightBoundaryReferenceRemainder: 7,
  // topBoundaryReferenceHeight: width * 2,
  // bottomBoundaryReferenceHeight: width * 2,
  rightSide(referenceIndex) {
    return [referenceIndex + 10,referenceIndex,referenceIndex + 1,referenceIndex + 2]
  },
  topSide(referenceIndex) {
    return [referenceIndex + 1,referenceIndex,referenceIndex - 10,referenceIndex - 20]
  },
  leftSide(referenceIndex) {
    return [referenceIndex - 10,referenceIndex,referenceIndex - 1,referenceIndex - 2]
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
  // getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
  //   if (rotationArrayIndex === 0) {
  //     return 'leftSide'
  //   } else if (rotationArrayIndex === 1) {
  //     return 'topSide'
  //   } else if (rotationArrayIndex === 2) {
  //     return 'rightSide'
  //   } else if (rotationArrayIndex === 3) {
  //     return 'bottomSide'
  //   }
  // },
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
  // leftBoundaryReferenceRemainder: 1,
  // rightBoundaryReferenceRemainder: 8,
  // topBoundaryReferenceHeight: width * 1,
  // bottomBoundaryReferenceHeight: width * 1,
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
  // getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
  //   if (rotationArrayIndex === 0) {
  //     return 'rightSide'
  //   } else if (rotationArrayIndex === 1) {
  //     return 'topSide'
  //   }
  // },
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
  // getCurrentSide(rotationArrayIndex = this.currentRotationIndex) {
  //   if (rotationArrayIndex === 0) {
  //     return 'leftSide'
  //   } else if (rotationArrayIndex === 1) {
  //     return 'topSide'
  //   }
  // },
  predictiveRotationCoordinates(referenceIndex = this.currentReferenceIndex,rotationIndex = this.currentRotationIndex) {
    return this.allRotations(referenceIndex)[rotationIndex]
  },
}

const shapesArray = [iShape,tShape,oShape,jShape,jReverseShape,sShape,sReverseShape]
// const shapesArray = [iShape]
// const shapesArray = [tShape]
// const shapesArray = [oShape]
// const shapesArray = [jShape]
// const shapesArray = [jReverseShape]
// const shapesArray = [sShape]
// const shapesArray = [sReverseShape]

console.log(elements.pause)
console.log(elements.resume)

elements.play.addEventListener('click', () => {

  // ! Prevent intervalIDs to loop on themsleves
  if (intervalID !== 0) {
    return
  }

  // ! Clear all classes (blocks) from divs (cells) = restart the game
  // maybe use this.className = null
  // cells.forEach( (cell) => {
  //   cell.removeAttribute('class')
  // })



  intervalID = setInterval( () => {

    // ? Why does VScode want me to stick a comma at the end of the currentShape declaration?
    // ! Define our variables of the shape currently dropping
    
    if (!isPaused) {

      console.log('_________start_________')

      // !shifting rows down after they've been cleared, and resetting fullRows
      shiftRowsDown(fullRows)
      fullRows = []


      shapeIsDead = false
      isFirstLine = false

      if (dropNewShape) {

        // leftSideRedTape = []
        // rightSideRedTape = []

        currentShape = generateNewShape()

        const endGameCollision = isCollisionDeadShape(currentRotation)

        if (endGameCollision) {
          alert('Game is over, you lost!')
          clearInterval(intervalID)
          return // test if return is needed
        }

        isFirstLine = true
        dropNewShape = false

        // ! defines the side boundaries for the current shape
        // sideCollisionBoundaries()

        console.log('__dropping new shape__')
      }

      if (!isFirstLine){
        dropCheck(movements[0])
        shapeIsDead = true
      }

      clearFullRows()

  }

  },1000)



  if (!shapeIsDead) {
    document.addEventListener('keydown', (event) => {
      // ? Here, would it be better to keep all ifs in series of else ifs or better to keep each separated?
      // ! If (upArrow key is pressed) && (the end of the shape.rotation() array is reached) {go back to the start of this array}
      if (event.key === 'ArrowUp') {
        console.log('____rotating')
        rotationBoundaryCheck()
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
  }

  
  elements.pause.addEventListener('click', () => {
    isPaused = !isPaused
    if (isPaused) {
      elements.pause.innerHTML = 'Resume Game'
    } else {
      elements.pause.innerHTML = 'Pause Game'
    }
  })

})
