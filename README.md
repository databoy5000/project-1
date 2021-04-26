### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive
# Vac-Man 
 

## Overview
This project is my first fully developped excercise at General Assembly's Software Immersive course.

The assignment was to create a grid-based game that could utilise array based logic, moving parts and variable diffuculty settings to be rendered in the browser, using HTML, CSS and JavaScript. The project deadline was to be completed individually, within one week.

From the list of games provided, I picked to re-create the tetris game to challenge my knowledge of recursive logic, functions and objects. The jargon utilised for javascript and this documentation is:
    - Shapes: refers to the tetraminos.
    - Rotation: refers to a tetramino rotation (in js: an array of usually 4 indexes).
    - Reference Index: each tetramino have a reference index to which all other block refer their position to.
    - Rotation Index: each shape display their blocks in different rotations, for which cell indexes are stored in an array. These different rotations are all stored into one array (of arrays). So a rotation index refers to a particular rotation within its array.
    - Cell Index: refers to the index of a partiocular cell within the game grid.
    - Dead Shape: refers to a shape that has fallen.


You can launch the game on GitHub pages [here](https://databoy5000.github.io/project-1/), or find the GitHub repo [here](https://github.com/databoy5000/project-1).

## Brief
- **Render a game in the browser**
- **Design a logic for player scoring, levels and game end**
- **Include separate HTML / CSS / JavaScript files**
- Stick with **KISS (Keep It Simple Stupid)** and **DRY (Don't Repeat Yourself)** principles
- Use **Javascript** for **DOM manipulation**
- **Deploy your game online**
- Use **semantic markup** for HTML and CSS


## Technologies used

- HTML
- CSS
- JavaScript
- Git and GitHub
- Google Fonts

## Approach

1. Defining the project scope to deliver an MVP
    - Deciding on the main data types to use for shapes, DOM manipulation and game logic
    - Grid game display within defined dimensions of the classic Tetris game
    - Collison detection with game boundaries and other fallen shapes
    - Shape (tetraminos) display on the grid
    - Shape gravity dropping the shape in intervals
    - Very basic CSS to display cells to play (and test) the game
2. Defining additional features to keep a logic (during MVP developement) which would accomodate the further add-ons.
    - Player scoring
    - Mutable buttons
    - Next shape display
    - Modal for options/instructions and game over
    - In game audio and sfx playback

### Board layout 
Using the DOM to manipulate HTML, I've created a 10 (width) x 20 (height) of proportional div (cells) which are stored in an array, using a for loop to dynamically create all 200 cells.

### Data types
1. Shapes
I've chosen objects to store shape properties and functions to manipulate their properties. I could've made the functions global and use let variables to store data, but I prefered having them within the object rather than in let variables for efficiency. I feel like it would've created a thick web of variable to untangle in debugging, too many parameters/arguments to enter in functions, and slow down the process of writting code. All shape objects to be stored in an array, from which a random index will be generated to pick a next shape.

2. DOM Elements
I found it easier to read and to refer to, when having all query selectors within one object.

3. Variable: const and let
Storing data in various ways to manipulate the general game mechanics, and toggle functions on and off.

### Shape Object
The initial state of a game object looks like the following:
```
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

### Game timing
Set interval

### Shape movement && gravity
General pattern:
Remove class of shape block
Update the current shape reference index
Add class shape to new position

### Collision detection 
This was the most challenging part. The logic that I followed is that I wanted a shape to be able to rotate wether it was colliding with an edge of the game boundaries (top, bottom, left, right) or with a dead shape, if there was space to fully rotate in it's new position.

I broke it down into the follwing steps:
  - Detect and treat collision types only if one of these collision turn true. If more than one collision are true, do not rotate the shape.
  - Defining collisions types and possible outcomes:
    - with top or bottom edge, if true:
      - correct shape predictive position up to 2 steps down (+width) or up (-width). If no collisions after 2 corrections make the predictive blocks positions the current shape coordinates.
    - with side edges, if true:
      - correct shape predictive position up to 2 steps left/right. If no collisions after 2 corrections make the predictive blocks positions the current shape coordinates.
    - with dead shapes, if true:
      - define the predictive shape's blocks positions and evluate if each of these corrections need to occure: shift down, up, right, left.
      - Then throw all of these corrections needing to occure, in an array ```const allCombinations```.
      - If more than one correction needs occuring, add to ```allCombinations```, all combinations needing to occure 


  - Define boundary collision detection individually. Separately, I treated collisions like so:
    - Top and bottom boundary collision detection: out of range cell index.
    - Sideway boundary collision detection: made with predictive rotation, then comparing remainders of a current vs. predictive shape position.
  - Define dead shape collision detection individually
    -When the current shape's rotation prediction enters in collision with a dead shape above/below, correct the shape one step down or one step up.
    -When the current shape's rotation prediction enters in collision with a dead shape left/right, correct the shape one step left/right.

Then, I started merging







### Variables 


### Non-game screens




## Screenshots



## Bugs ![Frightened cat](/images/cat-frightened.png)



## Potential future features




## Lessons learned
- In hinsight, I could've used
- post top/bottom ocrrection, check for collision with dead shape (but outcome so rare). essentially, I couldn've looped in a while loop all conditions evaluation up to 2 times. but not sure of the bugs it could introduce. Could've used elements from dead collision corrections


## Artwork and credit


