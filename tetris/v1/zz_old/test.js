// function OLD_rotationBoundaryCheck() {

//   let predictiveRotationIndex
//   let predictiveRotation

//   if (currentShape.currentRotationIndex >= (currentShape.allRotations().length - 1)) {
//     predictiveRotationIndex = 0
//     predictiveRotation = currentShape.rotationsArray(predictiveRotationIndex)
//   } else {
//     predictiveRotationIndex = currentShape.currentRotationIndex + 1
//     predictiveRotation = currentShape.rotationsArray(predictiveRotationIndex)
//   }

//   const isSidewayCollision = predictiveRotation.some( (cellIndex) => {
//     const condition = (cellIndex % width < currentShape.leftBoundaryReferenceRemainder) ||
//     (cellIndex % width >= currentShape.rightBoundaryReferenceRemainder)
//     if (condition) {
//       console.log(cellIndex,(cellIndex % width < currentShape.leftBoundaryReferenceRemainder),(cellIndex % width >= currentShape.rightBoundaryReferenceRemainder))
//     }
//     return condition
//   })

//   console.log(isSidewayCollision)


//   // const isCollision = predictiveRotation.some( (cellIndex) => {
//   //   return (cellIndex < 0) || cells[cellIndex - width].classList.contains('dead') ||
//   //   (cellIndex >= width * height) || cells[cellIndex + width].classList.contains('dead') ||
//   //   (cellIndex % width === 0) || cells[cellIndex - 1].classList.contains('dead') ||
//   //   (cellIndex % width === width - 1) || cells[cellIndex + 1].classList.contains('dead')
//   // })

//   // const isTopCollision = predictiveRotation.some( (cellIndex) => {
//   //   return (cellIndex < 0) ||
//   //   // switch (true) {
//   //   //   case // : return cellIndex - currentShape.topBoundaryReferenceHeight < 0
//   //   //   default: return cells[cellIndex - width].classList.contains('dead')
//   //   // }
//   //   if (cellIndex - width < 0) {
//   //     return false
//   //   } else {
//   //     return cells[cellIndex - width].classList.contains('dead')
//   //   }
//   // })

//   // const isBottomCollision = predictiveRotation.some( (cellIndex) => {
//   //   return (cellIndex >= width * height) ||
//   //   if (cellIndex + width >= width * height) {
//   //     return false
//   //   } else {
//   //     return cells[cellIndex + width].classList.contains('dead')
//   //   }
    
    
//   // })

//   const isSidewayCollision = predictiveRotation.some( (cellIndex) => {
//     const condition = (cellIndex % width < currentShape.leftBoundaryReferenceRemainder) ||
//     (cellIndex % width >= currentShape.rightBoundaryReferenceRemainder)
//     if (condition) {
//       console.log(cellIndex,(cellIndex % width < currentShape.leftBoundaryReferenceRemainder),(cellIndex % width >= currentShape.rightBoundaryReferenceRemainder))
//     }
//     return condition
//   })

//   console.log(isSidewayCollision)


//   // const mappingCheck = predictiveRotation.map( (cellIndex) => {
//   //   const top = (cellIndex < 0)

//   //   switch () {
//   //     case cellIndex - width < 0: return false
//   //     case cellIndex 
//   //   }

//   //   const topDead = if (cellIndex - width < 0) {
//   //     return false
//   //     return cells[cellIndex - width].classList.contains('dead')
//   //   }
    
    
    
//   //   const bottom = (cellIndex >= width * height)
//   //   const bottomDead = cells[cellIndex + width].classList.contains('dead')
//   //   const left = cellIndex % width < currentShape.leftBoundaryReferenceRemainder
//   //   const leftDead = cells[cellIndex - 1].classList.contains('dead')
//   //   const right = (cellIndex % width > currentShape.rightBoundaryReferenceRemainder)
//   //   const rightDead = cells[cellIndex + 1].classList.contains('dead')
//   //   return [top,topDead,bottom,bottomDead,left,leftDead,right,rightDead]
//   // })

//   // console.log(mappingCheck)


//   // if (isTopCollision) {

//   // } else if (isBottomCollision) {

//   // } else if isSidewayCollision {

//   // } else {
//   //   removeCurrentClass()
//   //   currentShape.currentRotationIndex = predictiveRotationIndex
//   //   currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
//   // }


