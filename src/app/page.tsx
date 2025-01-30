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

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen">
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
                    {/* {puzzle.body[0].cells[(i * 15) + j].answer} */}
                  </div>}
                {puzzle.body[0].cells[(i * 15) + j].answer &&
                  <button className="absolute inset-0 z-10" onClick={currentCell === (i * 15 + j) ? () => setDirection(direction === 'Across' ? 'Down' : 'Across') : () => setCurrentCell((i * 15) + j)} />
                }
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-row w-[100vw] lg:pl-9 md:max-w-xl md:max-h-[75vh] justify-end overflow-scroll">
        {['Across', 'Down'].map((direction) => {
          return (
            <div key={direction} className="flex flex-col w-[50vw] overflow-scroll grow">
              <div className="pl-3 pt-1 pb-1">
                <div className="text-xl font-bold m-0 p-0">{direction}</div>
              </div>
              <ol className="p-2 overflow-scroll">
                {puzzle.body[0].clues.map((clue, i) => {
                  if (clue.direction != direction) return;
                  return (
                    <li key={i} className="hover:bg-gray-800 text-sm font-white">
                      <button className="pt-1 pb-1 size-full text-left" onClick={() => { setCurrentCell(clue.cells[0]); setDirection(clue.direction); }}>
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
