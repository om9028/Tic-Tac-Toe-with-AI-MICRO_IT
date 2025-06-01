const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const startGameBtn = document.getElementById('startGame');
const winLine = document.getElementById('win-line');

const modeSelect = document.getElementById('modeSelect');
const matchSelect = document.getElementById('matchSelect');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');

const soundMove = document.getElementById('soundMove');
const soundWin = document.getElementById('soundWin');
const soundDraw = document.getElementById('soundDraw');

let cells = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let mode = 'ai';
let totalMatches = 5;
let winsX = 0;
let winsO = 0;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function renderBoard() {
  board.innerHTML = '';
  cells.forEach((cell, index) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.textContent = cell;
    div.addEventListener('click', () => handleClick(index));
    board.appendChild(div);
  });
}

function showWinLine(pattern) {
  const cellSize = 100;
  const [start, , end] = pattern;

  const startX = start % 3;
  const startY = Math.floor(start / 3);
  const endX = end % 3;
  const endY = Math.floor(end / 3);

  const x1 = startX * cellSize + 50;
  const y1 = startY * cellSize + 50;
  const x2 = endX * cellSize + 50;
  const y2 = endY * cellSize + 50;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  winLine.style.width = `${length}px`;
  winLine.style.top = `${y1}px`;
  winLine.style.left = `${x1}px`;
  winLine.style.transform = `rotate(${angle}deg) scaleX(1)`;
}

function resetGame() {
  cells = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  winLine.style.transform = 'scaleX(0)';
  statusText.classList.remove('celebrate');
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
}

function checkWinner() {
  for (let i = 0; i < winPatterns.length; i++) {
    const [a, b, c] = winPatterns[i];
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      showWinLine(winPatterns[i]);
      return cells[a];
    }
  }
  return cells.includes(null) ? null : 'draw';
}

function handleClick(index) {
  if (cells[index] || gameOver) return;

  cells[index] = currentPlayer;
  soundMove.play();
  renderBoard();

  const result = checkWinner();

  if (result === 'draw') {
    soundDraw.play();
    statusText.textContent = "It's a draw!";
    gameOver = true;
  } else if (result) {
    soundWin.play();
    statusText.textContent = `Player ${result} wins! 🎉`;
    statusText.classList.add('celebrate');
    gameOver = true;
    updateScore(result);
    checkSeriesWinner();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (mode === 'ai' && currentPlayer === 'O') {
      setTimeout(makeAIMove, 500);
    }
  }
}

function makeAIMove() {
  const available = cells.map((val, idx) => val === null ? idx : null).filter(v => v !== null);
  const move = available[Math.floor(Math.random() * available.length)];
  handleClick(move);
}

function updateScore(winner) {
  if (winner === 'X') {
    winsX++;
    scoreXEl.textContent = winsX;
  } else {
    winsO++;
    scoreOEl.textContent = winsO;
  }
}

function checkSeriesWinner() {
  const required = Math.ceil(totalMatches / 2);
  if (winsX >= required) {
    statusText.textContent = `🎉 Player X wins the series!`;
    gameOver = true;
  } else if (winsO >= required) {
    statusText.textContent = `🎉 Player O wins the series!`;
    gameOver = true;
  }
}

function startGame() {
  mode = modeSelect.value;
  totalMatches = parseInt(matchSelect.value);
  winsX = 0;
  winsO = 0;
  scoreXEl.textContent = winsX;
  scoreOEl.textContent = winsO;
  resetGame();
}

resetBtn.addEventListener('click', resetGame);
startGameBtn.addEventListener('click', startGame);
