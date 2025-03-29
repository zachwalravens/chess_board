import { useState, useEffect } from 'react'

const initialBoardState = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R']
];

function Square({ id, type, onClick }) {
  let squareColor = 'light';
  if ((id[0] + id[1]) % 2 === 0)
    squareColor = 'dark';

  const pieceMappings = {
    "p": "/pawn.svg",
    "P": "/pawn.svg",
    "n": "/knight.svg",
    "N": "/knight.svg",
    "b": "/bishop.svg",
    "B": "/bishop.svg",
    "r": "/rook.svg",
    "R": "/rook.svg",
    "q": "/queen.svg",
    "Q": "/queen.svg",
    "k": "/king.svg",
    "K": "/king.svg"
  };

  const imgSource = pieceMappings[type];

  return (
    <div className={'square ' + squareColor} onClick={onClick}>
      {type != '' && <img className="piece" src={imgSource} alt="Pawn" />}
    </div>
  )
}

function Board() {
  const myArr = Array.from({ length: 64 }, (_, index) => index)

  const [audio, setAudio] = useState(null)
  const [lastSquareClicked, setLastSquareClicked] = useState(null)
  const [boardState, setBoardState] = useState(initialBoardState)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudio(new Audio('/move.m4a'));
    }
  }, []);

  function onClick(row, column) {
    console.log(`Row: ${row}, Column: ${column}`)

    if (lastSquareClicked === null) {
      setLastSquareClicked([row, column])
    } else {
      const pieceToMove = boardState[lastSquareClicked[0]][lastSquareClicked[1]]
      const newBoard = boardState.map(row => [...row])
      newBoard[row][column] = pieceToMove
      newBoard[lastSquareClicked[0]][lastSquareClicked[1]] = ''
      setBoardState(newBoard)
      audio.play()
      setLastSquareClicked(null)
    }
  }

  console.log(boardState)

  return (
    <div className="grid">
      {myArr.map((index) => {
        const column = index % 8;
        const row = 7 - Math.floor(index / 8);
        return <Square key={index} id={[row, column]} type={boardState[row][column]} onClick={() => onClick(row, column)} />
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