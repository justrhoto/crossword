'use client';

import { useEffect, useState, useRef, createRef } from 'react';
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
  const elementsRef = useRef(puzzle.body[0].clues.map(() => createRef<HTMLLIElement>()));
  const { width, height } = puzzle.body[0].dimensions;

  useEffect(() => {
    const cells = puzzle.body[0].cells;
    const returnCells = [];
    if (direction === 'Across') {
      let cellIndex = currentCell;
      while (cellIndex % width != 0 && cells[cellIndex - 1].answer) {
        returnCells.push(--cellIndex);
      }
      cellIndex = currentCell;
      while ((cellIndex + 1) % width != 0 && cells[cellIndex + 1].answer) {
        returnCells.push(++cellIndex);
      }
    } else {
      let cellIndex = currentCell;
      while (cellIndex >= width && cells[cellIndex - width].answer) {
        returnCells.push(cellIndex -= width);
      }
      cellIndex = currentCell;
      while (cellIndex < (width * height) - width && cells[cellIndex + width].answer) {
        returnCells.push(cellIndex += width);
      }
    }
    setSecondaryCells(returnCells);
    const currentClue = puzzle.body[0].cells[currentCell].clues[direction === 'Across' ? 0 : 1];
    elementsRef.current[currentClue].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentCell, direction, width, height, puzzle.body]);

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
        if (currentCell % width <= 0) return;
        let nextCell = currentCell - 1;
        while (!isCellUsable(nextCell) && nextCell % width > 0) nextCell--;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      } else {
        if (currentCell % width >= width - 1) return;
        let nextCell = currentCell + 1;
        while (!isCellUsable(nextCell) && nextCell % width < width - 1) nextCell++;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      }
    } else {
      if (reverse) {
        if (currentCell - height < 0) return;
        let nextCell = currentCell - height;
        while (!isCellUsable(nextCell) && nextCell - height >= 0) nextCell -= height;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      } else {
        if (currentCell + height >= puzzle.body[0].cells.length) return;
        let nextCell = currentCell + height;
        while (!isCellUsable(nextCell) && nextCell + height < puzzle.body[0].cells.length) nextCell += height;
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
    } else if (e.key === 'ArrowLeft') {
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

  const cellColor = (cellIndex: number) => {
    if (!puzzle.body[0].cells[cellIndex].answer) return 'bg-black';
    if (currentCell === cellIndex) return 'bg-yellow-100';
    if (secondaryCells?.includes(cellIndex)) return 'bg-gray-300';
    return 'bg-white';
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen" onKeyDown={(e) => handleKeyDown(e)}>
      <div className={`grid grid-rows-${width} w-[100vw] md:max-w-3xl aspect-square p-2`}>
        {Array.from({ length: height }).map((_, i) => (
          <div key={i} className={`grid grid-cols-${height}`}>
            {Array.from({ length: width }).map((_, j) => (
              <div className={`relative border border-gray-500 ${cellColor((i * width) + j)} aspect-square w-auto h-auto`} key={`${(i * width) + j}`}>
                {puzzle.body[0].cells[(i * width) + j].label &&
                  <div className="absolute inset-0 text-xs text-black select-none">
                    {puzzle.body[0].cells[(i * width) + j].label}
                  </div>}
                {puzzle.body[0].cells[(i * width) + j].answer &&
                  <>
                    <div className="absolute inset-0 flex justify-center items-center text-3xl text-black select-none">
                      {userAnswers[(i * width) + j]}
                    </div>
                    <button className="absolute inset-0 z-10" onClick={() => handleCellClick(i * width + j)} />
                  </>
                }
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-row w-[100vw] lg:pl-9 md:max-w-xl md:max-h-[75vh] justify-end">
        {['Across', 'Down'].map((directionIndex) => {
          return (
            <div key={directionIndex} className="flex flex-col w-[50vw] grow">
              <div className="pl-3 pt-1 pb-1">
                <div className="text-xl font-bold m-0 p-0">
                  {directionIndex}
                </div>
              </div>
              <ol className="p-2 overflow-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {puzzle.body[0].clues.map((clue, i) => {
                  if (clue.direction != directionIndex) return;
                  return (
                    <li key={i} ref={elementsRef.current[i]} className={`hover:bg-gray-800 text-sm font-white ${clue.cells.includes(currentCell) && clue.direction === direction ? 'bg-gray-900' : ''}`}>
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
    </div>
  );
}
