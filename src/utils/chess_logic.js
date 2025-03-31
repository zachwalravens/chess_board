const assert = require('assert');

export function printBoard(boardState) {
    boardState.map(row => console.log(row));
}

// Pure function
export function getPostMoveState(gameState, startingSquare, endingSquare) {
    const boardState = gameState['board'];
    let boardStateCopy = boardState.map(row => [...row]);
    let newGameState = {
        board: boardStateCopy,
        whiteCastleB: gameState['whiteCastleB'],
        blackCastleB: gameState['blackCastleB'],
        whiteCastleG: gameState['whiteCastleG'],
        blackCastleG: gameState['blackCastleG'],
        enPassantSquare: null,
        enPassantPawnSquare: null,
        whitesTurn: !gameState['whitesTurn']
    }

    const pieceType = boardState[startingSquare[0]][startingSquare[1]];
    const movingBlackPiece = (pieceType >= 'A' && pieceType <= 'Z');

    // Trying to move the other players piece
    if (movingBlackPiece && gameState['whitesTurn'] || !movingBlackPiece && !gameState['whitesTurn']) {
        return null;
    }

    // Flip logic for Black's moves
    if (movingBlackPiece) {
        const flippedGame = flipBoardAndColor(gameState);
        const newStartingSquare = [7 - startingSquare[0], startingSquare[1]];
        const newEndingSquare = [7 - endingSquare[0], endingSquare[1]];
        const rawResult = getPostMoveState(flippedGame, newStartingSquare, newEndingSquare);
        if (rawResult === null)
            return null;
        return flipBoardAndColor(rawResult);
    }

    const [startingSquareRow, startingSquareColumn] = startingSquare;
    const [endingSquareRow, endingSquareColumn] = endingSquare;
    const endingSquareValue = boardState[endingSquareRow][endingSquareColumn];
    const endingSquareEmpty = endingSquareValue === '';
    const enemyOnEndingSquare = endingSquareValue >= 'A' && endingSquareValue <= 'Z';
    const canMoveToEndingSquare = endingSquareEmpty || enemyOnEndingSquare;
    const movesForwardBy = startingSquareRow - endingSquareRow;
    const movesSizewaysBy = startingSquareColumn - endingSquareColumn;
    const diagonalMove = Math.abs(movesForwardBy) === Math.abs(movesSizewaysBy);
    const orthogonalMove = movesForwardBy === 0 || movesSizewaysBy === 0;
    const acutallyMoves = movesForwardBy !== 0 || movesSizewaysBy !== 0;
    const distanceMovedSquared = movesForwardBy ** 2 + movesSizewaysBy ** 2;
    const onStartingSquare = startingSquareRow === 6;
    let [enPassantRow, enPassantColumn] = [null, null];
    if (gameState['enPassantSquare'] !== null)
        [enPassantRow, enPassantColumn] = gameState['enPassantSquare'];
    const attacksEnPassant = endingSquareRow === enPassantRow && endingSquareColumn === enPassantColumn;
    let movedPiece = null;
    
    if (pieceType === 'p') {
        const intermediateSquareEmpty = boardState[endingSquareRow+1][endingSquareColumn] === '';
        // Move forward 2 at start
        if (onStartingSquare && movesForwardBy === 2 && movesSizewaysBy === 0 && endingSquareEmpty && intermediateSquareEmpty) {
            movedPiece = 'p';
            // enable en passant
            newGameState['enPassantPawnSquare'] = endingSquare;
            newGameState['enPassantSquare'] = [endingSquareRow + 1, endingSquareColumn];
        }
        // Move forward 1
        if (movesForwardBy === 1 && endingSquareEmpty && movesSizewaysBy === 0) {
            movedPiece = 'p';
        }
        // Attacks enemy
        if (movesForwardBy === 1 && Math.abs(movesSizewaysBy) === 1 && enemyOnEndingSquare) {
            movedPiece = 'p';
        }
        // Attacks enemy en passant
        if (movesForwardBy === 1 && Math.abs(movesSizewaysBy) === 1 && attacksEnPassant) {
            movedPiece = 'p';
            // Remove pawn attacked by en passant
            newGameState['board'][endingSquareRow + 1][endingSquareColumn] = '';
        }
    }

    if (pieceType == 'n')
        if (distanceMovedSquared == 5 && canMoveToEndingSquare)
            movedPiece = 'n';

    if (pieceType == 'r')
        if (canMoveToEndingSquare && orthogonalMove && acutallyMoves && isPathEmpty(boardState, startingSquare, endingSquare))
            movedPiece = 'r';

    if (pieceType == 'b')
        if (canMoveToEndingSquare && diagonalMove && acutallyMoves && isPathEmpty(boardState, startingSquare, endingSquare))
            movedPiece = 'b';

    if (pieceType == 'q') {
        const validMoveDirection = orthogonalMove || diagonalMove;
        if (canMoveToEndingSquare && validMoveDirection && acutallyMoves && isPathEmpty(boardState, startingSquare, endingSquare))
            movedPiece = 'q'
    }
    if (pieceType == 'k') {
        const singleSquareMove = distanceMovedSquared <= 2;
        if (canMoveToEndingSquare && singleSquareMove && acutallyMoves)
            movedPiece = 'k'
    }

    if (movedPiece === null) {
        return null;
    } else {
        newGameState['board'][startingSquareRow][startingSquareColumn] = '';
        newGameState['board'][endingSquareRow][endingSquareColumn] = movedPiece;
        return newGameState
    }
}

