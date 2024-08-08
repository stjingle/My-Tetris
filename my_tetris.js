// get a random integer between the range of [min,max]
function eazy_game(minimum_P, maximum_x) {
    minimum_P = Math.ceil(minimum_P);
    maximum_x = Math.floor(maximum_x);

    return Math.floor(Math.random() * (maximum_x - minimum_P + 1)) + minimum_P;
  }

  // generate a new tetromino menu

  function make_my_Menu() {
    const menu = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (menu.length) {
      const rand = eazy_game(0, menu.length - 1);
      const piece= menu.splice(rand, 1)[0];
      my_tetromino_Menu.push(piece);
    }
  }

  // get next tetromino in the menu
  function eaz_ytetromino() {
    if (my_tetromino_Menu.length === 0) {
      make_my_Menu();
    }

    const piece= my_tetromino_Menu.pop();
    const matrix = tetrominos[piece];

    // I and O start centered, all others start in left-middle
    const col = playField[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = piece=== 'I' ? -1 : -2;

    return {
      piece: piece,
      matrix: matrix, 
      row: row,        
      col: col         
    };
  }

  // Rotate an KxK matrix 90deg
  function my_play_Rotate(matrix) {
    const K = matrix.length - 1;
    const res = matrix.map((row, i) =>
      row.map((val, j) => matrix[K - j][i])
    );

    return res;
  }

  // check that new matrix/row/col is valid
  function ourLet_Correct_Moves(matrix, mtxRow, mtxCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] && (
            // outside the game bounds
            mtxCol + col < 0 ||
            mtxCol + col >= playField[0].length ||
            mtxRow + row >= playField.length ||
            // collides with another piece
            playField[mtxRow + row][mtxCol + col])
          ) {
          return false;
        }
      }
    }

    return true;
  }

  // place the tetromino on the playField
  function my_to_place_Tetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {

          // game over if piece has any part offscreen
          if (tetromino.row + row < 0) {
            return our_displayGameOver();
          }

          playField[tetromino.row + row][tetromino.col + col] = tetromino.piece;
        }
      }
    }

    // check line clears starting from the bottom and working our way up
    let droppedRows = 0;
    let lines = 0;
    for (let row = playField.length - 1; row >= 0; ) {
      if (playField[row].every(cell => !!cell)) {
        droppedRows++;
        lines++;

        // drop rows above this line
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playField[r].length; c++) {
            playField[r][c] = playField[r-1][c];

          }
        }
      }
      else {
        row--;
      }

    }

    tetromino = eaz_ytetromino();
    if (droppedRows > 0 && lines > 0) {
        updateScore(droppedRows);
        to_update_DroppedLines(lines);
    }

  }

  function to_update_DroppedLines() {
    document.getElementById("lines-dropped").innerHTML = droppedLines;
  }


  //Creating line/row cleared function
  function my_row_Drop(){
    for (let row = playField.length - 1; row >= 0; ) {
      if (playField[row].every(cell => !!cell)) {

        // drop every row above this one
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playField[r].length; c++) {
            playField[r][c] = playField[r-1][c];
          }
        }
      }
      else {
        row--;
      }

    }
  }



  function let_row_Drop(){
    for (let row = playField.length - 1; row >= 0; ) {
      if (playField[row].every(cell => !!cell)) {

        // drop every row above this one
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playField[r].length; c++) {
            playField[r][c] = playField[r-1][c];
          }
        }
      }
      else {
        row--;
      }
    }
  }


  let score = 0;
  let droppedLines = 0;
  function updateScore(droppedRows) {
    switch(droppedRows) {
        case 1:
            score += 100
            break;
        case 2:
            score += 300
            break;
        case 3:
            score += 500
            break;
        case 4:
            score += 800
            break;
        default:
            score = 0
    }

	// update score display
	const displayScore = document.getElementById('score');
	displayScore.innerHTML = score;

	let lines = Math.floor(score/100);
	if(lines > droppedLines){
		droppedLines = lines;
		to_update_DroppedLines();
	}
  }

  //Pause game
  let paused = false;

  function let_pause_Play() {
   if (!paused) {
     // pause the game
     removeInterval(dropInterval);
     paused = true;
   } else {
     // resume the game
     dropInterval = setInterval(moveDown, speed);
     paused = false;
   }
  }


  // show the game over screen
  function our_displayGameOver() {
    cancelAnimationFrame(reqAF);
    gameOver = true;

    context.fillStyle = 'pink';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
  }

  const canvas = document.getElementById('playGame');
  const context = canvas.getContext('2d');
  const grid = 32;
  const my_tetromino_Menu = [];

  // Tetris playField is 10x20, with a few rows offscreen
  const playField = [];

  // populate empty state
  for (let row = -2; row < 20; row++) {
    playField[row] = [];

    for (let col = 0; col < 10; col++) {
      playField[row][col] = 0;
    }
  }

  // draw tetrominos
  const tetrominos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };

  // tetromino color
  const tetColors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
  };

  let count = 0;
  let tetromino = eaz_ytetromino();
  let reqAF = null;  // keep track of the animation frame so we can cancel it
  let gameOver = false;


  // game draw
  function my_drawGame() {
    reqAF = requestAnimationFrame(my_drawGame);
    context.clearRect(0,0,canvas.width,canvas.height);

    // draw the playField
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (playField[row][col]) {
          const piece= playField[row][col];
          context.fillStyle = tetColors[piece];

          // looping 1 px smaller than the grid creates a grid effect
          context.fillRect(col * grid, row * grid, grid-1, grid-1);
        }
      }
    }

    // draw the active tetromino
    if (tetromino) {

      // tetromino falls every 35 frames
      if (++count > 35) {
        tetromino.row++;
        count = 0;

        // place piece if it runs into anything
        if (!ourLet_Correct_Moves(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          my_to_place_Tetromino();
        }
      }

      // context.fillStyle = tetColors[tetromino.piece];
      context.fillStyle = tetColors[tetromino.piece];

      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {

            // looping 1 px smaller than the grid creates a grid effect
            context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
          }
        }
      }
    }

  }



  // listen to keyboard events to move the active tetromino
  document.addEventListener('keydown', function(e) {
    if (gameOver) return;
   // if(pausePlay) return;

    // left and right arrow keys (move)
    if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 100 || e.keyCode === 102) {
      const col = e.keyCode === 37 ? tetromino.col - 1 : tetromino.col + 1;

      if (ourLet_Correct_Moves(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }

    // up arrow key (playRotate)
    if (e.keyCode === 38 || e.keyCode === 65 || e.keyCode === 66) {
      const matrix = my_play_Rotate(tetromino.matrix);
      if (ourLet_Correct_Moves(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }

    // down arrow key (drop)
    if(e.keyCode === 40 || e.keyCode === 98) {
      const row = tetromino.row + 1;

      if (!ourLet_Correct_Moves(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;

        my_to_place_Tetromino();
        return;
      }

      tetromino.row = row;
    }

    // spacebar key (Hard drop)
    if(e.keyCode === 32 || e.keyCode === 104) {
      while(ourLet_Correct_Moves){
        const row = tetromino.row + 1;
        if (!ourLet_Correct_Moves(tetromino.matrix, row, tetromino.col)) {
          tetromino.row = row - 1;

          my_to_place_Tetromino();
          return;
        }

        tetromino.row = row;
      }

    }

  });

  window.addEventListener("DOMContentLoaded", function(e){
    const audio = document.querySelector("audio");
    audio.volume = 0.2;
    audio.play();
  });

  function my_music_Stop(){
    let audio = new Audio('Spook.mp3');
    if(audio.paused){
      // audio.currentTime = 0;
      audio.play();
    }else{
      audio.pause();
    }
  }

  // start the game
  reqAF = requestAnimationFrame(my_drawGame);
  my_music_Stop();


  function my_nextt(){
    if(!paused){
      gameStarted();
    }
  }

  //stop the game
  function the_endGame(){

    let gameOver = true;
    our_displayGameOver();
    my_music_Stop();
    //return;
  }

  //button used to stop the game.
  let btnStop = document.getElementById('btnStop');
    btnStop.addEventListener('click', event =>{
    the_endGame();
  });

//
  // let droppedLines = 0;

  // function checkForLines() {
  //   // code to check for and clear lines goes here
  //   if (droppedLines > 0) {
  //     updateDroppedLines(droppedLines);
  //    // droppedLines = 0;
  //   }
  // }