//   // !if collition and space to rotate
//   if (isCollision) {
//     // rotate shape but change currentReferenceIndex

//     // ! if (top boundary collision) {referenceIndex = acceptable index at top boundary}
//     // ! else if (bottom boundary collision) {referenceIndex = acceptable index at bottom boundary}
//     // ! else if (left boundary collision) {referenceIndex = acceptable index at left boundary}
//     // ! else if (right boundary collision) {referenceIndex = acceptable index at right boundary}
//     if (currentShape.currentReferenceIndex - (currentShape.topBoundaryReferenceHeight) < 0) {
//       removeCurrentClass()
//       currentShape.currentReferenceIndex = (currentShape.currentReferenceIndex % width) + (currentShape.topBoundaryReferenceHeight)
//       currentRotation = currentShape.rotationsArray(predictiveRotationIndex)
//     } else if ( (currentShape.currentReferenceIndex + currentShape.bottomBoundaryReferenceHeight) >= (width * height) ) {
//       removeCurrentClass()
//       currentShape.currentReferenceIndex -= width
//       currentRotation = currentShape.rotationsArray(predictiveRotationIndex)
//     } else if (currentShape.currentReferenceIndex % width < currentShape.leftBoundaryReferenceRemainder) {
//       removeCurrentClass()
//       currentShape.currentReferenceIndex += ( currentShape.leftBoundaryReferenceRemainder - (currentShape.currentReferenceIndex % width) )
//       console.log('currentShape.currentReferenceIndex: ' + currentShape.currentReferenceIndex)
//     } else if (currentShape.currentReferenceIndex % width > currentShape.rightBoundaryReferenceRemainder) {
//       removeCurrentClass()
//       currentShape.currentReferenceIndex -= ( width - (currentShape.currentReferenceIndex % width) )
//     }
//   } else {
//     // ! if no collision, rotate shape at currentReferenceIndex

//   }

//   // if (currentShape.getCurrentSide() === rotationSideArray[0] || currentShape.getCurrentSide() === rotationSideArray[2]) {
//   //   if (currentShape.currentReferenceIndex - (currentShape.topBoundaryReferenceHeight) < 0) {




//   // // ! if (currentSide is rightSide or leftSide) {...}
//   // // !    if (the next rotation blocks will be out of range) {}
//   // if (currentShape.getCurrentSide() === rotationSideArray[0] || currentShape.getCurrentSide() === rotationSideArray[2]) {
//   //   if (currentShape.currentReferenceIndex - (currentShape.topBoundaryReferenceHeight) < 0) {
//   //     currentShape.currentReferenceIndex = (currentShape.currentReferenceIndex % width) + (currentShape.topBoundaryReferenceHeight)
//   //     currentShape.currentRotationIndex = predictiveRotationIndex
//   //     currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
//   //     //  ! then rotate
//   //   } else if ( (currentShape.currentReferenceIndex + currentShape.bottomBoundaryReferenceHeight) >= (width * height) ) {
//   //     currentShape.currentReferenceIndex += width
//   //   }
//   // //  ! if (currentSide is topSide or bottomSide) {...}
//   // // !    if (currentReferenceIndex is too close to left side && rotation activated) {update the reference index}
//   // // !    else if (currentReferenceIndex is too close to right side) {update the reference index}
//   // } else if (currentShape.getCurrentSide() === rotationSideArray[1] || currentShape.getCurrentSide() === rotationSideArray[3]) {
//   //   if (currentShape.currentReferenceIndex % width < currentShape.leftBoundaryReferenceRemainder) {
//   //     currentShape.currentReferenceIndex = ( currentShape.leftBoundaryReferenceRemainder - (currentShape.currentReferenceIndex % width) )
//   //   } else if (currentShape.currentReferenceIndex % width > currentShape.rightBoundaryReferenceRemainder) {
//   //     currentShape.currentReferenceIndex = ( width - (currentShape.currentReferenceIndex % width) )
//   //   }
//   // }

