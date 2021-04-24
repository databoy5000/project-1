

// My state, the player scores..
let playerScores = []
// My selectors..
const scoresList = document.querySelector('ol')
const playButton = document.querySelector('h3')

// ! TO remember about localStorage
// ? Before saving the LS, turn into string with JSON.stringify
// ? When getting from LS, turn into objects/array with JSON.parse
// ? Also, check LS exists before relying on it.

// ! Getting from localStorage
if (localStorage) {
  playerScores = JSON.parse(localStorage.getItem('playerScores')) || []
  console.log(playerScores)
  orderAndDisplayScores()
}


// When I click on the play button, get the users name, and how many
// apples they have (which is going to be their score..)
playButton.addEventListener('click', () => {
  const newName = prompt('By what name are you known?')
  const newScore = Number(prompt('How many apples do you possess?'))
  const player = { name: newName, score: newScore }
  // ? Updating my state
  playerScores.push(player)

  // ! Saving to localStorage
  // ? First check if LS exists.
  if (localStorage) {
    localStorage.setItem('playerScores', JSON.stringify(playerScores))
  }

  // ? Updating my DOM
  orderAndDisplayScores()
})



// A function to order and display whatever is currently stored in
// the playerScores variable.
function orderAndDisplayScores() {
  // Take the scores
  const array = playerScores
    .sort((playerA, playerB) => playerB.score - playerA.score)
  // this will give you something like..
  //?  [
  //?    { name: 'f1reb4llXL5', score: 10 },
  //?    { name: 'st1nGR4Y', score: 5 },
  //?    { name: 'ThUnd3Rb1rd', score: 1 }
  //?  ]
  // ..then mapping them into an array of html strings..
    .map(player => {
      return `<li>
        ${player.name} has <em>${player.score}</em> apples.
      </li>`
    })
  // and this will give you something like..
  //? [
  //?   '<li>f1reb4llXL5 has <em>10</em> apples.</li>',
  //?   '<li>st1nGR4Y has <em>5</em> apples.</li>',
  //?   '<li>ThUnd3Rb1rd has <em>1</em> apples.</li>'
  //? ]

  // Finally, turn them back into a string, and overwrite the html of
  // scoreslist with the updated scores, joined as a string so
  // I don't get any weird formatting.
  scoresList.innerHTML = array.join('')
}

