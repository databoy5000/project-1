// ? I tried including the setInterval inside a while loop, but it ran some code infintely. I thought that the while loop wouldn't loop until the setInterval ...
// ? 

// ? some functions need global variables to work so I've put the variables on top of the script document (instead of functions being there first). Is this a problem?
// ? I know functions are supposed to be on top of the script document. But what if you are modifying global variables with this function? Is it ok to have variables first and functions second? or should I call variables in as an argument instead?

// ! Other variables declaration
const movements = ['down','left','right','skipDown']

let dropNewShape = true
let intervalID = 0

let currentShape
let currentRotation
let currentRotationIndex = 0 // ! 0 is the default shape rotation to drop new shapes in the game
let idx = 0 // just for tests

// ? is it bad practice to update global variables in a function? would you rather pass the variable as an argument inside the function and re-assigne with the returned values? what would you do?
// ! Global variables but => to insert into shape objects as local functions
function moveRotateShape(movement) {
  console.log('moveRotateShape() movement is: ' + movement)

  console.log('currentShape.rotationsArray(currentRotationIndex) is: ' + currentShape.rotationsArray(currentRotationIndex))
  currentRotation.forEach( (blockIndex) => {
    cells[blockIndex].classList.remove(currentShape.currentClass)
  })

  // ? In this case, is it wise to update a global variable (as opposed to entering this global variable into the function as an argument and returning it to have its value re-assigned to the variable in question)?
  // ! Update currentShape.currentReferenceIndex global variable
  if (movement === movements[0]) {
    console.log('going down')
    console.log('currentShape.currentReferenceIndex is: ' + currentShape.currentReferenceIndex)
    currentShape.currentReferenceIndex += width
    console.log('currentShape.currentReferenceIndex is: ' + currentShape.currentReferenceIndex)
  } else if (movement === movements[1]) {
    currentShape.currentReferenceIndex -= 1
  } else if (movement === movements[2]) {
    currentShape.currentReferenceIndex += 1
  } else if (movement === movements[3]) { // placeholder for feature 'skipDown'
    return
  } else {
    return
  }

  currentRotation = currentShape.rotationsArray(currentRotationIndex)
  console.log('currentRotation: ' + currentRotation)
  
  currentRotation.forEach( (blockIndex) => {
    if (!movement) {
      cells[blockIndex].classList.add(currentShape.deadClass)
    } else {
      console.log(`blockIndex is: ${blockIndex}`)
      console.log(cells[blockIndex])
      cells[blockIndex].classList.add(currentShape.currentClass)
      console.log(cells[blockIndex].classList.add(currentShape.currentClass))
      console.log(cells[blockIndex])
    }
  })

}

// ! Global functions
function generateNewShape(currentRotationIndex) {
  const randomShapeIndex = Math.floor(Math.random() * shapesArray.length)
  const currentShape = shapesArray[randomShapeIndex]

  currentShape.currentReferenceIndex = currentShape.startIndex

  currentRotation = currentShape.rotationsArray(currentRotationIndex)

  currentRotation.forEach( (blockIndex) => {
    cells[blockIndex].classList.add(currentShape.currentClass)
  })

  return currentShape
}

function rowCheckToClear() {

  // ! Check lines from bottom to top
  for (let i = (width * height) ; i >= 0; i -= 10) {
    const rowArray = cells.slice(i - width,i)
    rowArray.every( (cell) => {
      cell.classList.contains('dead')
    })

    
    if (rowArray) {
      rowArray.forEach( (cell) => {
        cell.removeAttribute('class')
        // or rowArray.className = null
      })

      // shift all blocks above with class dead to += width
      cells.filter( (cell) => {
        return cell
      })
      cells.forEach( (cell,index) => {
        if (cell.classList.contains('dead')) {
          cells[index].classList.remove('dead')
          cells[index + width].classList.add('dead')
        }
      })
    }    
  }
  // When dead shapes have different styles
  // shapesArray.forEach( (shape) => {
  //   shape.currentClass
  // })
}

