const elements = {
  screens: Array.from(document.querySelectorAll('.screen')),
  start: document.querySelector('#start'),
  reset: document.querySelector('#reset'),
  timer: document.querySelector('#timer')
}

window.addEventListener('load', function() {
  setInterval( () => {
    const date = new Date()
    elements.screens[0].innerHTML = date.toLocaleTimeString()
  },1000)

  let countdown = 10
  let intervalID = 0

  elements.start.addEventListener('click', () => {
    
    if (intervalID) {
      return
    }

    intervalID = setInterval( () => {
      countdown--
      console.log(countdown)
      elements.screens[1].innerHTML = countdown

      // elements.start.addEventListener('click', () => {
      //   clearTimeout(intervalID)
      // })

      if (countdown === 0) {
        clearInterval(intervalID)
        elements.timer.classList.add('ringing')
      }

    },1000)
  })

  elements.reset.addEventListener('click', () => {
    countdown = 10
    elements.screens[1].innerHTML = countdown
    elements.timer.classList.remove('ringing')
    clearInterval(intervalID)
  })
})