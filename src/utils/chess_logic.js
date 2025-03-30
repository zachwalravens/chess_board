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
    
    if (pieceType === 'p') {
        const intermediateSquareEmpty = boardState[endingSquareRow+1][endingSquareColumn] === '';
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

    if (pieceType == 'n')
        return distanceMovedSquared == 5 && canMoveToEndingSquare;

    if (pieceType == 'r')
        return canMoveToEndingSquare && orthogonalMove && acutallyMoves && isPathEmpty(boardState, startingSquare, endingSquare);

    if (pieceType == 'b')
        return canMoveToEndingSquare && diagonalMove && acutallyMoves && isPathEmpty(boardState, startingSquare, endingSquare);

    if (pieceType == 'q') {
        const validMoveDirection = orthogonalMove || diagonalMove;
        return canMoveToEndingSquare && validMoveDirection && acutallyMoves && isPathEmpty(boardState, startingSquare, endingSquare);
    }
    if (pieceType == 'k') {
        const singleSquareMove = distanceMovedSquared <= 2;
        return canMoveToEndingSquare && singleSquareMove && acutallyMoves;
    }
        
    return false;
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