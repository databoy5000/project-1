// ? I tried including the setInterval inside a while loop, but it ran some code infintely. I thought that the while loop wouldn't loop until the setInterval ...
// ? 

// ? some functions need global variables to work so I've put the variables on top of the script document (instead of functions being there first). Is this a problem?
// ? I know functions are supposed to be on top of the script document. But what if you are modifying global variables with this function? Is it ok to have variables first and functions second? or should I call variables in as an argument instead?

// ! Other variables declaration
const movements = ['down','left','right','skipDown']
const deadClasses = ['i-dead','t-dead','o-dead','j-dead','j-reverse-dead','s-dead','s-reverse-dead']

let dropNewShape = true
let intervalID = 0

let currentShape = {}
let currentRotation = []
let isFirstLine = true

let isPaused = false // ! variable for paused game

let linesCleared = 0 // ! for scoring

// ! rows full of dead shapes
let fullRows = []

let pauseEventFunctions = true


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
  console.log('pauseEventFunctions: ' + pauseEventFunctions)
  console.log('rotation: ' + rotation)
  return rotation.forEach( (cellIndex) => {
    cells[cellIndex].removeAttribute('class')
  })
}

function addCurrentClass(rotation = currentRotation) {
  return rotation.forEach( (cellIndex) => {
    cells[cellIndex].classList.add(currentShape.currentClass)
  })
}

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
    console.log('pauseEventFunctions: ' + pauseEventFunctions)
    pauseEventFunctions = true
    console.log('pauseEventFunctions: ' + pauseEventFunctions)
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

