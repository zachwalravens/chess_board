import { useState, useEffect } from 'react'
import { isLegalMove } from '../utils/chess_logic.js'

const initialBoardState = [
  ['R','N','B','Q','K','B','N','R'],
  ['P','P','P','P','P','P','P','P'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['p','p','p','p','p','p','p','p'],
  ['r','n','b','q','k','b','n','r']
];

function Square({ id, type, onClick, selected }) {
  let squareColor = 'light';
  if ((id[0] + id[1]) % 2 === 0)
    squareColor = 'dark';
  if (selected)
    squareColor = 'selected-color';

  const pieceMappings = {
    "p": "/white_pawn.svg",
    "P": "/black_pawn.svg",
    "n": "/white_knight.svg",
    "N": "/black_knight.svg",
    "b": "/white_bishop.svg",
    "B": "/black_bishop.svg",
    "r": "/white_rook.svg",
    "R": "/black_rook.svg",
    "q": "/white_queen.svg",
    "Q": "/black_queen.svg",
    "k": "/white_king.svg",
    "K": "/black_king.svg"
  };

  const imgSource = pieceMappings[type];

  return (
    <div className={'square ' + squareColor} onClick={onClick}>
      {type != '' && <img className="piece" src={imgSource} alt="Pawn" />}
    </div>
  )
}

function Board() {
  const myArr = Array.from({ length: 64 }, (_, index) => index);

  const [moveAudio, setMoveAudio] = useState(null);
  const [wrongAudio, setWrongAudio] = useState(null);
  const [lastSquareClicked, setLastSquareClicked] = useState(null);
  const [boardState, setBoardState] = useState(initialBoardState);
  const [whitesTurn, setWhitesTurn] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMoveAudio(new Audio('/move.m4a'));
      setWrongAudio(new Audio('/wrong.m4a'));
    }
  }, []);

  function onClick(row, column) {

    // Select Square
    if (lastSquareClicked === null) {
      
      setLastSquareClicked([row, column]);
    }
    // Deselect Square
    else if (lastSquareClicked[0] === row && lastSquareClicked[1] === column) {
      setLastSquareClicked(null);
    } 
    // Move Piece
    else {
      const pieceToMove = boardState[lastSquareClicked[0]][lastSquareClicked[1]];
      const whiteIsMoving = pieceToMove >= 'a' && pieceToMove <= 'z'
      const correctTurn = (whiteIsMoving && whitesTurn) || (!whiteIsMoving && !whitesTurn)
      const moveIsAllowed = isLegalMove(boardState, lastSquareClicked, [row, column]);
      if (moveIsAllowed && correctTurn) {
        const newBoard = boardState.map(row => [...row]);
        newBoard[row][column] = pieceToMove;
        newBoard[lastSquareClicked[0]][lastSquareClicked[1]] = '';
        setBoardState(newBoard);
        setWhitesTurn(!whitesTurn);
        moveAudio.play();
      } else {
        wrongAudio.play();
      }
      setLastSquareClicked(null);
    }
  }

  return (
    <div className="grid">
      {myArr.map((index) => {
        const column = index % 8;
        const row = Math.floor(index / 8);
        return (<Square key={index}
                        id={[row, column]}
                        type={boardState[row][column]}
                        onClick={() => onClick(row, column)}
                        selected={lastSquareClicked && lastSquareClicked[0] === row && lastSquareClicked[1] === column}
                />)
      })}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <h1>Zach's Chess Board</h1>
      <Board />
    </>
  )
}