//   // if (shape.currentReferenceIndex % width < shape.leftBoundaryReferenceRemainder) {
//   //   shape.currentReferenceIndex = ( shape.leftBoundaryReferenceRemainder - (shape.currentReferenceIndex % width) )
//   // } else if (shape.currentReferenceIndex % width > shape.rightBoundaryReferenceRemainder) {
//   //   shape.currentReferenceIndex = ( width - (shape.currentReferenceIndex % width) )
//   // } else if (shape.currentReferenceIndex - (shape.topBoundaryReferenceHeight) < 0) {
//   //   shape.currentReferenceIndex = (shape.currentReferenceIndex % width) + (shape.topBoundaryReferenceHeight)
//   // } else if ( (shape.currentReferenceIndex + shape.bottomBoundaryReferenceHeight) >= (width * height) ) {
//   //   shape.currentReferenceIndex += width
//   // }

//   currentRotation.forEach( (cellIndex) => {
//     cells[cellIndex].classList.add(currentShape.currentClass)
//   })

//   // moveShape(false,true)
    
//   // let predictiveRotation = currentRotation
//   // let predictiveRotationIndex = currentRotationIndex

//   // if (currentRotationIndex === (currentRotation.length - 1)) {
//   //   predictiveRotationIndex = 0
//   //   predictiveRotation = currentRotation.rotationsArray(predictiveRotationIndex)
//   // } else {
//   //   predictiveRotationIndex = currentRotationIndex + 1
//   //   predictiveRotation = currentRotation.rotationsArray(predictiveRotationIndex)
//   // }
  
//   // let isDownwardCollision = false
//   // let isUpwardCollision = false
//   // let isLeftCollision = false
//   // let isRightCollision = false

//   // isLeftCollision = predictiveRotation.some( (cellIndex) => {
//   //   return (cellIndex % width === 0) || cells[cellIndex - 1].classList.contains('dead')
//   // })

//   // predictiveRotation.forEach( (cellIndex) => {
//   //   if (currentRotation.currentReferenceIndex) {}
//   // })
  


//   // // ! 2 movementtype of collisions. Return true if there is a collision for each movementtype
//   // if (movementType === movements[0]) {
//   //   isDownwardCollision = currentRotation.some( (cellIndex) => {
//   //     if ( (cellIndex + width) < (height * width) ) {
//   //       return cells[cellIndex + width].classList.contains('dead') || !( (cellIndex + width) < (width * height) )
//   //     } else {
//   //       return !( (cellIndex + width) < (width * height) )
//   //     }
//   //   })
//   // } else {
//   //   isSidewayCollision = currentRotation.some( (cellIndex) => {
//   //     switch (true) {
//   //       case movementType === movements[1]: return (cellIndex % width === 0) || cells[cellIndex - 1].classList.contains('dead')
//   //       case movementType === movements[2]: return (cellIndex % width === width - 1) || cells[cellIndex + 1].classList.contains('dead')
//   //     }
//   //   })
//   // }
// }














//         const switchToSide = currentShape.getCurrentSide(predictiveRotationIndex)      

//         let isCollision = true
        
//         while (isCollision) {
//           predictiveRotation.forEach( (cellIndex) => {
//             if (cellIndex.classList.contains('dead')) {

//               if ( (switchToSide === rotationSideArray[0]) || (switchToSide === rotationSideArray[1]) ) {

//                 if ( (cellIndex < currentShape.currentReferenceIndex) && (predictiveRotation += width) ) {
//                   predictiveRotation += width
//                 }
                
//                 if (cellIndex > currentShape.currentReferenceIndex) {
//                   predictiveRotation -= width
//                 }

//               }  else if ( (switchToSide === rotationSideArray[2]) || (switchToSide === rotationSideArray[3]) ) {

//                 if (cellIndex < currentShape.currentReferenceIndex) {
//                   predictiveRotation += 1
//                 }
                
//                 if (cellIndex > currentShape.currentReferenceIndex) {
//                   predictiveRotation -= 1
//                 }
//               }
//             }
//           })

//           const remainingCollisions = predictiveRotation.filter( (cellIndex) => {
//             return cellIndex.classList.contains('dead')
//           })

//           if (remainingCollisions.length <= 0) {
//             isCollision = false
//           }
//         }


