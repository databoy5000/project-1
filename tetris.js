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
let nextShape = {}
let isFirstLine = true
let isFirstShape = true

let isPaused = false // ! variable for paused game

// ! rows full of dead shapes
let fullRows = []

let pauseEventFunctions = true

const audioTunes = ['sounds/Blue Hawaii - No One Like You.mp3','sounds/Marie Davidson & LŒil Nu - Renegade Breakdown.mp3','sounds/Blue Hawaii - Tenderness.mp3']
let audioLoop = true
let tuneIndex = 0


// ? is it bad practice to update global variables in a function? would you rather pass the variable as an argument inside the function and re-assigne with the returned values? what would you do?
// ! Global functions

function generateNewShape(isCurrentShape) {
  const randomShapeIndex = Math.floor(Math.random() * shapesArray.length)
  
  if (isCurrentShape) {
    const currentShape = shapesArray[randomShapeIndex]

    currentShape.currentReferenceIndex = currentShape.startIndex
    currentShape.currentRotationIndex = 0

    currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
  
    currentRotation.forEach( (cellIndex) => {
      cells[cellIndex].classList.add(currentShape.currentClass)
    })
  
    return currentShape
    
  } else if (!isCurrentShape) {

    const nextShape = shapesArray[randomShapeIndex]
  
    return nextShape
  }

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
  playerScoring.scoringCalculation(false,fullRows.length)
  playerScoring.linesBeforeLevelIncrease(fullRows.length)
  playerScoring.totalLines += fullRows.length

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
  level: document.querySelector('#level'),
  lines: document.querySelector('#lines'),
  score: document.querySelector('#score'),
  audioPlayer: document.querySelector('#audio'),
  nextShape: document.querySelector('#next-shape'),
}

// ! Grid Properties/elements
const width = 10
const height = 20
// elements.grid.style.width = `${width * 30}px`
// elements.grid.style.height = `${height * 30}px`
const cells = []

// ! Generate the grid
for (let index = 0; index < width * height; index++) {
  const div = document.createElement('div')
  elements.grid.appendChild(div)
  // div.innerHTML = index
  cells.push(div)
}

// ! Grid Properties/elements
// elements.nextShape.style.width = `${width * 30}px`
// elements.nextShape.style.height = `${height * 30}px`
const nextShapeCells = []

// ! Generate the grid
for (let index = 0; index < 5 * 4; index++) {
  const div = document.createElement('div')
  elements.nextShape.appendChild(div)
  // div.innerHTML = index
  nextShapeCells.push(div)
}

// ! Shapes objects & array
const iShape = {
  startIndex: 5,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  nextShapeReferenceIndex: [8,9,10,11],
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
  nextShapeReferenceIndex: [9,10,13,14],
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
  nextShapeReferenceIndex: [6,9,10,11],
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
  nextShapeReferenceIndex: [8,9,10,14],
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
  nextShapeReferenceIndex: [9,10,11,13],
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
  nextShapeReferenceIndex: [9,10,12,13],
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
  nextShapeReferenceIndex: [9,10,14,15],
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
  totalLines: 0,
  linesToNextLevel: 0,
  clearLineCount: false,
  scoreReset() {
    this.currentLevel = 0
    this.currentScore = 0
    this.totalLines = 0
    this.linesToNextLevel = 0
    this.clearLineCount = false
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
  linesBeforeLevelIncrease(lines) {
    if (lines) {
      this.linesToNextLevel += lines
    } else if (this.clearLineCount) {
      this.linesToNextLevel = 0
      this.clearLineCount = false
    }
    if (this.currentLevel < 10 && this.linesToNextLevel === (10 + (this.currentLevel * 10)) ) {
      this.level += 1
      this.clearLineCount = true
    } else if (this.currentLevel >= 10 && this.currentLevel < 16 && this.linesToNextLevel === 100) {
      this.level += 1
      this.clearLineCount = true
    } else if (this.currentLevel >= 16 && this.currentLevel < 26 && (this.linesToNextLevel === (this.currentLevel * 10) - 50)) {
      this.level += 1
      this.clearLineCount = true
    } else if (this.currentLevel >= 26 && this.linesToNextLevel === 200) {
      this.level += 1
      this.clearLineCount = true
    }
  },
  scoringCalculation(lineDropEvent,lines) {
    if (lineDropEvent) {
      if (this.currentLevel < 2) {
        this.currentScore += 1
      } else if (this.currentLevel >= 2 && this.currentLevel < 4) {
        this.currentScore += 2
      } else if (this.currentLevel >= 4 && this.currentLevel < 6) {
        this.currentScore += 3
      } else if (this.currentLevel >= 6 && this.currentLevel < 8) {
        this.currentScore += 4
      } else if (this.currentLevel >= 8) {
        this.currentScore += 5
      }
    }
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

  if (audioLoop) {
    tuneIndex = 0
    elements.audioPlayer.src = audioTunes[tuneIndex]
    elements.audioPlayer.play()
    tuneIndex++
    if (tuneIndex >= audioTunes.length) {
      tuneIndex = 0
    }
  }

  intervalID = setInterval( () => {

    // ? Why does VScode want me to stick a comma at the end of the currentShape declaration?
    // ! Define our variables of the shape currently dropping
    
    if (!isPaused) {

      console.log('_________start_________')

      // ! Scoreboard
      elements.level.innerHTML = playerScoring.currentLevel
      elements.lines.innerHTML = playerScoring.totalLines
      elements.score.innerHTML = playerScoring.currentScore

      // !shifting rows down after they've been cleared, and resetting fullRows
      shiftRowsDown(fullRows)
      fullRows = []

      isFirstLine = false


      if (dropNewShape) {

        if (isFirstShape) {
          currentShape = generateNewShape(true)
          nextShape = generateNewShape(false)
          isFirstShape = false

          nextShapeCells.forEach( (cell) => {
            cell.removeAttribute('class')
          })

          nextShape.nextShapeReferenceIndex.forEach( cellIndex => {
            console.log(cellIndex)
            nextShapeCells[cellIndex].classList.add(nextShape.currentClass)
          })

        } else {
          currentShape = nextShape
          currentShape.currentReferenceIndex = currentShape.startIndex
          currentShape.currentRotationIndex = 0
          currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
          addCurrentClass(currentRotation)

          nextShapeCells.forEach( (cell) => {
            cell.removeAttribute('class')
          })

          nextShape = generateNewShape(false)

          nextShape.nextShapeReferenceIndex.forEach( cellIndex => {
            console.log(cellIndex)
            nextShapeCells[cellIndex].classList.add(nextShape.currentClass)
          })
        }

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

  },playerScoring.setIntervalTimingIncrease())
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
      playerScoring.scoringCalculation(true,false)
      elements.score.innerHTML = playerScoring.currentScore
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
  pauseEventFunctions = !pauseEventFunctions
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
  isFirstShape = true
  isPaused = false
  fullRows = []
  pauseEventFunctions = true

  // ! reset all objects
  playerScoring.scoreReset()
  shapesArray.forEach( (object) => {
    object.currentReferenceIndex = null
    object.currentRotationIndex = 0
  })

})