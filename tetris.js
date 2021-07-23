console.log(
  '%c  -- GA Project: WoCRO --','font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)', '\n',
  'Hi there, thanks for checking out this project.', '\n',
  'I\'m currently looking for employement opportunities.', '\n',
  'Feel free to get in touch if you\'d like to have a chat!', '\n',
  '{', '\n',
  '  name: \'Anthony Graham\',', '\n',
  '  peopleCallMe: \'🐜\',', '\n',
  '  title', ': \'Junior Software Engineer\',', '\n',
  '  github: \'https://github.com/databoy5000\',', '\n',
  '  linkedin: \'https://www.linkedin.com/in/anthonygdev/\',', '\n',
  '  projectReadMe: \'https://github.com/databoy5000/project-1\',', '\n',
  '}'
)

// ! Other variables declaration
const movements = ['down','left','right','skipDown']

let dropNewShape = true
let intervalID = 0

let currentShape = {}
let currentRotation = []
let nextShape = {}
let isFirstLine = true
let isFirstShape = true

let isPaused = true
let newGame = true

// ! rows full of dead shapes
let fullRows = []

let pauseEventFunctions = true

const audioTunes = ['sounds/Blue Hawaii - No One Like You.mp3','sounds/Marie Davidson & LŒil Nu - Renegade Breakdown.mp3']
let playAudio = false
let tuneIndex = 0

