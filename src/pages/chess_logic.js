const assert = require('assert');

function printBoard(boardState) {
    boardState.map(row => console.log(row));
}

// Just implement for white for now
// Pure function
export function isLegalMove(boardState, startingSquare, endingSquare) {
    const pieceType = boardState[startingSquare[0]][startingSquare[1]];
    const movingBlackPiece = (pieceType >= 'A' && pieceType <= 'Z');
    if (movingBlackPiece) {
        const flippedBoard = flipBoardAndColor(boardState);
        const newStartingSquare = [7 - startingSquare[0], startingSquare[1]];
        const newEndingSquare = [7 - endingSquare[0], endingSquare[1]];
        printBoard(flippedBoard);
        const result = isLegalMove(flippedBoard, newStartingSquare, newEndingSquare);
        return result
    }
    
    if (pieceType === 'p')
        return isLegalPawnMove(boardState, startingSquare, endingSquare);

    if (pieceType == 'n')
        return isLegalKnightMove(boardState, startingSquare, endingSquare);

    if (pieceType == 'r')
        return isLegalRookMove(boardState, startingSquare, endingSquare);

    if (pieceType == 'b')
        return isLegalBishopMove(boardState, startingSquare, endingSquare);

    if (pieceType == 'q')
        return (isLegalRookMove(boardState, startingSquare, endingSquare)
                || isLegalBishopMove(boardState, startingSquare, endingSquare));

    return false
}

function isLegalBishopMove(boardState, startingSquare, endingSquare) {
    const [startingSquareRow, startingSquareColumn] = startingSquare;
    const [endingSquareRow, endingSquareColumn] = endingSquare;
    const endingSquareValue = boardState[endingSquareRow][endingSquareColumn];
    const endingSquareEmpty = endingSquareValue === '';
    const enemyOnEndingSquare = endingSquareValue >= 'A' && endingSquareValue <= 'Z';
    const canMoveToEndingSquare = endingSquareEmpty || enemyOnEndingSquare;
    const movesForwardBy = startingSquareRow - endingSquareRow;
    const movesSizewaysBy = startingSquareColumn - endingSquareColumn;
    const diagonalMove = Math.abs(movesForwardBy) === Math.abs(movesSizewaysBy);
    const acutallyMoves = movesForwardBy !== 0 || movesSizewaysBy !== 0;

    return canMoveToEndingSquare && diagonalMove && acutallyMoves;
}

function isLegalRookMove(boardState, startingSquare, endingSquare) {
    const [startingSquareRow, startingSquareColumn] = startingSquare;
    const [endingSquareRow, endingSquareColumn] = endingSquare;
    const endingSquareValue = boardState[endingSquareRow][endingSquareColumn];
    const endingSquareEmpty = endingSquareValue === '';
    const enemyOnEndingSquare = endingSquareValue >= 'A' && endingSquareValue <= 'Z';
    const canMoveToEndingSquare = endingSquareEmpty || enemyOnEndingSquare;
    const movesForwardBy = startingSquareRow - endingSquareRow;
    const movesSizewaysBy = startingSquareColumn - endingSquareColumn;
    const orthogonalMove = movesForwardBy === 0 || movesSizewaysBy === 0;
    const acutallyMoves = movesForwardBy !== 0 || movesSizewaysBy !== 0;

    return canMoveToEndingSquare && orthogonalMove && acutallyMoves;
}

function isLegalKnightMove(boardState, startingSquare, endingSquare) {
    const [startingSquareRow, startingSquareColumn] = startingSquare;
    const [endingSquareRow, endingSquareColumn] = endingSquare;
    const endingSquareValue = boardState[endingSquareRow][endingSquareColumn];

    const movesForwardBy = startingSquareRow - endingSquareRow;
    const movesSizewaysBy = startingSquareColumn - endingSquareColumn;
    const distanceMovedSquared = movesForwardBy ** 2 + movesSizewaysBy ** 2;
    const endingSquareEmpty = endingSquareValue === '';
    const enemyOnEndingSquare = endingSquareValue >= 'A' && endingSquareValue <= 'Z';
    const canMoveToEndingSquare = endingSquareEmpty || enemyOnEndingSquare
    return distanceMovedSquared == 5 && canMoveToEndingSquare;
}

function isLegalPawnMove(boardState, startingSquare, endingSquare) {
    const [startingSquareRow, startingSquareColumn] = startingSquare;
    const [endingSquareRow, endingSquareColumn] = endingSquare;

   
    const onStartingSquare = startingSquareRow === 6;
    const movesForwardBy = startingSquareRow - endingSquareRow;
    const movesSizewaysBy = startingSquareColumn - endingSquareColumn;
    const endingSquareValue =  boardState[endingSquareRow][endingSquareColumn];
    const endingSquareEmpty = endingSquareValue === '';
    const intermediateSquareEmpty = boardState[endingSquareRow+1][endingSquareColumn] === '';
    const enemyOnEndingSquare = endingSquareValue >= 'A' && endingSquareValue <= 'Z';
     // Move forward 2 at start
    if (onStartingSquare && movesForwardBy === 2 && movesSizewaysBy === 0 && endingSquareEmpty && intermediateSquareEmpty)
        return true;
    // Move forward 1
    if (movesForwardBy === 1 && endingSquareEmpty && movesSizewaysBy === 0)
        return true;
    // Attacks enemy
    if (movesForwardBy === 1 && Math.abs(movesSizewaysBy) === 1 && enemyOnEndingSquare)
        return true;
    
    return false;
}

function flipBoardAndColor(boardState) {
    let boardStateCopy = boardState.map(row => [...row]);
    boardStateCopy = boardStateCopy.reverse();
    return boardStateCopy.map(row => row.map(element => swapCase(element)))
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