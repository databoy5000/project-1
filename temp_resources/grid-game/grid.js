
// * Grid Games  ▀ ▁ ▇ ▀ ✨

// ? Grid where all the cells go
const grid = document.querySelector('.grid')
// ? Width of my row (number of cells in one row)
const width = 10
const height = 20
// ? Create an array of all my cells
const cells = []
// ? Initial value of harry.
let harry = 0

// ? Loop width ** 2 times, creating a cell each time.
for (let index = 0; index < width * height; index++) {
  // ? Creating a new cell
  const div = document.createElement('div')
  grid.appendChild(div)
  // ? Really nice way of numbering grid elements
  // ? to visualise what's happening (helpful for debugging)
  div.innerHTML = index
  // ? If you want dynamically sized grids, look no further!
  // div.style.width = `${100 / width}%`
  // div.style.height = `${100 / width}%`
  // ? Push all my cells to this new array of cells
  cells.push(div)
}

cells[harry].classList.add('harry')

// ? Moving harry to the right forever and throwing an error..
// setInterval(() => {
//   // ! Extremely common pattern..
//   cells[harry].classList.remove('harry')
//   harry = harry + 1
//   cells[harry].classList.add('harry')
// }, 1000)

// ? Moving harry based on the keystrokes
document.addEventListener('keydown', (event) => {
  // ? Get the keyboard character typed from event.key
  const key = event.key

  // ! This one has no wall detection, so you can go off the grid.
  // ! That comes in grid2.js and grid3.js
  // ? 's' moves harry down
  if (key === 's') {
    cells[harry].classList.remove('harry')
    harry += width
    cells[harry].classList.add('harry')
  // ? 'a' moves harry left
  } else if (key === 'a') {
    cells[harry].classList.remove('harry')
    harry -= 1
    cells[harry].classList.add('harry')
  // ? 'd' moves harry right
  } else if (key === 'd') {
    cells[harry].classList.remove('harry')
    harry += 1
    cells[harry].classList.add('harry')
  // ? 'w' moves harry up
  } else if (key === 'w') {
    cells[harry].classList.remove('harry')
    harry -= width
    cells[harry].classList.add('harry')
  }
})

















