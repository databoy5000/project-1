// ? I tried including the setInterval inside a while loop, but it ran some code infintely. I thought that the while loop wouldn't loop until the setInterval ...
// ? 

// ? some functions need global variables to work so I've put the variables on top of the script document (instead of functions being there first). Is this a problem?
// ? I know functions are supposed to be on top of the script document. But what if you are modifying global variables with this function? Is it ok to have variables first and functions second? or should I call variables in as an argument instead?

// ! Other variables declaration
const movements = ['down','left','right','skipDown']
const rotationSideArray = ['rightSide','topSide','leftSide','bottomSide']

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
// function downwardCollisionCheck() {
//   return currentRotation.some( (cellIndex) => {
//     switch (true) {
//       case movementType === movements[1]: return (cellIndex % width === 0) || cells[cellIndex - 1].classList.contains('dead')
//       case movementType === movements[2]: return (cellIndex % width === width - 1) || cells[cellIndex + 1].classList.contains('dead')
//     }
//   })
// }

// function sidewayCollisionCheck() {}

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

function isSidesCollision() {
  if ( (currentShape.currentReferenceIndex % width < currentShape.leftBoundaryReferenceRemainder) ||
  (currentShape.currentReferenceIndex % width < currentShape.rightBoundaryReferenceRemainder) ) {
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

  let predictiveRotationIndex // outputs which rotation
  let predictiveRotation // outputs the chosen rotation index

  if (currentShape.currentRotationIndex >= (currentShape.allRotations().length - 1)) {
    predictiveRotationIndex = 0
    predictiveRotation = currentShape.rotationsArray(predictiveRotationIndex)
  } else {
    predictiveRotationIndex = currentShape.currentRotationIndex + 1
    predictiveRotation = currentShape.rotationsArray(predictiveRotationIndex)
  }

  const isTopCollision = predictiveRotation.some( (cellIndex) => {
    return (cellIndex < 0)
  })

  const isBottomCollision = predictiveRotation.some( (cellIndex) => {
    return (cellIndex >= width * height)
  })

  const isCollisionDeadShape = predictiveRotation.some( (cellIndex) => {
    return cells[cellIndex].classList.contains('dead')
  })

  const isSidesCollision = isSidesCollision()

  if (isTopCollision) {
    removeCurrentClass()
    currentShape.currentReferenceIndex = (currentShape.currentReferenceIndex % width) + (currentShape.topBoundaryReferenceHeight)
    currentRotation = currentShape.rotationsArray(predictiveRotationIndex)
  } else if (isBottomCollision) {
    removeCurrentClass()
  } else if (isCollisionDeadShape) {
    removeCurrentClass()
  } else if (isSidesCollision) {
    removeCurrentClass()
  }

}

if (evaluateConditions(
  [x > y, 1 + 2 === 3, true || false]
).length >= 2) {
  // You only get in here if less than 2 conditions are true. 
} 

function OLD_rotationBoundaryCheck() {

  let predictiveRotationIndex
  let predictiveRotation

  if (currentShape.currentRotationIndex >= (currentShape.allRotations().length - 1)) {
    predictiveRotationIndex = 0
    predictiveRotation = currentShape.rotationsArray(predictiveRotationIndex)
  } else {
    predictiveRotationIndex = currentShape.currentRotationIndex + 1
    predictiveRotation = currentShape.rotationsArray(predictiveRotationIndex)
  }

  const isSidewayCollision = predictiveRotation.some( (cellIndex) => {
    const condition = (cellIndex % width < currentShape.leftBoundaryReferenceRemainder) ||
    (cellIndex % width >= currentShape.rightBoundaryReferenceRemainder)
    if (condition) {
      console.log(cellIndex,(cellIndex % width < currentShape.leftBoundaryReferenceRemainder),(cellIndex % width >= currentShape.rightBoundaryReferenceRemainder))
    }
    return condition
  })

  console.log(isSidewayCollision)


  // const isCollision = predictiveRotation.some( (cellIndex) => {
  //   return (cellIndex < 0) || cells[cellIndex - width].classList.contains('dead') ||
  //   (cellIndex >= width * height) || cells[cellIndex + width].classList.contains('dead') ||
  //   (cellIndex % width === 0) || cells[cellIndex - 1].classList.contains('dead') ||
  //   (cellIndex % width === width - 1) || cells[cellIndex + 1].classList.contains('dead')
  // })

  // const isTopCollision = predictiveRotation.some( (cellIndex) => {
  //   return (cellIndex < 0) ||
  //   // switch (true) {
  //   //   case // : return cellIndex - currentShape.topBoundaryReferenceHeight < 0
  //   //   default: return cells[cellIndex - width].classList.contains('dead')
  //   // }
  //   if (cellIndex - width < 0) {
  //     return false
  //   } else {
  //     return cells[cellIndex - width].classList.contains('dead')
  //   }
  // })

  // const isBottomCollision = predictiveRotation.some( (cellIndex) => {
  //   return (cellIndex >= width * height) ||
  //   if (cellIndex + width >= width * height) {
  //     return false
  //   } else {
  //     return cells[cellIndex + width].classList.contains('dead')
  //   }
    
    
  // })

  const isSidewayCollision = predictiveRotation.some( (cellIndex) => {
    const condition = (cellIndex % width < currentShape.leftBoundaryReferenceRemainder) ||
    (cellIndex % width >= currentShape.rightBoundaryReferenceRemainder)
    if (condition) {
      console.log(cellIndex,(cellIndex % width < currentShape.leftBoundaryReferenceRemainder),(cellIndex % width >= currentShape.rightBoundaryReferenceRemainder))
    }
    return condition
  })

  console.log(isSidewayCollision)


  // const mappingCheck = predictiveRotation.map( (cellIndex) => {
  //   const top = (cellIndex < 0)

  //   switch () {
  //     case cellIndex - width < 0: return false
  //     case cellIndex 
  //   }

  //   const topDead = if (cellIndex - width < 0) {
  //     return false
  //     return cells[cellIndex - width].classList.contains('dead')
  //   }
    
    
    
  //   const bottom = (cellIndex >= width * height)
  //   const bottomDead = cells[cellIndex + width].classList.contains('dead')
  //   const left = cellIndex % width < currentShape.leftBoundaryReferenceRemainder
  //   const leftDead = cells[cellIndex - 1].classList.contains('dead')
  //   const right = (cellIndex % width > currentShape.rightBoundaryReferenceRemainder)
  //   const rightDead = cells[cellIndex + 1].classList.contains('dead')
  //   return [top,topDead,bottom,bottomDead,left,leftDead,right,rightDead]
  // })

  // console.log(mappingCheck)


  // if (isTopCollision) {

  // } else if (isBottomCollision) {

  // } else if isSidewayCollision {

  // } else {
  //   removeCurrentClass()
  //   currentShape.currentRotationIndex = predictiveRotationIndex
  //   currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
  // }


  // !if collition and space to rotate
  if (isCollision) {
    // rotate shape but change currentReferenceIndex

    // ! if (top boundary collision) {referenceIndex = acceptable index at top boundary}
    // ! else if (bottom boundary collision) {referenceIndex = acceptable index at bottom boundary}
    // ! else if (left boundary collision) {referenceIndex = acceptable index at left boundary}
    // ! else if (right boundary collision) {referenceIndex = acceptable index at right boundary}
    if (currentShape.currentReferenceIndex - (currentShape.topBoundaryReferenceHeight) < 0) {
      removeCurrentClass()
      currentShape.currentReferenceIndex = (currentShape.currentReferenceIndex % width) + (currentShape.topBoundaryReferenceHeight)
      currentRotation = currentShape.rotationsArray(predictiveRotationIndex)
    } else if ( (currentShape.currentReferenceIndex + currentShape.bottomBoundaryReferenceHeight) >= (width * height) ) {
      removeCurrentClass()
      currentShape.currentReferenceIndex -= width
      currentRotation = currentShape.rotationsArray(predictiveRotationIndex)
    } else if (currentShape.currentReferenceIndex % width < currentShape.leftBoundaryReferenceRemainder) {
      removeCurrentClass()
      currentShape.currentReferenceIndex += ( currentShape.leftBoundaryReferenceRemainder - (currentShape.currentReferenceIndex % width) )
      console.log('currentShape.currentReferenceIndex: ' + currentShape.currentReferenceIndex)
    } else if (currentShape.currentReferenceIndex % width > currentShape.rightBoundaryReferenceRemainder) {
      removeCurrentClass()
      currentShape.currentReferenceIndex -= ( width - (currentShape.currentReferenceIndex % width) )
    }
  } else {
    // ! if no collision, rotate shape at currentReferenceIndex

  }

  // if (currentShape.getCurrentSide() === rotationSideArray[0] || currentShape.getCurrentSide() === rotationSideArray[2]) {
  //   if (currentShape.currentReferenceIndex - (currentShape.topBoundaryReferenceHeight) < 0) {




  // // ! if (currentSide is rightSide or leftSide) {...}
  // // !    if (the next rotation blocks will be out of range) {}
  // if (currentShape.getCurrentSide() === rotationSideArray[0] || currentShape.getCurrentSide() === rotationSideArray[2]) {
  //   if (currentShape.currentReferenceIndex - (currentShape.topBoundaryReferenceHeight) < 0) {
  //     currentShape.currentReferenceIndex = (currentShape.currentReferenceIndex % width) + (currentShape.topBoundaryReferenceHeight)
  //     currentShape.currentRotationIndex = predictiveRotationIndex
  //     currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
  //     //  ! then rotate
  //   } else if ( (currentShape.currentReferenceIndex + currentShape.bottomBoundaryReferenceHeight) >= (width * height) ) {
  //     currentShape.currentReferenceIndex += width
  //   }
  // //  ! if (currentSide is topSide or bottomSide) {...}
  // // !    if (currentReferenceIndex is too close to left side && rotation activated) {update the reference index}
  // // !    else if (currentReferenceIndex is too close to right side) {update the reference index}
  // } else if (currentShape.getCurrentSide() === rotationSideArray[1] || currentShape.getCurrentSide() === rotationSideArray[3]) {
  //   if (currentShape.currentReferenceIndex % width < currentShape.leftBoundaryReferenceRemainder) {
  //     currentShape.currentReferenceIndex = ( currentShape.leftBoundaryReferenceRemainder - (currentShape.currentReferenceIndex % width) )
  //   } else if (currentShape.currentReferenceIndex % width > currentShape.rightBoundaryReferenceRemainder) {
  //     currentShape.currentReferenceIndex = ( width - (currentShape.currentReferenceIndex % width) )
  //   }
  // }

  // if (shape.currentReferenceIndex % width < shape.leftBoundaryReferenceRemainder) {
  //   shape.currentReferenceIndex = ( shape.leftBoundaryReferenceRemainder - (shape.currentReferenceIndex % width) )
  // } else if (shape.currentReferenceIndex % width > shape.rightBoundaryReferenceRemainder) {
  //   shape.currentReferenceIndex = ( width - (shape.currentReferenceIndex % width) )
  // } else if (shape.currentReferenceIndex - (shape.topBoundaryReferenceHeight) < 0) {
  //   shape.currentReferenceIndex = (shape.currentReferenceIndex % width) + (shape.topBoundaryReferenceHeight)
  // } else if ( (shape.currentReferenceIndex + shape.bottomBoundaryReferenceHeight) >= (width * height) ) {
  //   shape.currentReferenceIndex += width
  // }

  currentRotation.forEach( (cellIndex) => {
    cells[cellIndex].classList.add(currentShape.currentClass)
  })

  // moveShape(false,true)
    
  // let predictiveRotation = currentRotation
  // let predictiveRotationIndex = currentRotationIndex

  // if (currentRotationIndex === (currentRotation.length - 1)) {
  //   predictiveRotationIndex = 0
  //   predictiveRotation = currentRotation.rotationsArray(predictiveRotationIndex)
  // } else {
  //   predictiveRotationIndex = currentRotationIndex + 1
  //   predictiveRotation = currentRotation.rotationsArray(predictiveRotationIndex)
  // }
  
  // let isDownwardCollision = false
  // let isUpwardCollision = false
  // let isLeftCollision = false
  // let isRightCollision = false

  // isLeftCollision = predictiveRotation.some( (cellIndex) => {
  //   return (cellIndex % width === 0) || cells[cellIndex - 1].classList.contains('dead')
  // })

  // predictiveRotation.forEach( (cellIndex) => {
  //   if (currentRotation.currentReferenceIndex) {}
  // })
  


  // // ! 2 movementtype of collisions. Return true if there is a collision for each movementtype
  // if (movementType === movements[0]) {
  //   isDownwardCollision = currentRotation.some( (cellIndex) => {
  //     if ( (cellIndex + width) < (height * width) ) {
  //       return cells[cellIndex + width].classList.contains('dead') || !( (cellIndex + width) < (width * height) )
  //     } else {
  //       return !( (cellIndex + width) < (width * height) )
  //     }
  //   })
  // } else {
  //   isSidewayCollision = currentRotation.some( (cellIndex) => {
  //     switch (true) {
  //       case movementType === movements[1]: return (cellIndex % width === 0) || cells[cellIndex - 1].classList.contains('dead')
  //       case movementType === movements[2]: return (cellIndex % width === width - 1) || cells[cellIndex + 1].classList.contains('dead')
  //     }
  //   })
  // }
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
  rightSide() {
    return [this.currentReferenceIndex + 2,this.currentReferenceIndex + 1,this.currentReferenceIndex,this.currentReferenceIndex - 1]
  },
  topSide() {
    return [this.currentReferenceIndex - 20,this.currentReferenceIndex - 10,this.currentReferenceIndex,this.currentReferenceIndex + 10]
  },
  allRotations() {
    return [this.rightSide(),this.topSide()]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations()[arrayIndex]
  },
  getCurrentSide(rotationArrayIndex) {
    if (rotationArrayIndex === 0) {
      return 'rightSide'
    } else if (rotationArrayIndex === 1) {
      return 'topSide'
    }
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
