let currentPuzzle = [];

// Renders the Sudoku board to the screen
function renderBoard(board) {
  const boardDiv = document.getElementById("sudokuBoard");
  boardDiv.innerHTML = ""; // Clear previous board if any

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const input = document.createElement("input");
      input.className = "cell";
      input.type = "text";
      input.maxLength = 1;
      input.dataset.row = r;
      input.dataset.col = c;

      if (board[r][c] !== 0) {
        input.value = board[r][c];
        input.disabled = true;
        input.classList.add("filled"); // highlight original numbers
      }

      boardDiv.appendChild(input);
    }
  }
}

// Checks whether it's safe to place a number at a specific cell
function isSafe(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) {
      return false;
    }

    // Check 3x3 box
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(x / 3);
    const boxCol = 3 * Math.floor(col / 3) + (x % 3);
    if (board[boxRow][boxCol] === num) {
      return false;
    }
  }
  return true;
}

// Solves the Sudoku puzzle using backtracking
function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) {
              return true;
            }

            board[row][col] = 0; // backtrack
          }
        }
        return false;
      }
    }
  }
  return true; // solved
}

// Generates a full valid board
function generateFullBoard() {
  var board = [];

  for (let i = 0; i < 9; i++) {
    board.push(Array(9).fill(0));
  }

  solveSudoku(board);
  return board;
}

// Randomly removes numbers to create the puzzle
function removeNumbers(board, attempts) {
  if (typeof attempts === "undefined") {
    attempts = 30;
  }

  while (attempts > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);

    while (board[row][col] === 0) {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    }

    const backup = board[row][col];
    board[row][col] = 0;
    attempts--;
  }

  return board;
}

// Creates a new puzzle and displays it
function generatePuzzle() {
  const fullBoard = generateFullBoard();
  const puzzle = removeNumbers(fullBoard);
  currentPuzzle = puzzle.map(function(row) {
    return row.slice();
  });
  renderBoard(puzzle);
}

// Clears only the user-input cells
function resetBoard() {
  var confirmReset = confirm("Are you sure you want to reset the board?");
  if (!confirmReset) return;

  var inputs = document.querySelectorAll("input.cell");

  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (!input.disabled) {
      input.value = "";
      input.style.backgroundColor = "white";
    }
  }
}

// Checks the user’s solution against the solved board
function checkSolution() {
  var inputs = document.querySelectorAll("input.cell");
  var board = currentPuzzle.map(function(row) {
    return row.slice();
  });

  var correct = true;

  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    var r = parseInt(input.dataset.row);
    var c = parseInt(input.dataset.col);
    var val = parseInt(input.value);

    if (!isNaN(val)) {
      board[r][c] = val;
    }
  }

  if (!solveSudoku(board)) {
    alert("❌ Invalid board!");
    return;
  }

  for (var j = 0; j < inputs.length; j++) {
    var input = inputs[j];
    var r = parseInt(input.dataset.row);
    var c = parseInt(input.dataset.col);
    var val = parseInt(input.value);

    if (val !== board[r][c]) {
      input.style.backgroundColor = "#ffcccc"; // red for wrong
      correct = false;
    } else {
      input.style.backgroundColor = "#ccffcc"; // green for correct
    }
  }

  if (correct) {
    alert("🎉 Puzzle Solved!");
    updateStats();
  } else {
    alert("⚠️ Incorrect values. Try again.");
  }
}

// Updates localStorage stats
function updateStats() {
  var solved = parseInt(localStorage.getItem("puzzlesSolved") || "0");
  solved++;
  localStorage.setItem("puzzlesSolved", solved);
  document.getElementById("stats").textContent = "Puzzles Solved: " + solved;
}

// Resets the stats to 0
function resetStats() {
  localStorage.setItem("puzzlesSolved", "0");
  document.getElementById("stats").textContent = "Puzzles Solved: 0";
}

// Runs when page loads
window.onload = function() {
  generatePuzzle();
  document.getElementById("stats").textContent =
    "Puzzles Solved: " + (localStorage.getItem("puzzlesSolved") || "0");
};