function topDownCorrection(subPredictiveReferenceIndex,subPredictiveRotationIndex,subPredictiveRotation) {

  let isRunning = true

  while (isRunning) {

    // ! if the predictive shape has gone too far up, shift it +width
    const topCorrection = subPredictiveRotation.some( (cellIndex) => {
      return cellIndex < 0
    })

    // ! if the predictive shape has gone too far down, shift it -width
    const bottomCorrection = subPredictiveRotation.some( (cellIndex) => {
      return cellIndex >= width * height
    })

    if (topCorrection) {
      subPredictiveReferenceIndex += width
      subPredictiveRotation = currentShape.predictiveRotationCoordinates(subPredictiveReferenceIndex,subPredictiveRotationIndex)
    } else if (bottomCorrection) {
      subPredictiveReferenceIndex -= width
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

  // ! defining the next rotation variables to make collision checks
  let predictiveRotationIndex

  if (currentShape.currentRotationIndex >= (currentShape.allRotations(currentShape.currentReferenceIndex).length - 1)) {
    predictiveRotationIndex = 0
  } else {
    predictiveRotationIndex = currentShape.currentRotationIndex + 1
  }

  let predictiveReferenceIndex = currentShape.currentReferenceIndex
  let predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)

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
    
    if (topCollisionResult || bottomCollisionResult) {
      removeCurrentClass()
  
      currentShape.currentReferenceIndex = topDownCorrection(predictiveReferenceIndex,predictiveRotationIndex,predictiveRotation)
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
  linesCleared += fullRows.length
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
  restart: document.querySelector('#restart'),
  scoreboard: document.querySelector('#scoreboard'),
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

// ! Scoreboard


// ! Shapes objects & array
const iShape = {
  startIndex: 5,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  currentClass: 'i',
  deadClass: 'dead',
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
  rightSide(referenceIndex) {
    return [referenceIndex - 10,referenceIndex - 9,referenceIndex,referenceIndex + 1]
  },
  allRotations(referenceIndex) {
    return [this.rightSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
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

const playerScoring = {
  currentLevel: 0,
  currentScore: 0,
  scoreReset() {
    this.currentLevel = 0
    this.currentScore = 0
  },
  setIntervalTimingIncrease() {
    if (this.currentLevel === 0) {
      return 720
    } else if (this.currentLevel === 1) {
      return 640
    } else if (this.currentLevel === 2) {
      return 580
    } else if (this.currentLevel === 3) {
      return 500
    } else if (this.currentLevel === 4) {
      return 440
    } else if (this.currentLevel === 4) {
      return 360
    } else if (this.currentLevel === 6) {
      return 300
    } else if (this.currentLevel === 7) {
      return 220
    } else if (this.currentLevel === 8) {
      return 140
    } else if (this.currentLevel === 9) {
      return 100
    } else if (this.currentLevel >= 10 && this.currentLevel < 13) {
      return 80
    } else if (this.currentLevel >= 13 && this.currentLevel < 16) {
      return 60
    } else if (this.currentLevel >= 16 && this.currentLevel < 19) {
      return 40
    } else if (this.currentLevel >= 19) {
      return 20
    }
  },
  linesBeforeIncrease() {
    if (this.currentLevel < 10) {
      return 10 + (this.currentLevel * 10)
    } else if (this.currentLevel >= 10 && this.currentLevel < 16) {
      return 100
    } else if (this.currentLevel >= 16 && this.currentLevel < 26) {
      return (this.currentLevel * 10) - 50
    } else if (this.currentLevel >= 26) {
      return 200
    }
  },
  scoringCalculation(lines) {
    if (this.currentLevel === 0) {
      if (lines === 1) {
        this.currentScore += 40
      } else if (lines === 2) {
        this.currentScore += 100
      } else if (lines === 3) {
        this.currentScore += 300
      } else if (lines === 4) {
        this.currentScore += 1200
      }
    } else if (this.currentLevel === 1) {
      if (lines === 1) {
        this.currentScore += 80
      } else if (lines === 2) {
        this.currentScore += 200
      } else if (lines === 3) {
        this.currentScore += 600
      } else if (lines === 4) {
        this.currentScore += 2400
      }
    } else if (this.currentLevel >= 2 && this.currentLevel < 9) {
      if (lines === 1) {
        this.currentScore += 120
      } else if (lines === 2) {
        this.currentScore += 300
      } else if (lines === 3) {
        this.currentScore += 900
      } else if (lines === 4) {
        this.currentScore += 3600
      }
    } else if (this.currentLevel >= 9) {
      if (lines === 1) {
        this.currentScore += (40 * (this.currentLevel + 1))
      } else if (lines === 2) {
        this.currentScore += (1000 * (this.currentLevel + 1))
      } else if (lines === 3) {
        this.currentScore += (3000 * (this.currentLevel + 1))
      } else if (lines === 4) {
        this.currentScore += (12000 * (this.currentLevel + 1))
      }
    }
  },
}

elements.play.addEventListener('click', () => {

  // ! Prevent intervalIDs to loop on themsleves
  if (intervalID !== 0) {
    return
  }

  // ! Clear all classes (blocks) from divs (cells) = restart the game
  cells.forEach( (cell) => {
    cell.removeAttribute('class')
  })

  intervalID = setInterval( () => {

    // ? Why does VScode want me to stick a comma at the end of the currentShape declaration?
    // ! Define our variables of the shape currently dropping
    
    if (!isPaused) {

      console.log('_________start_________')

      // !shifting rows down after they've been cleared, and resetting fullRows
      shiftRowsDown(fullRows)
      fullRows = []

      isFirstLine = false

      if (dropNewShape) {

        currentShape = generateNewShape()

        // ! toggle on to disable functions in eventListeners
        // pauseEventFunctions = false
        console.log('pauseEventFunctions: ' + pauseEventFunctions)

        const endGameCollision = isCollisionDeadShape(currentRotation)

        if (endGameCollision) {
          alert('Game is over, you lost!')
          clearInterval(intervalID)
          return // test if return is needed
        }

        isFirstLine = true
        dropNewShape = false
        pauseEventFunctions = false
        console.log('pauseEventFunctions: ' + pauseEventFunctions)

        console.log('__dropping new shape__')
      }

      if (!isFirstLine){
        dropCheck(movements[0])
      }

      clearFullRows()

    }

  },1000)
})

document.addEventListener('keydown', (event) => {
  // ! If (upArrow key is pressed) && (the end of the shape.rotation() array is reached) {go back to the start of this array}
  if (event.key === 'ArrowUp') {
    console.log('____inside Rotation')
    console.log('pauseEventFunctions: ' + pauseEventFunctions)
    if (!pauseEventFunctions) {
      console.log('____activating Rotation')
      console.log('pauseEventFunctions: ' + pauseEventFunctions)
      rotationBoundaryCheck()
    }
  }

  // ! If (downArrow key is pressed) && (the shape blocks are not on the last line) {drop the shape down}
  if (event.key === 'ArrowDown') {
    if (!pauseEventFunctions) {
      dropCheck(movements[0])
    }
  }

  // ! If (leftArrow key is pressed) && (the shape blocks are not on the left edge) {move the shape left}
  if (event.key === 'ArrowLeft') {
    if (!pauseEventFunctions) {
      dropCheck(movements[1])
    }
  }

  // ! If (rightArrow key is pressed) && (the shape blocks are not on the right edge) {move the shape right}
  if (event.key === 'ArrowRight') {
    if (!pauseEventFunctions) {
      dropCheck(movements[2])
    }
  }
})

elements.pause.addEventListener('click', () => {
  isPaused = !isPaused
  if (isPaused) {
    elements.pause.innerHTML = 'Resume Game'
  } else {
    elements.pause.innerHTML = 'Pause Game'
  }
  // pauseEventFunctions = !pauseEventFunctions
})

elements.restart.addEventListener('click', () => {
  // ! start off with no class/shapes
  cells.forEach( (cell) => {
    cell.removeAttribute('class')
  })

  // ! clear the interval
  clearInterval(intervalID)

  // ! reset intervalID to 0
  intervalID = 0

  // ! reset all let global variables
  dropNewShape = true
  intervalID = 0
  currentShape = {}
  currentRotation = []
  isFirstLine = true
  isPaused = false
  linesCleared = 0
  fullRows = []
  pauseEventFunctions = true

  // ! reset all objects
  playerScoring.scoreReset()
  shapesArray.forEach( (object) => {
    object.currentReferenceIndex = null
    object.currentRotationIndex = 0
  })

})