const audioPlayer = document.querySelector('audio')
const tiles = Array.from(document.querySelectorAll('#soundboard button'))
const playButton = document.querySelector('#play-button')

console.log(tiles)

tiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    audioPlayer.src = `sounds/${tile.id}.wav`
    audioPlayer.play()
  })
})

// ! Playing all sounds..
let intervalId = 0

playButton.addEventListener('click', () => {
  if (intervalId !== 0) {
    return
  }
  // ? Play each sound, one by one
  let tileIndex = 0
  intervalId = setInterval(() => {
    if (tileIndex === tiles.length) {
      // ! Resetting everything so we can play again.
      clearInterval(intervalId)
      intervalId = 0
      tileIndex = 0
    } else {
      const tile = tiles[tileIndex]
      audioPlayer.src = `sounds/${tile.id}.wav`
      audioPlayer.play()
      tileIndex++
    }
  }, 500)
})


