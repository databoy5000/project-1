// ! I don't understand why the below didn't work.
// ! console.log(elements.workit) would return undefined. Do you know why?
// function customSelect(string) {
//   Array.from(document.querySelectorAll(string))
// }

// const elements = {
//   workIt: customSelect('.work-it'),
//   harder: customSelect('.harder'),
//   makeIt: customSelect('.makeIt'),
//   better: customSelect('.better'),
//   doIt: customSelect('.doIt'),
//   faster: customSelect('.faster'),
//   makesUs: customSelect('.makeUs'),
//   stronger: customSelect('.stronger'),
//   moreThan: customSelect('.moreThan'),
//   ever: customSelect('.ever'),
//   hour: customSelect('.hour'),
//   after: customSelect('.after'),
//   our: customSelect('.our'),
//   workIs: customSelect('.workIs'),
//   never: customSelect('.never'),
//   over: customSelect('.over'),
// }

const elements = {
  workIt: Array.from(document.querySelectorAll('.work-it')),
  harder: Array.from(document.querySelectorAll('.harder')),
  makeIt: Array.from(document.querySelectorAll('.make-it')),
  better: Array.from(document.querySelectorAll('.better')),
  doIt: Array.from(document.querySelectorAll('.do-it')),
  faster: Array.from(document.querySelectorAll('.faster')),
  makesUs: Array.from(document.querySelectorAll('.makes-us')),
  stronger: Array.from(document.querySelectorAll('.stronger')),
  moreThan: Array.from(document.querySelectorAll('.more-than')),
  ever: Array.from(document.querySelectorAll('.ever')),
  hour: Array.from(document.querySelectorAll('.hour')),
  after: Array.from(document.querySelectorAll('.after')),
  our: Array.from(document.querySelectorAll('.our')),
  workIs: Array.from(document.querySelectorAll('.work-is')),
  never: Array.from(document.querySelectorAll('.never')),
  over: Array.from(document.querySelectorAll('.over')),
  start: document.querySelector('#start'),
  loop: document.querySelector('#loop'),
  stop: document.querySelector('#stop'),
  display: document.querySelector('.display'),
  emojis: Array.from(document.querySelectorAll('.emojis')),
  lyrics: document.querySelector('#lyrics'),
}

const emojisArray = [' 🏋🏻‍♀️ ',' 😓 ',' 👆🏻 ',' 🙌🏻 ',' 🕺🏻 ',' 💨 ',' 🤝 ',' 🦾 ',' 👆🏻 ',' 🕺🏻 ',' ⏰ ',' 🤌🏻 ',' 👉🏻 ',' ✋🏻 ',' ✍🏻 ',' ✋🏻 ',' 🕺🏻 ']
const propertiesArray = Object.entries(elements)
// const metronomeIndexMax = propertiesArray.length - 6
const metronomeIndexMax = propertiesArray.length - (propertiesArray.length - 16)

console.log(elements.emojis[0])

// Play sounds on 4x4
// ! Could you do the below with an arrow method?
for (let i = 0; i < metronomeIndexMax; i++) {
  propertiesArray[i][1][1].addEventListener('click', () => {
    propertiesArray[i][1][2].play()
  })
}

// Chorus, loopDaddy & Stop
elements.start.addEventListener('click', () => {

  let metronomeIndex = 0
  let loopToInfinity = false

  elements.display.classList.remove('off')

  // click to loop
  elements.loop.addEventListener('click', () => {
    loopToInfinity = true
  })

  // successive audio playback
  const intervalID = setInterval(() => {
    if (!loopToInfinity && metronomeIndex < metronomeIndexMax) {
      // ! The line below logs an error 'GET .../favicon.ico 404 (Not Found)' which I don't understand.
      // ! It doesn't seem to be dependant from the object property. Please, could you explain why?
      propertiesArray[metronomeIndex][1][2].play()
      elements.lyrics.innerHTML = propertiesArray[metronomeIndex][1][1].innerHTML
      elements.emojis[0].innerHTML = emojisArray[metronomeIndex]
      elements.emojis[1].innerHTML = emojisArray[metronomeIndex]

      if (metronomeIndex === 0 ) {
        propertiesArray[metronomeIndex][1][1].classList.add('lightup')
      } else {
        propertiesArray[metronomeIndex - 1][1][1].classList.remove('lightup')
        propertiesArray[metronomeIndex][1][1].classList.add('lightup')
      }
      
      metronomeIndex++
    } else if (loopToInfinity) {
      propertiesArray[metronomeIndex][1][2].play()
      elements.lyrics.innerHTML = propertiesArray[metronomeIndex][1][1].innerHTML
      metronomeIndex++
      if (metronomeIndex === metronomeIndexMax) {
        metronomeIndex = 0
      }
    } else {
      clearInterval(intervalID)
      propertiesArray[metronomeIndex][1][1].classList.remove('lightup')
    }
  },470)

  // stop button
  elements.stop.addEventListener('click', () => {
    clearInterval(intervalID)
    loopToInfinity = false
    elements.display.innerHTML = null
    elements.display.classList.add('off')
  })
})

// ! I ran out of time last night and couldn't figure out how to have the loop not accelerate when I double click on the button. Please, could you show me what i should've done?
// ! There a few things left to fix but I ran out of time to look into them