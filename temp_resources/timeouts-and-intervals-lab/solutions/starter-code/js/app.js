// * Part 1, the watch
const screen = document.querySelector('#watch .screen')
const startTime = new Date()
screen.innerHTML = startTime.toLocaleTimeString()

setInterval(() => {
  const currentTime = new Date()
  screen.innerHTML = currentTime.toLocaleTimeString()
}, 1000)


// * Part 2, the timer

const timer = {
  container: document.querySelector('#timer'),
  screen: document.querySelector('#timer .screen'),
  startButton: document.querySelector('#start'),
  resetButton: document.querySelector('#reset'),
}

let counter = 10
let intervalId = 0 // ? intervalID is now a global variable

timer.startButton.addEventListener('click', () => {
  // ! If the intervalId is not zero, I should not be
  // ! able to set another interval.
  if (intervalId) {
    return
  }

  // ? This is going to decrease my timer clock.
  // ? Now intervalId gets reassigned each time I click.
  intervalId = setInterval(() => {
    // ? Decrease my counter by 1 each time.
    counter--
    timer.screen.innerHTML = counter
    // ? Add the ringing class to the timer.
    if (counter === 0) {
      timer.container.classList.add('ringing')
    }
  }, 200)
})

timer.resetButton.addEventListener('click', () => {
  // ? Remove the class ringing
  timer.container.classList.remove('ringing')
  // ? Reset the counter to 10
  counter = 10
  // ? Clear the interval
  clearInterval(intervalId)
  // ? Set the inner html of my screen
  timer.screen.innerHTML = counter
  // ? Set the intervalId to 0
  intervalId = 0
})