// const old_iShape = {
//   startIndex: 4,
//   currentReferenceIndex: null,
//   currentRotationIndex: 0,
//   currentClass: 'i',
//   deadClass: 'dead',
//   leftBoundaryReferenceRemainder: 2,
//   rightBoundaryReferenceRemainder: 8,
//   topBoundaryReferenceHeight: width * 2,
//   bottomBoundaryReferenceHeight: width * 1,
//   rightSide() {
//     return [this.currentReferenceIndex + 2,this.currentReferenceIndex + 1,this.currentReferenceIndex,this.currentReferenceIndex - 1]
//   },
//   topSide() {
//     return [this.currentReferenceIndex - 20,this.currentReferenceIndex - 10,this.currentReferenceIndex,this.currentReferenceIndex + 10]
//   },
//   allRotations() {
//     return [this.rightSide(),this.topSide()]
//   },
//   rotationsArray(arrayIndex) {
//     return this.allRotations()[arrayIndex]
//   },
//   getCurrentSide(rotationArrayIndex) {
//     if (rotationArrayIndex === 0) {
//       return 'rightSide'
//     } else if (rotationArrayIndex === 1) {
//       return 'topSide'
//     }
//   },
// }


// const iShape = {
//   startIndex: 4,
//   currentReferenceIndex: null,
//   currentRotationIndex: 0,
//   currentClass: 'i',
//   deadClass: 'dead',
//   leftBoundaryReferenceRemainder: 2,
//   rightBoundaryReferenceRemainder: 8,
//   topBoundaryReferenceHeight: width * 2,
//   bottomBoundaryReferenceHeight: width * 1,
//   rightSide(referenceIndex) {
//     return [referenceIndex + 2,referenceIndex + 1,referenceIndex,referenceIndex - 1]
//   },
//   topSide(referenceIndex) {
//     return [referenceIndex - 20,referenceIndex - 10,referenceIndex,referenceIndex + 10]
//   },
//   allRotations(referenceIndex) {
//     return [this.rightSide(referenceIndex),this.topSide(referenceIndex)]
//   },
//   rotationsArray(arrayIndex) {
//     return this.allRotations(this.currentReferenceIndex)[arrayIndex]
//   },
//   getCurrentSide(rotationArrayIndex) {
//     if (rotationArrayIndex === 0) {
//       return 'rightSide'
//     } else if (rotationArrayIndex === 1) {
//       return 'topSide'
//     }
//   },
//   predictiveRotationCoordinates(referenceIndex,rotationIndex) {
//     return this.allRotations(referenceIndex)[rotationIndex]
//   },
// }




// else if (collisionDeadShapeResult) {

//   console.log('__inside collisionDeadShapeResult')      

//   let isCollision = true
  
//   // ! entering a while loop to calculate how much a shape has to shift
//   while (isCollision) {

//     // ! for each cells of the predictive shape which is in collision with a dead shape
//     predictiveRotation.forEach( (deadCellIndex) => {
//       if (cells[deadCellIndex].classList.contains('dead')) {

//         // ! if making a vertical shape rotation
//         if ( (switchToSide === rotationSideArray[0]) || (switchToSide === rotationSideArray[1]) ) {

//           console.log('__inside TOP/BOTTOM rotation prediction')
//           // ! shift down width steps (collision above)
//           if (deadCellIndex < currentShape.currentReferenceIndex) {
//             predictiveReferenceIndex = currentShape.currentReferenceIndex + width
//           }
          
//           // ! shift up width steps (collision below)
//           if (deadCellIndex > currentShape.currentReferenceIndex) {
//             predictiveReferenceIndex = currentShape.currentReferenceIndex - width
//           }

//           predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)
          
//           if (isBottomCollision(predictiveRotation) || isTopCollision(predictiveRotation)) {
//             collisionErrors++
//           }

//           if (isCollisionDeadShape(predictiveRotation)) {
//             predictionCorrectionCount++
//           }

//         // ! if making a horizontal shape rotation
//         }  else if ( (switchToSide === rotationSideArray[2]) || (switchToSide === rotationSideArray[3]) ) {

//           console.log('__inside LEFT/RIGHT rotation prediction')

//           // ! shift right 1 steps (collision left)
//           if (deadCellIndex % width < currentShape.currentReferenceIndex % width) {
//             predictiveReferenceIndex++
//           }

//           // ! shift right 1 steps (collision left)
//           if (deadCellIndex % width > currentShape.currentReferenceIndex % width) {
//             predictiveReferenceIndex--
//           }
          