// ! hard drop prediction variables
// let hardDrop = false
// const hdPredictionClass = 'hardDropDisplay'
// let hdPredictiveReferenceIndex
// let hdPredictiveRotation

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
    pauseEventFunctions = true
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
      subPredictiveReferenceIndex++
      subPredictiveRotation = currentShape.predictiveRotationCoordinates(subPredictiveReferenceIndex,subPredictiveRotationIndex)
    } else if (leftCorrection) {
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

  const bottomCollisionResult = isBottomCollision(predictiveRotation)

  const collisionDeadShapeResult = isCollisionDeadShape(predictiveRotation)

  const sidesCollisionResult = isSidesCollision(currentRotation,predictiveRotation)

  const collisionsArray = [topCollisionResult,bottomCollisionResult,collisionDeadShapeResult,sidesCollisionResult]

  // ! if no more than one of the conditions below is true, treat accordingly
  if (evaluateConditions(collisionsArray)) {
    
    if (topCollisionResult || bottomCollisionResult) {
      removeCurrentClass(currentShape.currentRotation)
  
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

      const allCombinations = resultsArray.map( initialCombination => initialCombination)

      // ! if more than 1 result, try combinations for the best outcome
      if (resultsArray.length > 1) {
        for (let i = 0; i < resultsArray.length - 1; i++) {
          allCombinations.push(resultsArray[i] * 2)
          for (let j = i + 1; j < resultsArray.length; j++) {
            allCombinations.push(resultsArray[i] + resultsArray[j])
            allCombinations.push(resultsArray[j] * 2)
          }
        }
      } else if (resultsArray.length === 1) {
        allCombinations.push(resultsArray[0] * 2)
      }

      const uniqueCombination = allCombinations.filter((value, index, array) => array.indexOf(value) === index)
      

      // ! checking combinations
      uniqueCombination.map( (result) => {
        
        let testPredictiveReferenceIndex = predictiveReferenceIndex

        testPredictiveReferenceIndex += result
        predictiveRotation = currentShape.predictiveRotationCoordinates(testPredictiveReferenceIndex,predictiveRotationIndex)
        
        // ! checking for collisions with all blocks of tested rotation
        const winningCombination = predictiveRotation.every( (cellIndex,iterationIndex) => {

          const currentRemainder = currentRotation[iterationIndex] % width
          const predictiveRemainder = predictiveRotation[iterationIndex] % width 
          
          let leftSideCollision = false
          let rightSideCollision = false

          if ( (currentRemainder < 2) && (predictiveRemainder > 7) ) {
            leftSideCollision = true
          }

          if ( (predictiveRemainder < 2) && (currentRemainder > 7) ) {
            rightSideCollision = true
          }

          return (cellIndex > 0) && // ! out of range check (top)
          (cellIndex < width * height) && // ! out of range check (down)
          !cells[cellIndex].classList.contains('dead') && // ! does not contain dead class check
          !leftSideCollision && !rightSideCollision // ! no sideway collisions
        })

        // ! set back at initial value to test other results
        predictiveReferenceIndex -= result

        if (winningCombination) {
          removeCurrentClass(currentShape.currentRotation)
          currentShape.currentReferenceIndex = testPredictiveReferenceIndex
          currentShape.currentRotationIndex = predictiveRotationIndex
          currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
          addCurrentClass(currentRotation)
          return
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
        removeCurrentClass(currentShape.currentRotation)
        currentShape.currentReferenceIndex = predictiveReferenceIndex
        currentShape.currentRotationIndex = predictiveRotationIndex
        currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
        addCurrentClass(currentRotation)
      }
    }
  } else if (evaluateMultipleCollisions(collisionsArray)) {
    return
  } else {
    removeCurrentClass(currentShape.currentRotation)
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
      fullRows.push(rowArray)
      rowArray.forEach( div => div.removeAttribute('class') )

    }
  }

  // ! if rows cleared, play sfx
  if (fullRows.length > 0) {
    elements.sfxLine.play()
  }

  playerScoring.scoringCalculation(false,fullRows.length)
  playerScoring.lineCountForLevelIncrease(fullRows.length)
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

// function hardDropPrediction(referenceIndex,rotationIndex) {

//   // if (currentShape !== undefined) return

//   const gridVolume = height * width
//   const bottomLine = cells.slice(gridVolume - width, gridVolume)

//   console.log(bottomLine)

//   const bottomLineIndexes = bottomLine.map(subCell => cells.findIndex(cell => cell === subCell))

//   let newPredictiveReferenceIndex = bottomLineIndexes.filter( cellIndex => cellIndex % width === referenceIndex % width)[0]
//   let newPredictiveRotation = currentShape.predictiveRotationCoordinates(newPredictiveReferenceIndex,rotationIndex)

//   console.log(newPredictiveReferenceIndex)
//   console.log(newPredictiveRotation)
//   let isRunning = true
  
//   while (isRunning) {

//     const isCollision = newPredictiveRotation.some( cellIndex => {
//       if (cellIndex > 0 && cellIndex < gridVolume) {
//         return cells[cellIndex].classList.contains('dead') &&
//         cellIndex < gridVolume &&
//         cellIndex > 0
//       } else return
//     })

//     console.log(isCollision)

//     if (isCollision) {
//       newPredictiveReferenceIndex -= width
//       newPredictiveRotation = currentShape.predictiveRotationCoordinates(newPredictiveReferenceIndex,rotationIndex)
//       console.log(newPredictiveRotation)
//     } else if (!isCollision) {
//       isRunning = false
//       console.log(newPredictiveReferenceIndex)
//       return newPredictiveReferenceIndex
//     }
//   }
// }

function openModal(modal) {
  if (modal === null) return
  modal.classList.add('active')
  elements.overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal === null) return
  modal.classList.remove('active')
  elements.overlay.classList.remove('active')
}

function resetVariables() {
  // ! Button reset
  elements.play.innerHTML = 'Play Tetris!'

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
  isPaused = true
  newGame = true

  // ! reset all objects
  playerScoring.scoreReset()
  shapesArray.forEach( (object) => {
    object.currentReferenceIndex = null
    object.currentRotationIndex = 0
  })
}

// ! DOM elements
const elements = {
  play: document.querySelector('#play'),
  toggleMusic: document.querySelector('#toggle-music'),
  restart: document.querySelector('#restart'),
  scoreB: document.querySelector('#score-btn'),
  scoreBClose: document.querySelector('#score-close-button'),
  scoreBModal: document.querySelector('.score-modal'),
  overlay: document.querySelector('#overlay'),
  options: document.querySelector('#options-btn'),
  optionsClose: document.querySelector('#options-close-button'),
  optionsModal: document.querySelector('.options-modal'),
  gameOver: document.querySelector('#gameover-btn'),
  gameOverClose: document.querySelector('#gameover-close-button'),
  gameOverModal: document.querySelector('.gameover-modal'),
  activeModals: document.querySelectorAll('.active'),
  grid: document.querySelector('#grid'),
  nextShape: document.querySelector('#next-shape'),
  // ! the 4 lines below correspond to the in-game current scores
  scoreboard: document.querySelector('#scoreboard'),
  level: document.querySelector('#level'),
  lines: document.querySelector('#lines'),
  score: document.querySelector('#score'),
  audioPlayer: document.querySelector('#audio'),
  sfxLine: document.querySelector('#clear-line'),
  sfxLevelUp: document.querySelector('#level-up'),
  sfxLoose: document.querySelector('#loose'),
  sfxGameStart: document.querySelector('#gamestart'),
  sliderSFX: document.querySelector('#sfx-slider'),
  sliderAudio: document.querySelector('#audio-slider'),
}

// ! sfx audio
elements.sfxLine.src = 'sounds/clear-line.wav'
elements.sfxLevelUp.src = 'sounds/level-up.wav'
elements.sfxLoose.src = 'sounds/loose.wav'
elements.sfxGameStart.src = 'sounds/gamestart.wav'

elements.sfxGameStart.volume = 0.04
elements.sfxLevelUp.volume = 0.2
elements.sfxLoose.volume = 0.3

// ! doesn't work if audio levels are changed, but ran out of time to fix
elements.sliderSFX.addEventListener('change', (event) => {
  elements.sfxLine.volume = (event.currentTarget.value / 100) / 10
  elements.sfxLevelUp.volume = (event.currentTarget.value / 100) / 2
  elements.sfxLoose.volume = event.currentTarget.value / 100
  elements.sfxGameStart.volume = event.currentTarget.value / 100
})

elements.sliderAudio.addEventListener('change', (event) => {
  elements.audioPlayer.volume = event.currentTarget.value / 100
})


// ! Grid Properties/elements
const width = 10
const height = 20
const cells = []

// ! Generate the gameplay grid
for (let index = 0; index < width * height; index++) {
  
  const div = document.createElement('div')
  const section = document.createElement('section')

  elements.grid.appendChild(div)
  div.appendChild(section)
  // div.innerHTML = index
  cells.push(div)
}


// ! Generate the next shape display grid
const nextShapeCells = []

for (let index = 0; index < 2 * 4; index++) {
  const div = document.createElement('div')
  const section = document.createElement('section')
  elements.nextShape.appendChild(div)
  div.appendChild(section)
  // div.innerHTML = index
  nextShapeCells.push(div)
}

// ! Shapes objects & array
const iShape = {
  startIndex: 5,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  nextShapeReferenceIndex: [0,1,2,3],
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
  nextShapeReferenceIndex: [1,2,5,6],
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
  nextShapeReferenceIndex: [1,4,5,6],
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
  nextShapeReferenceIndex: [0,4,5,6],
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
  nextShapeReferenceIndex: [2,4,5,6],
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
  nextShapeReferenceIndex: [1,2,4,5],
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
  nextShapeReferenceIndex: [0,1,5,6],
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
  lineCountForLevelIncrease(lines) {
    if (lines) {
      this.linesToNextLevel += lines
    } else if (this.clearLineCount) {
      this.currentLevel++
      this.linesToNextLevel = 0
      this.clearLineCount = false
      elements.sfxLevelUp.play()
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

  if (newGame) {
    elements.sfxGameStart.play()
    newGame = false
  }

  if (!isPaused) {
    elements.play.innerHTML = 'Resume Game'
    isPaused = !isPaused
  } else {
    elements.play.innerHTML = 'Pause Game'
    isPaused = !isPaused
  }
  pauseEventFunctions = !pauseEventFunctions

  // ! Prevent intervalIDs to loop on themsleves
  if (intervalID !== 0) {
    return
  }

  // ! Clear all classes (blocks) from divs (cells) = restart the game
  cells.forEach( (cell) => {
    cell.removeAttribute('class')
  })

  nextShapeCells.forEach( (cell) => {
    cell.removeAttribute('class')
  })

  intervalID = setInterval( () => {

    // ? Why does VScode want me to stick a comma at the end of the currentShape declaration?
    // ! Define our variables of the shape currently dropping
    
    if (!isPaused) {

      // ! Scoreboard setup
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
            nextShapeCells[cellIndex].classList.add(nextShape.currentClass)
          })
        }

        // ! toggle on to disable functions in eventListeners
        // pauseEventFunctions = false

        const endGameCollision = isCollisionDeadShape(currentRotation)

        if (endGameCollision) {
          // alert('Game is over, you lost!')
          openModal(elements.gameOverModal)
          elements.sfxLoose.play()
          resetVariables()
          clearInterval(intervalID)
          return // test if return is needed
        }

        isFirstLine = true
        dropNewShape = false
        pauseEventFunctions = false
      }

      if (!isFirstLine){
        dropCheck(movements[0])
      }
    }

    clearFullRows()

  },playerScoring.setIntervalTimingIncrease())
})

