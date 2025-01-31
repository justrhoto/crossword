'use client';

import { useEffect, useState } from 'react';
import _puzzle from './crossword.json';

interface Puzzle {
  body: {
    board: string;
    cells: {
      answer: string;
      clues: [number, number];
      label: string;
      type: number;
    }[]
    clueLists: unknown;
    clues: {
      cells: number[];
      direction: 'Across' | 'Down';
      label: string;
      text: {
        plain: string;
      }[];
    }[];
    dimensions: {
      height: number;
      width: number;
    }
    SVG: unknown;
  }[];
  constructors: string[];
  copyright: string;
  editor: string;
  id: number;
  lastUpdated: string;
  publicationDate: string;
  relatedContent: {
    text: string;
    url: string;
  }
}

export default function Home() {
  const puzzle = _puzzle as Puzzle;
  const [currentCell, setCurrentCell] = useState(0);
  const [secondaryCells, setSecondaryCells] = useState<number[]>();
  const [direction, setDirection] = useState<'Across' | 'Down'>('Across');
  const [userAnswers, setUserAnswers] = useState<string[]>(Array.from({ length: puzzle.body[0].cells.length }, () => ''));

  useEffect(() => {
    const dimensions = puzzle.body[0].dimensions;
    const cells = puzzle.body[0].cells;
    const returnCells = [];
    if (direction === 'Across') {
      let cellIndex = currentCell;
      while (cellIndex % dimensions.width != 0 && cells[cellIndex - 1].answer) {
        returnCells.push(--cellIndex);
      }
      cellIndex = currentCell;
      while ((cellIndex + 1) % dimensions.width != 0 && cells[cellIndex + 1].answer) {
        returnCells.push(++cellIndex);
      }
    } else {
      let cellIndex = currentCell;
      while (cellIndex >= dimensions.width && cells[cellIndex - 15].answer) {
        returnCells.push(cellIndex -= 15);
      }
      cellIndex = currentCell;
      while (cellIndex < (dimensions.width * dimensions.height) - dimensions.width && cells[cellIndex + 15].answer) {
        returnCells.push(cellIndex += 15);
      }
    }
    setSecondaryCells(returnCells);
  }, [currentCell, direction, puzzle.body]);

  const handleCellClick = (cellIndex: number) => {
    if (currentCell === cellIndex) {
      setDirection(direction === 'Across' ? 'Down' : 'Across');
    } else {
      setCurrentCell(cellIndex);
    }
  }

  const isCellUsable = (cellIndex: number) => {
    return !!puzzle.body[0].cells[cellIndex].answer;
  }

  const advanceCell = ({ reverse = false }: { reverse?: boolean } = {}) => {
    if (direction === 'Across') {
      if (reverse) {
        if (currentCell % puzzle.body[0].dimensions.width <= 0) return;
        let nextCell = currentCell - 1;
        while (!isCellUsable(nextCell) && nextCell % puzzle.body[0].dimensions.width > 0) nextCell--;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      } else {
        if (currentCell % puzzle.body[0].dimensions.width >= puzzle.body[0].dimensions.width - 1) return;
        let nextCell = currentCell + 1;
        while (!isCellUsable(nextCell) && nextCell % puzzle.body[0].dimensions.width < puzzle.body[0].dimensions.width - 1) nextCell++;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      }
    } else {
      if (reverse) {
        if (currentCell - puzzle.body[0].dimensions.height < 0) return;
        let nextCell = currentCell - puzzle.body[0].dimensions.height;
        while (!isCellUsable(nextCell) && nextCell - puzzle.body[0].dimensions.height >= 0) nextCell -= puzzle.body[0].dimensions.height;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      } else {
        if (currentCell + puzzle.body[0].dimensions.height >= puzzle.body[0].cells.length) return;
        let nextCell = currentCell + puzzle.body[0].dimensions.height;
        while (!isCellUsable(nextCell) && nextCell + puzzle.body[0].dimensions.height < puzzle.body[0].cells.length) nextCell += puzzle.body[0].dimensions.height;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      if (direction != 'Across') {
        setDirection('Across');
        return;
      }
      advanceCell();
    } else if (e.key === 'ArrowLeft' && currentCell > 0 && isCellUsable(currentCell - 1)) {
      if (direction != 'Across') {
        setDirection('Across');
        return;
      }
      advanceCell({ reverse: true });
    } else if (e.key === 'ArrowDown') {
      if (direction != 'Down') {
        setDirection('Down');
        return;
      }
      advanceCell();
    } else if (e.key === 'ArrowUp') {
      if (direction != 'Down') {
        setDirection('Down');
        return;
      }
      advanceCell({ reverse: true });
    } else if (e.key === 'Backspace') {
      setUserAnswers(userAnswers.map((answer, i) => i === currentCell ? '' : answer));
      advanceCell({ reverse: true });
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      setDirection(direction === 'Across' ? 'Down' : 'Across');
    } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      setUserAnswers(userAnswers.map((answer, i) => i === currentCell ? e.key.toUpperCase() : answer));
      advanceCell();
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen" onKeyDown={(e) => handleKeyDown(e)}>
      <div className={`grid grid-rows-${puzzle.body[0].dimensions.width} w-[100vw] md:max-w-3xl aspect-square p-2`}>
        {Array.from({ length: puzzle.body[0].dimensions.height }).map((_, i) => (
          <div key={i} className={`grid grid-cols-${puzzle.body[0].dimensions.height}`}>
            {Array.from({ length: puzzle.body[0].dimensions.width }).map((_, j) => (
              <div className={`relative border border-gray-500 
                              ${puzzle.body[0].cells[(i * 15) + j].answer ? 'bg-white' : 'bg-black'} 
                              ${currentCell === (i * 15 + j) && 'bg-yellow-100'} 
                              ${secondaryCells?.includes((i * 15) + j) && 'bg-gray-300'}
                              aspect-square w-auto h-auto`} key={`${(i * 15) + j}`}>
                {puzzle.body[0].cells[(i * 15) + j].label &&
                  <div className="absolute inset-0 text-xs text-black select-none">
                    {puzzle.body[0].cells[(i * 15) + j].label}
                  </div>}
                {puzzle.body[0].cells[(i * 15) + j].answer &&
                  <div className="absolute inset-0 flex justify-center items-center text-3xl text-black select-none">
                    {userAnswers[(i * 15) + j]}
                  </div>}
                {puzzle.body[0].cells[(i * 15) + j].answer &&
                  <button className="absolute inset-0 z-10" onClick={() => handleCellClick(i * 15 + j)} />
                }
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-row w-[100vw] lg:pl-9 md:max-w-xl md:max-h-[75vh] justify-end overflow-scroll">
        {['Across', 'Down'].map((directionIndex) => {
          return (
            <div key={directionIndex} className="flex flex-col w-[50vw] overflow-scroll grow">
              <div className="pl-3 pt-1 pb-1">
                <div className="text-xl font-bold m-0 p-0">{directionIndex}</div>
              </div>
              <ol className="p-2 overflow-scroll">
                {puzzle.body[0].clues.map((clue, i) => {
                  if (clue.direction != directionIndex) return;
                  return (
                    <li key={i} className={`hover:bg-gray-800 text-sm font-white ${clue.cells.includes(currentCell) && clue.direction === direction && 'bg-gray-900'}`}>
                      <button className="p-1 size-full text-left" onClick={() => { setCurrentCell(clue.cells[0]); setDirection(clue.direction); }}>
                        {clue.label}. {clue.text[0].plain}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          )
        })}
      </div>
    </div >
  );
}