//           predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)
//           console.log('currentRotation: ' + currentRotation)
//           console.log('currentReferenceIndex: ' + currentShape.currentReferenceIndex)
//           console.log('predictiveRotation: ' + predictiveRotation)

//           if (isSidesCollision(predictiveRotation)) {
//             collisionErrors++
//           }
          
//           if (isCollisionDeadShape(predictiveRotation)) {
//             predictionCorrectionCount++
//           }
//         }
//       }
//     })

//     // ! make isCollision false to get out of the correction while loop
//     // ! a shape can have up to 2 blocks away from its referenceIndex. so on the prediction correction count, if more than 2 corrections occure, don't rotate the shape
//     // ! collision errors: they occure when a shape correction forces the predictive shape against an edge (but breaking the shape)
//     console.log('ive been here')
//     console.log(collisionErrors)
//     console.log(predictionCorrectionCount)

//     if (collisionErrors > 0 || predictionCorrectionCount > 2) {
//       isCollision = false
//       return
//     }
//     // ! check if there are still collisions to rectify
//     const remainingCollisions = predictiveRotation.filter( (cellIndex) => {
//       return cells[cellIndex].classList.contains('dead')
//     })

//     console.log(remainingCollisions)

//     // ! if no collisions to fix remain, keep in the while loop and carry on, else update the validated rotations
//     if (remainingCollisions.length <= 0) {
      
//       removeCurrentClass()
//       currentShape.currentReferenceIndex = predictiveReferenceIndex
//       currentShape.currentRotationIndex = predictiveRotationIndex
//       currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
//       addCurrentClass()

//       isCollision = false
//     }
//   }







  



















//   else if (collisionDeadShapeResult) {

//     console.log('__inside collisionDeadShapeResult')      

//     let isCollision = true
    
//     // ! entering a while loop to calculate how much a shape has to shift
//     while (isCollision) {

//       // ! counts the number of rounds/loops of corrections occured. if more than 2, no correction needs to occure
//       let correctionRoundCount = 0
//       correctionRoundCount++

//       // ! prediction correction counts the number times that a shape has been moved of 1 increment.
//       if (predictionCorrectionCount > 2 && correctionRoundCount > 2) {
//         isCollision = false
//         return
//       } else if (predictionCorrectionCount <= 2 &&  correctionRoundCount > 2) {

//       }

//       // ! if making a vertical shape rotation
//       if ( (switchToSide === rotationSideArray[0]) || (switchToSide === rotationSideArray[1]) ) {

//         console.log('__inside TOP/BOTTOM rotation prediction')
//         // ! shift down width steps (collision above)
//         if (cellIndex < currentShape.currentReferenceIndex) {
//           predictiveReferenceIndex = currentShape.currentReferenceIndex + width
//         }
        
//         // ! shift up width steps (collision below)
//         if (cellIndex > currentShape.currentReferenceIndex) {
//           predictiveReferenceIndex = currentShape.currentReferenceIndex - width
//         }

//         predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)
        
//         if (isBottomCollision(predictiveRotation) || isTopCollision(predictiveRotation)) {
//           collisionErrors++
//         }

//         if (isCollisionDeadShape(predictiveRotation)) {
//           predictionCorrectionCount++
//         }

//       // ! if making a horizontal shape rotation
//       }  else if ( (switchToSide === rotationSideArray[2]) || (switchToSide === rotationSideArray[3]) ) {

//         console.log('__inside LEFT/RIGHT rotation prediction')

//         // ! checks for lateral collisions and corrects
//         const correctionValue = sidewayCorrection(currentRotation,predictiveRotation)

//         if (correctionValue) {
//           predictiveReferenceIndex += correction
//           predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)
//           predictionCorrectionCount++
//         }

//         // ! after correction, count if there is still a collision with a dead shape and go for one more round
//         if (isCollisionDeadShape(predictiveRotation)) {
//           predictionCorrectionCount++
//         }
//       }
//     }

//       // ! make isCollision false to get out of the correction while loop
//       // ! a shape can have up to 2 blocks away from its referenceIndex. so on the prediction correction count, if more than 2 corrections occure, don't rotate the shape
//       // ! collision errors: they occure when a shape correction forces the predictive shape against an edge (but breaking the shape)
//       console.log('ive been here')
//       console.log(collisionErrors)
//       console.log(predictionCorrectionCount)