// ! turn music on, only on first button click after page load
elements.play.addEventListener('click', () => {
  tuneIndex = 0
  elements.audioPlayer.src = audioTunes[tuneIndex]
  elements.audioPlayer.play()
  tuneIndex++
  if (tuneIndex >= audioTunes.length) {
    tuneIndex = 0
  }

  closeModal(elements.scoreBModal)

  elements.toggleMusic.innerHTML = 'Switch Audio Off'
}, { once: true })

// ! play/pause audio toggle switch
elements.toggleMusic.addEventListener('click', () => {
  if (playAudio) {
    elements.audioPlayer.play()
    elements.toggleMusic.innerHTML = 'Switch Audio Off'
  } else if (!playAudio) {
    elements.audioPlayer.pause()
    elements.toggleMusic.innerHTML = 'Switch Audio On'
  }
  playAudio = !playAudio
})

window.addEventListener('keydown', function(e) {
  if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code) > -1) {
    e.preventDefault()
  }
}, false)

document.addEventListener('keydown', (event) => {
  if (!pauseEventFunctions) {
  // ! If (upArrow key is pressed) && (the end of the shape.rotation() array is reached) {go back to the start of this array}
    if (event.key === 'ArrowUp') {
      rotationBoundaryCheck()
    }

    // ! If (downArrow key is pressed) && (the shape blocks are not on the last line) {drop the shape down}
    if (event.key === 'ArrowDown') {
      dropCheck(movements[0])
      playerScoring.scoringCalculation(true,false)
      elements.score.innerHTML = playerScoring.currentScore
    }

    // ! If (leftArrow key is pressed) && (the shape blocks are not on the left edge) {move the shape left}
    if (event.key === 'ArrowLeft') {
      dropCheck(movements[1])
    }

    // ! If (rightArrow key is pressed) && (the shape blocks are not on the right edge) {move the shape right}
    if (event.key === 'ArrowRight') {
      dropCheck(movements[2])
    }

    // if (event.key === ' ') {
    //   console.log('__inside space')
    //   if (!pauseEventFunctions) {
    //     console.log('__inside space')
    //     hardDrop = true
    //     removeCurrentClass(currentShape.currentRotation)
    //     currentShape.currentReferenceIndex = hardDropPrediction(currentShape.currentReferenceIndex,currentShape.currentRotationIndex)
    //     currentShape.currentRotation = currentShape.predictiveRotationCoordinates(currentShape.currentReferenceIndex,currentShape.currentRotationIndex)
    //     console.log(currentShape.currentReferenceIndex)
    //     console.log(currentShape.currentRotation)
    //     currentShape.currentRotation.forEach( cellIndex => cells[cellIndex].classList.add('dead') )
    //     dropNewShape = true
    //   }
    // }

    // if (event.key === 'Shift') {
    //   console.log('__inside shiftleft')
    //   if (!pauseEventFunctions && !hardDrop) {
    //     console.log('__inside shiftleft')
    //     hdPredictiveReferenceIndex = hardDropPrediction(currentShape.currentReferenceIndex,currentShape.currentRotationIndex)
    //     hdPredictiveRotation = currentShape.predictiveRotationCoordinates(hdPredictiveReferenceIndex,currentShape.currentRotationIndex)
    //     console.log('predictiveRotation: ' + hdPredictiveRotation)
    //     return hdPredictiveRotation.forEach( (cellIndex) => {
    //       console.log('addingClass')
    //       cells[cellIndex].classList.add(hdPredictionClass)
    //     })
    //   }
    // }
  }
})

// document.addEventListener('keyup', (event) => {
//   if (event.key === 'Shift') {
//     if (!pauseEventFunctions) {
//       console.log('__removing class')      
//       return cells.forEach( (cell) => {
//         cell.classList.remove(hdPredictionClass)
//       })
//     }
//   }
// })

elements.restart.addEventListener('click', () => {
  // ! start off with no class/shapes
  cells.forEach( (cell) => {
    cell.removeAttribute('class')
  })

  nextShapeCells.forEach( (cell) => {
    cell.removeAttribute('class')
  })

  resetVariables()
})

// ! options modal event listeners
elements.options.addEventListener('click', () => {
  openModal(elements.optionsModal)
  isPaused = true
})

elements.optionsClose.addEventListener('click', () => {
  closeModal(elements.optionsModal)
  isPaused = false
})

// ! game over modal
elements.gameOverClose.addEventListener('click', () => {
  closeModal(elements.gameOverModal)
})

// ! modal overlay event listener (to close modal)
elements.overlay.addEventListener('click', () => {
  const activeModals = document.querySelectorAll('.active')
  activeModals.forEach( activeModal => closeModal(activeModal))
  isPaused = false
})


