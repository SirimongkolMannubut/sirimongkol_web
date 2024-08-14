const board = document.getElementById('game-board');

const rows = 8;
const cols = 8;

let selectedPiece = null;
let currentPlayer = 'player1'; // Player 1 starts the game
let hasMoved = false; // Track if the player has moved this turn
let kingMovedThisTurn = false; // Track if a king has moved this turn

function createBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.row = i;
            square.dataset.col = j;
            if ((i + j) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
                if (i < 2) { // Create 8 pieces for player1
                    if ((i + j) % 2 !== 0) { // Ensure pieces are only on dark squares
                        const piece = createPiece('player1');
                        square.appendChild(piece);
                    }
                } else if (i > 5) { // Create 8 pieces for player2
                    if ((i + j) % 2 !== 0) { // Ensure pieces are only on dark squares
                        const piece = createPiece('player2');
                        square.appendChild(piece);
                    }
                }
            }
            board.appendChild(square);
        }
    }
}

function createPiece(player) {
    const piece = document.createElement('div');
    piece.classList.add('piece', player);
    piece.addEventListener('click', () => selectPiece(piece));
    return piece;
}

function selectPiece(piece) {
    if (hasMoved || piece.classList.contains(currentPlayer)) {
        if (selectedPiece) {
            selectedPiece.classList.remove('selected');
            clearHighlights();
        }
        selectedPiece = piece;
        piece.classList.add('selected');
        highlightMoves(piece);
    }
}

function clearHighlights() {
    const highlightedSquares = document.querySelectorAll('.highlight');
    highlightedSquares.forEach(square => {
        square.classList.remove('highlight');
        square.classList.remove('red-background', 'black-background'); // Remove background color
        square.removeEventListener('click', movePiece);
    });
}

function highlightMoves(piece) {
    const currentSquare = piece.parentElement;
    const row = parseInt(currentSquare.dataset.row);
    const col = parseInt(currentSquare.dataset.col);

    // King's directions: all four diagonals and four straight directions
    const directions = piece.classList.contains('king') ?
        [[1, -1], [1, 1], [-1, -1], [-1, 1], [1, 0], [-1, 0], [0, 1], [0, -1]] :
        (currentPlayer === 'player1' ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]]);

    directions.forEach(direction => {
        let newRow = row + direction[0];
        let newCol = col + direction[1];
        
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) return;

        const targetSquare = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
        if (targetSquare.classList.contains('dark')) {
            if (!targetSquare.firstChild) {
                targetSquare.classList.add('highlight');
                targetSquare.addEventListener('click', movePiece);
            } else if (targetSquare.firstChild && isValidCapture(newRow, newCol, newRow + direction[0], newCol + direction[1])) {
                // Check capture possibilities
                const captureSquare = document.querySelector(`[data-row="${newRow + direction[0]}"][data-col="${newCol + direction[1]}"]`);
                if (captureSquare && captureSquare.classList.contains('dark') && !captureSquare.firstChild) {
                    captureSquare.classList.add('highlight');
                    captureSquare.addEventListener('click', movePiece);
                }
            }
        }
    });
}

function isValidCapture(newRow, newCol, captureRow, captureCol) {
    if (captureRow < 0 || captureRow >= rows || captureCol < 0 || captureCol >= cols) return false;

    const targetSquare = document.querySelector(`[data-row="${captureRow}"][data-col="${captureCol}"]`);
    const middleSquare = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
    const middlePiece = middleSquare ? middleSquare.firstChild : null;

    if (middlePiece && targetSquare.classList.contains('dark') && !targetSquare.firstChild) {
        const isCurrentPlayerPiece = middlePiece.classList.contains(currentPlayer);
        const isOpponentPiece = middlePiece.classList.contains(currentPlayer === 'player1' ? 'player2' : 'player1');
        
        // Ensure that kings do not capture their own pieces
        if (isCurrentPlayerPiece) {
            return false;
        }

        return isOpponentPiece;
    }
    return false;
}

function movePiece(event) {
    if (hasMoved) return; // Prevent moving if the player has already moved

    const targetSquare = event.currentTarget;
    const currentSquare = selectedPiece.parentElement;

    // Remove any piece in the target square if captured
    const middleRow = (parseInt(targetSquare.dataset.row) + parseInt(currentSquare.dataset.row)) / 2;
    const middleCol = (parseInt(targetSquare.dataset.col) + parseInt(currentSquare.dataset.col)) / 2;

    const middleSquare = document.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
    const middlePiece = middleSquare ? middleSquare.firstChild : null;

    if (middlePiece && middlePiece.classList.contains(currentPlayer === 'player1' ? 'player2' : 'player1')) {
        middleSquare.removeChild(middlePiece);
    }

    targetSquare.appendChild(selectedPiece);
    selectedPiece.classList.remove('selected');

    // Check if the piece becomes a King
    const row = parseInt(targetSquare.dataset.row);
    if ((currentPlayer === 'player1' && row === rows - 1) ||
        (currentPlayer === 'player2' && row === 0)) {
        selectedPiece.classList.add('king');
    }

    // Reset the background color of the target square
    targetSquare.classList.remove('red-background', 'black-background');

    // Prevent undo move
    hasMoved = true; // Set move tracker to true after a move

    // If a king has moved, prevent further movement for this turn
    if (selectedPiece.classList.contains('king')) {
        kingMovedThisTurn = true;
    }

    clearHighlights();
    switchPlayer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    hasMoved = false; // Reset move tracker for the new player
    kingMovedThisTurn = false; // Reset king moved tracker for the new player

    // Update piece selection for the new player
    document.querySelectorAll('.piece').forEach(piece => {
        piece.removeEventListener('click', selectPiece);
        if (piece.classList.contains(currentPlayer)) {
            piece.addEventListener('click', () => selectPiece(piece));
        }
    });
}

// Initialize the game board
createBoard();
