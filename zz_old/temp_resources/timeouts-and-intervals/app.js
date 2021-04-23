
// * ⌚️ Timeouts and intervals. ⏰

// ? setTimeout
// Its a global function you can use anywhere.
// ? - First arg is a callback function
// ? - Second arg is a number in milliseconds

// This will run the callback after 2 seconds.
// setTimeout(() => {
//   // ? This gets run after 2 seconds.
//   console.log('hello world')

//   // ? We make another timeout
//   setTimeout(() => {
//     // ? This gets run after 1 seconds.
//     // ? Once this setTimeout is called,
//     // ? and 3 seconds after the page is loaded.
//     console.log('Goodbye world')
//   }, 1000)

// }, 2000)


// * Intervals
// ? Just like setTimeout, but will run EVERY number in milliseconds.

// setInterval(() => {
//   console.log('Repeated hello')
// }, 1000)


// ! Example
// ? Run every second.
// ? Print out a 🍌 3 times
// ? Print out a 🥭 3 times
// ? Print out 🍎 forever
let counter = 0

// ? Think of setinterval like a WHILE loop.
// ? based on time.
// setInterval(() => {
//   if (counter < 3) {
//     console.log('🍌')
//   } else if (counter < 6) {
//     console.log('🥭')
//   } else {
//     console.log('🍎')
//   }
//   counter++
// }, 1000)


// ! Example
// ? Run every second.
// ? Print out a 🍌 3 times
// ? Print out a 🥭 3 times
// ? STOP after mangoes are done.

let counter2 = 0

// ? setInterval returns a unique interval ID,
// ? which is a number.
// ? You need this ID to say what shuold stop.
const intervalID = setInterval(() => {
  if (counter2 < 3) {
    console.log('🍌')
  } else if (counter2 < 6) {
    console.log('🥭')
  } else {
    // ? How to stop your interval..
    clearInterval(intervalID)
    // ! clearInterval will continue the current 'loop',
    // ! but stop after that.

    // ! So often its useful to return after
    return
  }
  console.log('hello')
  counter2++
}, 1000)


// * Dates
// ? This will be useful fo rthe lab..
// ? Creating a new date
const date = new Date()
console.log(date.toLocaleTimeString())