//       if (collisionErrors > 0 || predictionCorrectionCount > 2) {
//         isCollision = false
//         return
//       }
//       // ! check if there are still collisions to rectify
//       const remainingCollisions = predictiveRotation.filter( (cellIndex) => {
//         return cells[cellIndex].classList.contains('dead')
//       })

//       console.log(remainingCollisions)

//       // ! if no collisions to fix remain, keep in the while loop and carry on, else update the validated rotations
//       if (remainingCollisions.length <= 0) {
        
//         removeCurrentClass()
//         currentShape.currentReferenceIndex = predictiveReferenceIndex
//         currentShape.currentRotationIndex = predictiveRotationIndex
//         currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
//         addCurrentClass()

//         isCollision = false
//       }
//     }







//     console.log('__inside collisionDeadShapeResult')

//     let isCollision = true
//     let loopCounts = 0
    
//     // ! entering a while loop to calculate how much a shape has to shift
//     while (isCollision) {

//       predictiveRotation.forEach( (deadCellIndex) => {

//         if (cells[deadCellIndex].classList.contains('dead')) {

//           // ! prediction correction counts the number times that a shape has been moved of 1 increment.
//           if (loopCounts > 2 && correctionOccurence > 2) {

//             isCollision = false
//             return

//           } else if (loopCounts <= 2 || correctionOccurence <= 2) {

//             removeCurrentClass()
//             currentShape.currentReferenceIndex = predictiveReferenceIndex
//             currentShape.currentRotationIndex = predictiveRotationIndex
//             currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
//             addCurrentClass()

//             isCollision = false
//             return

//           } // end of correction counts

//           predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)
              
//           if (isBottomCollision(predictiveRotation) || isTopCollision(predictiveRotation)) {
//             collisionErrors++
//           }

//         // ! if making a horizontal shape rotation
//         } else if ( (switchToSide === rotationSideArray[2]) || (switchToSide === rotationSideArray[3]) ) {

//           console.log('__inside LEFT/RIGHT rotation prediction')


          
//           // ! recalculate the predictive rotation coordinates
//           predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)

//           // ! checks for lateral collisions and correct
//           const correctionValue = sideEdgesCorrection(currentRotation,predictiveRotation)

//           if (correctionValue) {
//             predictiveReferenceIndex += correction
//             predictiveRotation = currentShape.predictiveRotationCoordinates(predictiveReferenceIndex,predictiveRotationIndex)
//             predictionCorrectionCount++
//           }
//         }
//       }
//     })

//     // ! counts the number of rounds/loops of corrections occured. if more than 2, no correction needs to occure
//     correctionRoundCount++

//   }

//     // ! check if there are still collisions to rectify
//     const remainingCollisions = predictiveRotation.filter( (cellIndex) => {
//       return cells[cellIndex].classList.contains('dead')
//     })

//     console.log(remainingCollisions)

//     // ! if no collisions to fix remain, keep in the while loop and carry on, else update the validated rotations
//     if (remainingCollisions.length <= 0) {
      
//       removeCurrentClass()
//       currentShape.currentReferenceIndex = predictiveReferenceIndex
//       currentShape.currentRotationIndex = predictiveRotationIndex
//       currentRotation = currentShape.rotationsArray(currentShape.currentRotationIndex)
//       addCurrentClass()

//       isCollision = false
//     }
//   }

// ! Grid Properties/elements
const width = 10
const height = 20

const cells = []

// ! Generate the grid
for (let index = 0; index < width * height; index++) {
  cells.push(index)
}



// chunk = cells.slice()


// while (i < n) {
//   chunk = cells.slice(i, i += width)
//   cells.push(
//     chunk.reduce((s, n) => s + n) / chunk.length
//   )
// }

const cellsToClear = []

for (let i = (width * height) ; i >= 10; i -= 10) {
  const rowArray = cells.slice(i - width, i)
  cellsToClear.push(rowArray)

}

const stuff = cellsToClear.filter( (row) => {
  return row.every( (cell) => {
    return Math.floor(cell / 10)
  })
})

console.log(stuff)

// const filteredIndexes = cells
//   .reduce( (accumulator, cell) => {
//     return 
//   },[])