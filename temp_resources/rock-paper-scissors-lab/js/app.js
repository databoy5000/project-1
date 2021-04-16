// * Write your code in here!

// ! task 1
// const elements = {
//   playerOne: document.querySelector('.player1'),
//   playerTwo: document.querySelector('.player2'),
//   result: document.querySelector('.result'),
//   choices: Array.from(document.querySelectorAll('.choice')),
//   reset: document.querySelector('.reset'),
// }
// const calculateWinner = (p1,p2) => {
//   if (p1 === p2) {
//     return 'This is a tie!'
//   } else if (p1 + 1 === p2 || (p1 === 2 && p2 === 0) ) {
//     return 'The AI wins!'
//   } else {
//     return 'You win!'
//   }
// }

// elements.choices.forEach( (choice,index) => {
//   choice.addEventListener('click', () => {
//     elements.playerOne.innerHTML = choice.innerHTML
//     const playerTwoIndex = Math.floor(Math.random() * elements.choices.length)
//     elements.playerTwo.innerHTML = elements.choices[playerTwoIndex].innerHTML
//     elements.result.innerHTML = calculateWinner(index,playerTwoIndex)
//   })
// })

// elements.reset.addEventListener('click', () => {
//   elements.playerOne.innerHTML = null
//   elements.playerTwo.innerHTML = null
//   elements.result.innerHTML = null
// })

// ! task 2

const elements = {
  playerOne: document.querySelector('.player1'),
  playerTwo: document.querySelector('.player2'),
  result: document.querySelector('.result'),
  choices: Array.from(document.querySelectorAll('.choice')),
  reset: document.querySelector('.reset'),
}

const calculateWinner = (p1,p2) => {
  if (p2 === 0) {
    return [0,4]
  } else if (p2 === 1) {
    return [1,5]
  } else if (p2 === 2) {
    return [2,6]
  } else if (p2 === 3) {
    return [3,7]
  } else if (p2 === 4) {
    return [4,8]
  }

  console.log('p1: ' + p1)
  console.log('p2: ' + p2)
  if (p1 === p2) {
    return 'This is a tie!'
  } else if ( (p2).includes(p1 + 1) || (p2).includes(p1 + 3) ) {
    return 'The AI wins!'
  } else {
    return 'You win!'
  }
}

const concatChoices = elements.choices.concat(elements.choices)

elements.choices.forEach( (choice,index) => {
  choice.addEventListener('click', () => {
    elements.playerOne.innerHTML = choice.innerHTML
    const playerTwoIndex = Math.floor(Math.random() * concatChoices.length)
    elements.playerTwo.innerHTML = concatChoices[playerTwoIndex].innerHTML
    elements.result.innerHTML = calculateWinner(index,playerTwoIndex)
  })
})

elements.reset.addEventListener('click', () => {
  elements.playerOne.innerHTML = null
  elements.playerTwo.innerHTML = null
  elements.result.innerHTML = null
})