const assert = require('assert');

// Just implement for white for now
// Pure function
export function isLegalMove(boardState, startingSquare, endingSquare) {
    const pieceType = boardState[startingSquare[0]][startingSquare[1]];
    const movingBlackPiece = (pieceType >= 'A' && pieceType <= 'Z');
    if (movingBlackPiece) {
        const flippedBoard = flipBoardAndColor(boardState);
        return isLegalMove(flippedBoard, startingSquare, endingSquare);
    }
    
    if (pieceType === 'p')
        return isLegalPawnMove(boardState, startingSquare, endingSquare);
    return false
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