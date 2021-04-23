
// * Grid Games  ▀ ▁ ▇ ▀ ✨

// ? Grid where all the cells go
const grid = document.querySelector('.grid')
// ? Width of my row (number of cells in one row)
const width = 5
// ? Create an array of all my cells
const cells = []
// ? Initial value of harry.
let harry = 0

// ? Loop width ** 2 times, creating a cell each time.
for (let index = 0; index < width ** 2; index++) {
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

  // ! This example stops you from walking through any wall!

  // ? 's' moves harry down -- only if he's not on the last row!
  if (key === 's' && !(harry > (width ** 2) - width - 1)) {
    cells[harry].classList.remove('harry')
    harry += width
    cells[harry].classList.add('harry')
  // ? 'a' moves harry left -- but only if he's not on the left column!
  } else if (key === 'a' && !(harry % width === 0)) {
    cells[harry].classList.remove('harry')
    harry -= 1
    cells[harry].classList.add('harry')
  // ? 'd' moves harry right -- but only if he's not on the right column!
  } else if (key === 'd' && !(harry % width === width - 1)) {
    cells[harry].classList.remove('harry')
    harry += 1
    cells[harry].classList.add('harry')
  // ? 'w' moves harry up -- but only if he's not in the top row!
  } else if (key === 'w' && !(harry < width)) {
    cells[harry].classList.remove('harry')
    harry -= width
    cells[harry].classList.add('harry')
  }
})

