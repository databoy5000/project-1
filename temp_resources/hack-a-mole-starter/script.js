const tiles = Array.from(document.querySelectorAll('.grid div'))
const start = document.querySelector('#start')

let intervalID = 0

console.log(tiles)

start.addEventListener('click', () => {
  if (intervalID !== 0) {
    return
  }
  
  let playerPoints = 0
  let playerLives = 3
  let clicked = true
  let randomMoleIndex = null

  intervalID = setInterval(() => {
    if (!clicked) {
      playerLives--
      tiles[randomMoleIndex].classList.remove('mole')
    }
    clicked = false
    if (playerLives > 0) {
      randomMoleIndex = Math.floor(Math.random() * tiles.length)
      tiles[randomMoleIndex].classList.add('mole')

    } else {
      clearInterval(intervalID)
      alert(`Your final score is ${playerPoints}!`)
    }
  }, 2000)

  tiles.forEach( (tile) => {
    tile.addEventListener('click', () => {
      if (tile.classList.contains('mole')) {
        clicked = true
        playerPoints += 100
        tile.classList.remove('mole')
      }
    })
  })
})