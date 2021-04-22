

const elements = {
  play: document.querySelector('#play'),
  grid: document.querySelector('#grid'),
  pause: document.querySelector('#pause'),
  resume: document.querySelector('#resume'),
}

  elements.pause.addEventListener('click', event => {
    console.log('__pausing game')
    // event.preventDefault()
    isPaused = true
  })