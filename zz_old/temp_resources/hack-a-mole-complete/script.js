// * Whack-A-Mole

// ? A #start button should start the game...

// ? When the game starts:
// ? Every 2 seconds, a new mole should appear in a random cell
// ? If the player clicks the mole, the mole is removed, and the player gets 100 points.
// ? If the player doesn't click the mole in time, the mole disappears, and the player loses a life.
// ? If 3 moles disappear without having been whacked, the game ends.
// ? When the game ends, alert the final score.

// ? Global variables
let lives = 3
let score = 0
let molePosition = 0
let intervalId = 0
const cells = document.querySelectorAll('.grid div')
const start = document.querySelector('#start')


// ? Add a click event to every cell
cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    // ! Check if the player just clicked mole
    if (cell.classList.contains('mole')) {
      score += 100
      cell.classList.remove('mole')
    }
  })
})

// ? Add a click event to my start button
start.addEventListener('click', () => {
  // ? This stops you from creating multiple set intervals
  if (intervalId !== 0) {
    return
  }

  // ? create a set interval that places a new mole every 2 seconds,
  // ? and changes the state of our game as we go.
  intervalId = setInterval(() => {
    // ! Checking lives
    if (cells[molePosition].classList.contains('mole')) {
      lives -= 1
      if (lives === 0) {
        // ? If no lives, reset my game
        resetGame()
        // ? Don't proceed beyond this point
        return
      }
    }
    // ! Updating the mole position
    cells[molePosition].classList.remove('mole')
    molePosition = Math.floor(Math.random() * cells.length)
    cells[molePosition].classList.add('mole')

  }, 1000)
})


// ? Little function for resetting our game--it resets all
// ? our global variables back to what they started as.
function resetGame() {
  lives = 3
  score = 0
  molePosition = 0
  intervalId = 0
  cells[molePosition].classList.remove('mole')
  clearInterval(intervalId)
  alert(`Final score ${score}`)
}