function isPathEmpty(boardState, startingSquare, endingSquare) {
    const [startingSquareRow, startingSquareColumn] = startingSquare;
    const [endingSquareRow, endingSquareColumn] = endingSquare;

    // Find the direction the piece will travel in
    const verticalDirection = (() => {
        if (endingSquareRow > startingSquareRow)
            return 1;
        else if (endingSquareRow === startingSquareRow)
            return 0;
        else
            return -1;
    })();
    const horizontalDirection = (() => {
        if (endingSquareColumn > startingSquareColumn)
            return 1;
        else if (endingSquareColumn === startingSquareColumn)
            return 0;
        else
            return -1;
    })();

    // Iterative over all squares between the move start and end to make sure they're empty
    let currentRow = startingSquareRow + verticalDirection;
    let currrentColumn = startingSquareColumn + horizontalDirection;
    while (currentRow !== endingSquareRow || currrentColumn !== endingSquareColumn) {
        if (boardState[currentRow][currrentColumn] != '')
            return false;
        currentRow = currentRow + verticalDirection;
        currrentColumn = currrentColumn + horizontalDirection;
    }
    return true;
}

function flipSquare(square) { 
    const newSquare = (() => {
        if (square === null) {
            return null;
        } else {
            const [oldRow, oldColumn] = square;
            return [7-oldRow, oldColumn];
        }
    })();
    return newSquare
}

// Doesn't modify gameState but returns a new one
function flipBoardAndColor(gameState) {
    let boardStateCopy = gameState['board'].map(row => [...row]);
    // Swap orientation
    boardStateCopy = boardStateCopy.reverse();
    // Swap colors
    boardStateCopy =  boardStateCopy.map(row => row.map(element => swapCase(element)))

    return {
        board: boardStateCopy,
        whiteCastleB: gameState['blackCastleB'],
        blackCastleB: gameState['whiteCastleB'],
        whiteCastleG: gameState['blackCastleG'],
        blackCastleG: gameState['whiteCastleG'],
        enPassantSquare: flipSquare(gameState['enPassantSquare']),
        enPassantPawnSquare: flipSquare(gameState['enPassantPawnSquare']),
        whitesTurn: !gameState['whiteTurn']
    };
}

function swapCase(character) {
    if (character >= 'a' && character <= 'z') {
        return character.toUpperCase();
    } else if (character >= 'A' && character <= 'Z') {
        return character.toLowerCase();
    } else if (character === '') {
        return character;
    } else {
        throw new TypeError(`Invalid argument to swapCase. Expected letter or empty string. Got ${character}`);
    }
}