function checkTopRowCollision() {

//  what is the current shape?
// is one of its blocks out of range? (<0)

  currentRotation.blockIndexes.forEach()


  clearInterval(intervalID)


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

console.log(cells)
console.log(cells[0])


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

console.log('ishape: ' + iShape)
console.log('rightSide: ' + iShape.rightSide())
console.log('topSide: ' + iShape.topSide())
console.log('rotationsArray: ' + iShape.rotationsArray())

const shapesArray = [iShape]

console.log('just before the click')

elements.play.addEventListener('click', () => {

  console.log('just after the click')

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

  console.log('before set interval')

















  intervalID = setInterval( () => {

    // ? Why does VScode want me to stick a comma at the end of the currentShape declaration?
    // ! Define our variables of the shape currently dropping
    
    console.log('_________start_________')

    if (dropNewShape) {
      currentShape = generateNewShape(currentRotationIndex)
      console.log(currentShape.currentClass)
      dropNewShape = false
    }
    

    console.log(cells)
    console.log(cells[idx])
    idx++
    console.log(cells[idx])
    cells[idx].classList.add(currentShape.currentClass)
    console.log(cells[idx])



    console.log('currentRotation is: ' + currentRotation)
    console.log('currentShape.currentReferenceIndex is: ' + currentShape.currentReferenceIndex)

    const dropCheck = currentRotation.map( (blockIndex) => {

      // ! If (the next line is not out of range) && (the next line doesn't contain a dead shape) {drop it width down}
      if ( ( (blockIndex + width) <= (((height * width) - width) + (blockIndex % width)) ) && (cells[blockIndex + width].classList !== 'dead') ) {
        return true
      // ! If (the next line is out of range) || (the next line contains a dead shape) {mark shape class as dead}
      } else if ( ( (blockIndex + width) > (((height * width) - width) + (blockIndex % width)) ) || (cells[blockIndex + width].classList === 'dead') ) {
        return false
      }

    })

    console.log('dropCheck is: ' + dropCheck)

    if (dropCheck) {
      moveRotateShape(movements[0])
      console.log('movements[0] is: ' + movements[0])
      console.log('currentRotation is: ' + currentRotation)
      console.log('currentShape.currentReferenceIndex is: ' + currentShape.currentReferenceIndex)
    } else if (!dropCheck) {
      moveRotateShape(false)
      currentShape.currentReferenceIndex = null
      dropNewShape = true
    }

    rowCheckToClear()

  },1000)
















  document.addEventListener('keydown', (event) => {

    currentRotation.forEach( (blockIndex) => {

      // ? Here, would it be better to keep all ifs in series of else ifs or better to keep each separated?
      // ! If (upArrow key is pressed) && (the end of the shape.rotation() array is reached) {go back to the start of this array}
      if ( (event.key === 'ArrowUp') && (currentRotationIndex === (currentRotation.length - 1)) ) {
        currentRotationIndex = 0
        currentRotation = currentShape.rotationsArray(currentRotationIndex)
      } else {
        currentRotationIndex++
        currentRotation = currentShape.rotationsArray(currentRotationIndex)
      }

      // ! If (downArrow key is pressed) && (the shape blocks are not on the last line) {drop the shape down}
      if ( (event.key === 'ArrowDown') && !(blockIndex >= (width * height) - width) ) {
        moveRotateShape(movements[0])
      }

      // ! If (leftArrow key is pressed) && (the shape blocks are not on the left edge) {move the shape left}
      if ( (event.key === 'ArrowLeft') && !(blockIndex % width === 0) ) {
        moveRotateShape(movements[1])
      }

      // ! If (rightArrow key is pressed) && (the shape blocks are not on the right edge) {move the shape right}
      if ( (event.key === 'ArrowRight') && !(blockIndex % width === width - 1) ) {
        moveRotateShape(movements[2])
      }

    })

  })














})
