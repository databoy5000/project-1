
const elements = {
  playerDisplay: document.querySelector('.player1'),
  aiDisplay: document.querySelector('.player2'),
  buttons: document.querySelectorAll('.choice'),
  resultDisplay: document.querySelector('.result'),
}

// ? console log out the choice
elements.buttons.forEach((button) => {
  // ? Add an event listener
  button.addEventListener('click', () => {
    // ? Set the player choice
    elements.playerDisplay.innerHTML = button.innerHTML

    // ? Set the computer / AI choice
    // Get a random number -- random index
    const choices = ['rock', 'paper', 'scissors']
    const randomIndex = Math.floor(Math.random() * choices.length)
    elements.aiDisplay.innerHTML = choices[randomIndex]

    // ? Display the winner
    // ? Compare the choices, to see who run, and then set the text.
    // ! adding these variables for readability
    const player = elements.playerDisplay.innerHTML
    const ai = elements.aiDisplay.innerHTML

    // ? Draw:
    if (player === ai) {
      elements.resultDisplay.innerHTML = 'It is a draw..'
    // ? Player wins:
    } else if (
      (player === 'rock' && ai === 'scissors') ||
      (player === 'scissors' && ai === 'paper') ||
      (player === 'paper' && ai === 'rock')
    ) {
      elements.resultDisplay.innerHTML = 'Player wins!'
    // ? Computer wins:
    } else {
      elements.resultDisplay.innerHTML = 'AI wins!'
    }

  })
})

