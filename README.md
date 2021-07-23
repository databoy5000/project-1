### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive
 
# Le Space Tetriminos
 
 
## Overview
This project is my first fully developed exercise at General Assembly's Software Immersive course.
 
The assignment was to create a grid-based game that could utilise array-based logic, moving parts and variable difficulty settings to be rendered in the browser, using HTML, CSS and JavaScript. The project deadline was to be completed individually, within one week.
 
I chose to recreate the Tetris game to challenge my knowledge of recursive logic, functions and objects. The jargon utilised for JavaScript and this documentation is as follows:
- **Shapes**: refers to the tetrominoes.
- **Rotation**: refers to a tetromino rotation (in js: an array of usually 4 cell indexes).
- **Reference Index**: each tetromino has a reference cell index (depending on its position within the game grid) to which all other blocks refer their position.
- **Rotation Index**: each shape displays its blocks in different rotations, for which cell indexes are stored in an array. These different rotations are all stored into one array (of arrays). So a rotation index refers to a particular rotation within its array.
- **Cell Index**: refers to the index of a particular cell within the game grid.
- **Dead Shape**: refers to a shape that has fallen.
 
You can launch the game on GitHub pages [here](), and access the GitHub repo [here](https://github.com/databoy5000/project-1).
 
 
## Brief
 
- Render a game in the browser.
- Design a logic for the gameplay, player scoring, levels and game end.
- Include separate HTML / CSS / JavaScript files.
- Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles.
- Use JavaScript for DOM manipulation and game logic.
- Deploy the game online.
- Use semantic markup for HTML and CSS.
 
## Live Demo, Useful Links
 
[<img alt="Live Demo" src="https://imgur.com/P2NkQ7Q.png" height="35px">](https://databoy5000.github.io/project-1/)
[<img alt="Follow databoy5000" src="https://imgur.com/QCKp4U4.png" height="35px">](https://github.com/login?return_to=%2Fdataboy5000)
[<img alt="Project Repository" src="https://imgur.com/URAXZ08.png" height="35.5px">](https://github.com/databoy5000/project-1)
 
## Contents
- [Overview](#overview)
- [Brief](#brief)
- [Live Demo, Useful Links](#live-demo-useful-links)
- [Contents](#contents)
- [Technologies used](#technologies-used)
- [Approach](#approach)
 * [Board layout](#board-layout)
 * [Data types](#data-types)
 * [Game start, generating the current shape & the next shape](#game-start--generating-the-current-shape---the-next-shape)
 * [Game timing](#game-timing)
 * [Event listeners (click, keydown and change)](#event-listeners--click--keydown-and-change-)
 * [Shape gravity](#shape-gravity)
 * [Collision detection](#collision-detection)
 * [Scoring](#scoring)
 * [Modal](#modal)
- [Screenshots](#screenshots)
 * [In-game screen](#in-game-screen)
 * [Game lost screen](#game-lost-screen)
- [Possible Improvements](#possible-improvements)
- [Lessons learned](#lessons-learned)
- [Artwork and Credits](#artwork-and-credits)
 
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
   - Collision detection with the game boundaries and fallen shapes.
   - Shape (tetrominoes) display on the game grid.
   - Shape gravity: dropping the shape in intervals.
   - Basic CSS to display cells allowing to play (and test) the game.
2. <ins>Additional features</ins>
   - Collision correction.
   - Player scoring.
   - Mutable buttons.
   - Next shape display.
   - Modal for options/instructions and game over.
   - In-game audio and SFX playback.
   - Hard drop predictions and prediction display on key hold.
 
 
### Board layout
Using the DOM to manipulate HTML, I've created a 10 (width) x 20 (height) of proportional div (cells) which are stored in an array, using a for loop to dynamically create all 200 cells.
 
<img src="https://imgur.com/Xz8diZs.png" alt="Basic Grid Display" width="200"/>
 
### Data types
1. <ins>Shapes</ins>
 
For a single shape, each of its properties is stored within an object with functions to manipulate the properties. All shape objects are stored in an array, from which a random index is generated to pick the next shape/object.
 
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
 
The majority of variables are declared at the top end of the script to set their scope as global and allow them to interact with multiple functions and the game logic. `let` were used for mutating numbers, booleans and arrays which were useful to direct the game logic (e.g. to isolate certain game logic compartments when a new shape enters the game, to pause the game, to bypass event listeners when the game is paused).
 
 
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
At each timed interval, the following pattern is used to display a shape’s movement:
- Remove class of shape blocks (using the `forEach()` method)
- Update the current shape reference index and other blocks, by increasing their position by width (+10)
- Add shape class to the new position
 
### Collision detection
When a shape was colliding with an edge of the grid boundaries (top, bottom, left, right) or with a dead shape, I wanted it to rotate + correct its position given that there was available space to fully rotate into its predicted new position. To achieve this, I needed to:
1. Output a prediction of the shape's next rotation
2. Evaluate if collisions are true. For collisions with game boundaries, the corrections are predictable so the calculations are fixed/straightforward.
3. The collisions with dead shapes are unpredictable because the game grid keeps mutating. So, if a collision comes true, correct the shape's predictive position up to 2 cells left/right/top/down in a range of all possible combinations, as all shape's cells do not extend further than 2 blocks away from the reference cell.
   - Detect the cell in collision, find its position relative to the shape's reference cell (`referenceIndex`) and output its correction in an array collecting all possible corrections.
   - Add all corrections to each other in all possible combinations and push them into a new array.
   - Apply these combinations one by one to the predictive `referenceIndex` and check all shape cells for collisions.
   - If there are no collisions, turn the predictive shape into the current shape. Else, do nothing.
 
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
All scoring elements are consolidated into one object, as they all depend on each other as the game goes. The scoring functions were implemented based on the past Nintendo Tetris scoring system.
 
Actions that interact with scoring:
- soft dropping a shape (arrow down) increases the score
- clearing lines increases lines count and levels
- levels increase the `setInterval()` interval timing.
 
 
### Modal
Creating a modal was handy to display instructions and options (audio levels) for the user's experience.
 
 
## Screenshots
 
### In-game screen
![Gameplay screenshot](https://imgur.com/HqYnyNn.png)
 
### Game lost screen
![Game-over screenshot](https://imgur.com/DXaLQ9G.png)
 
 
## Possible Improvements
- L shaped tetrominoes to perform a more advanced correction on rotations where the shape falls in a corridor large of 3 horizontal indexes.
- Hard drop and display of shape drop location on shift key hold.
- Hold shape feature.
- Shape rotation limitation on collisions: ideally to have the shape rotate no more than 'n' times when in collision with dead shapes and/or bottom boundary and corrected (else the player can rotate infinitely without fully dropping and killing the shape if they rotate fast enough).
- Localstorage scoreboard for players to compete with each other and/or remember their best scores.
- Adding a full audio playlist.
- Better volume mixing of the SFX audio.
 
## Challenges
### Planning
To complete this first project, it roughly took me x1.5 time longer than expected. I also had a list of features in the stretch goals which I was enthusiastic to have as part of the MVP, which naturally ended up shifting in the stretch goals ½ way through the project.
 
### DOM Manipulation
I had a hard time combining `setInterval()` with the event listeners as I encountered bugs when the game was paused + rotations occurred or when rotations occurred after a shape was turned dead and the next shape wasn’t yet appeared into the grid. I tried using `removeEventListener` but ended using a custom boolean variable `pauseEventFunctions` to only allow rotations whilst a shape is dropping in the grid (and not dead).
 
### Shape correction
I got stuck on creating a correction logic for roughly 2 days. It took me 5 top to bottom redrafts of the shape correction section (from line 327: `if (topCollisionResult || bottomCollisionResult) {...}`) to finally have efficient code which wouldn’t generate bugs on colliding rotations.
 
### Flexbox
Having the page responsive was important to have the page be as elegant as possible. It took me some time to adjust to flexbox and having sections’ positions to interact and adjust with each other logically, depending on the window’s size.
 
## Wins
### Shape correction
I’m very pleased with the code that detects & corrects a shape’s position on rotations. It is fairly simpler than what I initially drafted, therefore makes it efficient. Parts of it could be refactored.
 
### CSS
I’m fairly pleased with the styling and how flexbox gets elements to adjust depending on the window’s size. The responsiveness and elements’ positions are interacting how I intended them to.
 
## Key Learnings
I can see how naming your code correctly is very important for a larger-scale project. I've had to refactor a few functions and variables when I re-read my code and felt confused. There's room for improvement in coding preparation.
 
 
Pseudo coding: I went into too much detail (in actual JS syntax) which slowed me down when writing and translating it into code to test. Using the JS syntax logic but in plain English will help to better paint the bigger picture including all of its building blocks.
 
 
On the final version of the game, I found that a lot of `let` variables led to slower reading when troubleshooting and/or adding features. Also, I could've made use of the `removeEventListener()` method to reduce the number of `let` variables. I'm curious to see how much more efficient it would've been to use React.
 
 
The CSS flicker animation on the page header is very demanding on the CPU and generates a lot of heat. Perhaps I could be exploiting the less demanding properties such as translate().
 
## Artwork and Credits
- Audio: [Blue Hawaii - No One Like You](https://www.youtube.com/watch?v=IDJT_SDrQl4)
- Audio SFX:
 - [Sound 1](https://freesound.org/people/Breviceps/sounds/450613/)
 - [Sound 2](https://freesound.org/people/TolerableDruid6/sounds/458416/)
 - [Sound 3](https://freesound.org/people/cabled_mess/sounds/350905/)
 - [Sound 4](https://freesound.org/people/shapingwaves/sounds/362375/)
- Background Image: [123rf.com](https://www.123rf.com/photo_102980186_stock-vector-astronaut-walking-dog-in-a-space-suit-pop-art-retro-vector-illustration-kitsch-vintage-drawing.html)

