### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive

# Le Space Tetraminos 


## Overview
This project is my first fully developped excercise at General Assembly's Software Immersive course.

The assignment was to create a grid-based game that could utilise array based logic, moving parts and variable difficulty settings to be rendered in the browser, using HTML, CSS and JavaScript. The project deadline was to be completed individually, within one week.

From the list of games provided, I picked to re-create the tetris game to challenge my knowledge of recursive logic, functions and objects. The jargon utilised for javascript and this documentation is as follows:
- **Shapes**: refers to the tetraminos.
- **Rotation**: refers to a tetramino rotation (in js: an array of usually 4 cell indexes).
- **Reference Index**: each tetramino have a reference cell index (depending on its position within the game grid) to which all other block refer their position from.
- **Rotation Index**: each shape display their blocks in different rotations, for which cell indexes are stored in an array. These different rotations are all stored into one array (of arrays). So a rotation index refers to a particular rotation within its array.
- **Cell Index**: refers to the index of a partiocular cell within the game grid.
- **Dead Shape**: refers to a shape that has fallen.

You can launch the game on GitHub pages [here](https://databoy5000.github.io/project-1/), and access the GitHub repo [here](https://github.com/databoy5000/project-1).


## Brief

- Render a game in the browser.
- Design a logic for the gameplay, player scoring, levels and game end.
- Include separate HTML / CSS / JavaScript files.
- Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles.
- Use Javascript for DOM manipulation and game logic.
- Deploy the game online.
- Use semantic markup for HTML and CSS.


## Technologies used

- HTML
- CSS
- JavaScript
- Git and GitHub
- Google Fonts


## Approach

1. <ins>MVP/project scope</ins>
    - Defining the main data types to use for shapes, DOM manipulation and the game logic.
    - Grid game display within the dimensions of the classic Tetris game.
    - Collison detection with the game boundaries and fallen shapes.
    - Shape (tetraminos) display on the game grid.
    - Shape gravity: dropping the shape in intervals.
    - Basic CSS to display cells allowing to play (and test) the game.
2. <ins>Additional features</ins>
    - Collision correction.
    - Player scoring.
    - Mutable buttons.
    - Next shape display.
    - Modal for options/instructions and game over.
    - In game audio and sfx playback.
    - Hard drop predictions and prediction display on key hold.


### Board layout 
Using the DOM to manipulate HTML, I've created a 10 (width) x 20 (height) of proportional div (cells) which are stored in an array, using a for loop to dynamically create all 200 cells.

<img src="./screenshots/game_grid.png" alt="Basic Grid Display" width="200"/>

### Data types
1. <ins>Shapes</ins>

For a single shape, each of its properties are stored within an object with functions to manipulate the properties. All shape objects are stored in an array, from which a random index is generated to pick the next shape/object.

The initial state of a shape looks like the following:
```js
const jReverseShape = {
  startIndex: 15,
  currentReferenceIndex: null,
  currentRotationIndex: 0,
  nextShapeReferenceIndex: [2,4,5,6],
  currentClass: 'j-reverse',
  deadClass: 'dead',
  rightSide(referenceIndex) {
    return [referenceIndex + 10,referenceIndex,referenceIndex + 1,referenceIndex + 2]
  },
  topSide(referenceIndex) {
    return [referenceIndex + 1,referenceIndex,referenceIndex - 10,referenceIndex - 20]
  },
  leftSide(referenceIndex) {
    return [referenceIndex - 10,referenceIndex,referenceIndex - 1,referenceIndex - 2]
  },
  bottomSide(referenceIndex) {
    return [referenceIndex - 1,referenceIndex,referenceIndex + 10,referenceIndex + 20]
  },
  allRotations(referenceIndex) {
    return [this.leftSide(referenceIndex),this.topSide(referenceIndex),this.rightSide(referenceIndex),this.bottomSide(referenceIndex)]
  },
  rotationsArray(arrayIndex) {
    return this.allRotations(this.currentReferenceIndex)[arrayIndex]
  },
  predictiveRotationCoordinates(referenceIndex = this.currentReferenceIndex,rotationIndex = this.currentRotationIndex) {
    return this.allRotations(referenceIndex)[rotationIndex]
  },
}
```

2. <ins>DOM Elements</ins>

All DOM elements were stored into one object to keep things organised into one place.

3. <ins>Variables: `const` and `let`<ins>

The majority of variables are declared at the top end of the script to set their scope as global and allow these to interact with multiple functions and the game logic. `let` were used for mutating numbers, booleans and arrays which were useful to direct the game logic (e.g. to isolate certain game logic compartments when a new shape enters the game, to pause the game, to bypass event listeners when the game is paused).


### Game start, generating the current shape & the next shape
After the game starts, all classes within the grid are removed and two shapes are generated with the `function generateNewShape(isCurrentShape)`:
1. the `currentShape` where `isCurrentShape === true`,
2. and the `nextShape(false)` where `isCurrentShape === false`.

`isCurrentShape` boolean allows the function to output for both different outcomes (current and next shape) and to pass the shape objects into variables.


### Game timing
The game timed loop is managed with the `setInterval()` method where most of the game logic is stored.

The elements nested within `setInterval()` such as variables and functions have the following roles:
- Generating new and next shapes
- Displaying/moving the shape
- Clearing full rows
- Level increase, line and score count
- Audio SFX playback at specific cues

### Event listeners (click, keydown and change)
They allow the player to interact with the game's following elements:
- Buttons:
  - Start/restart/pause the game
  - Open/close modals
- Arrow Keys: 
  - Move/rotate shapes
  - `e.preventDefault()` to prevent the window from scrolling whilst playing.


### Shape gravity
At each timed intervals, the following pattern is used to display a shape movement:
- Remove class of shape blocks (using the `forEach()` method)
- Update the current shape reference index and other blocks, by increasing their position by width (+10)
- Add shape class to the new position

### Collision detection 
I wanted was for shapes to be able to rotate and correct its position if it was colliding with an edge of the game boundaries (top, bottom, left, right) or with a dead shape, if ever there was space to fully rotate in it's new position. For this I needed to:
1. Output a prediction of the shape's next rotation
2. Evaluate if collisions are true. For collisions with game boundaries, the corrections are predictable so the calculations are fixed/straighforward.
3. The collisions with dead shapes are unpredictable, because the game grid keeps mutating. So if a collision comes true, correct the shape's predictive position up to 2 cells left/right/top/down in a range of all possible combinations, as all shape's cells to not extend further than 2 blocks away from the reference cell.
    - Detect the cell in collision, find its positiopn relative to the shape's reference cell (`referenceIndex`) and output its correction in an array collecting all possible corrections.
    - Add all corrections to each other in all possible combinations and push them into a new array.
    - Apply these combinations one by one to the predictive `referenceIndex` and check all shape cells for collisions.
    - If there are no collisions turn the predictive shape into the current shape. Else, do nothing.

```js
// resultsArray length should be inferior or equal to 2 and should include either of the following corrections: 1, -1, 10, -10
// example: const resultsArray = [-1,10]

const allCombinations = resultsArray.map( initialCombination => initialCombination)

if (resultsArray.length > 1) {
  for (let i = 0; i < resultsArray.length - 1; i++) {
    allCombinations.push(resultsArray[i] * 2) // expected output: -2
    for (let j = i + 1; j < resultsArray.length; j++) {
      allCombinations.push(resultsArray[i] + resultsArray[j]) // expected output: 9, 20
      allCombinations.push(resultsArray[j] * 2)
    }
  }
} else if (resultsArray.length === 1) {
  allCombinations.push(resultsArray[0] * 2)
}

// expected final output: allCombinations = [-2,-1,9,10,20]
```


### Scoring
All scoring elements are consolidated into one object, as they all depend on each other as the game goes. The scoring functions were implemented based on the past Nintendo tetris scoring system.

Actions which interact with scoring:
- soft dropping a shape (arrow down) increases the score
- clearing lines increases lines count and levels
- levels increase the `setInterval()` interval timing.


### Modal
Creating a modal was handy to display instructions and options (audio levels) for the user's experience.


## Screenshots

### In-game screen
![Image 1](/screenshots/spacetetris_ingame.png)

### Game lost screen
![Image 2](/screenshots/spacetetris_gamelost.png)


## Possible Improvements
- Hard drop and display of shape drop location on shift key hold.
- Hold shape.
- Shape rotation limitation on collisions: ideally to have the shape to rotate no more than 'n' times when in collision with dead shapes and/or bottom boundary and corrected (else the player can rotate infinitely without fully dropping and killing the shape if they rotate fast enough).
- Localstorage scoreboard for players to compete with each other and/or remember their best scores.
- Adding a full audio playlist.
- Better volume mixing of the SFX audio .


## Lessons learned
I can see how naming your code correctly is very important for a larger scale project. I've had to refactor a few functions and variables when I re-read my code and felt confused. There's room for improvement in coding preparation.


Sudo coding: I went into too much detail (in actual JS syntax) which slowed me down when writing and translating it into code to test. Using the JS syntax logic but in plain english will defintely help to better paint the bigger picture including all of its building blocks.


On the final version of the game, I found that a lot of `let` variables led to slower reading when troubleshooting and/or adding features. Also, I could've made use of the `removeEventListener()` method to reduce the number of `let` variables. I'm curious to see how much more efficient it would've been to use React.


The CSS flicker animation on the page header is very demanding on the CPU and generates a lot of heat. Perhaps I could be exploiting the less demanding properties such as translate().