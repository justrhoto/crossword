"use client";

import { useEffect, useState, useRef, createRef } from "react";
import { FaGear, FaCheck } from "react-icons/fa6";
import _puzzle from "./crossword.json";
import { FaPencilAlt } from "react-icons/fa";

interface Puzzle {
  body: {
    board: string;
    cells: {
      answer: string;
      clues: [number, number];
      label: string;
      type: number;
    }[];
    clueLists: unknown;
    clues: {
      cells: number[];
      direction: "Across" | "Down";
      label: string;
      text: {
        plain: string;
      }[];
    }[];
    dimensions: {
      height: number;
      width: number;
    };
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
  };
}

export default function Home() {
  const puzzle = _puzzle as Puzzle;
  const [currentCell, setCurrentCell] = useState(0);
  const [secondaryCells, setSecondaryCells] = useState<number[]>();
  const [direction, setDirection] = useState<"Across" | "Down">("Across");
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array.from({ length: puzzle.body[0].cells.length }, () => ""),
  );
  const elementsRef = useRef(
    puzzle.body[0].clues.map(() => createRef<HTMLLIElement>()),
  );
  const { width, height } = puzzle.body[0].dimensions;

  useEffect(() => {
    const cells = puzzle.body[0].cells;
    const returnCells = [];
    if (direction === "Across") {
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
        returnCells.push((cellIndex -= width));
      }
      cellIndex = currentCell;
      while (
        cellIndex < width * height - width &&
        cells[cellIndex + width].answer
      ) {
        returnCells.push((cellIndex += width));
      }
    }
    setSecondaryCells(returnCells);
    const currentClue =
      puzzle.body[0].cells[currentCell].clues[direction === "Across" ? 0 : 1];
    elementsRef.current[currentClue].current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentCell, direction, width, height, puzzle.body]);

  const handleCellClick = (cellIndex: number) => {
    if (currentCell === cellIndex) {
      setDirection(direction === "Across" ? "Down" : "Across");
    } else {
      setCurrentCell(cellIndex);
    }
  };

  const isCellUsable = (cellIndex: number) => {
    return !!puzzle.body[0].cells[cellIndex].answer;
  };

  const advanceCell = ({ reverse = false }: { reverse?: boolean } = {}) => {
    if (direction === "Across") {
      if (reverse) {
        if (currentCell % width <= 0) return;
        let nextCell = currentCell - 1;
        while (!isCellUsable(nextCell) && nextCell % width > 0) nextCell--;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      } else {
        if (currentCell % width >= width - 1) return;
        let nextCell = currentCell + 1;
        while (!isCellUsable(nextCell) && nextCell % width < width - 1)
          nextCell++;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      }
    } else {
      if (reverse) {
        if (currentCell - height < 0) return;
        let nextCell = currentCell - height;
        while (!isCellUsable(nextCell) && nextCell - height >= 0)
          nextCell -= height;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      } else {
        if (currentCell + height >= puzzle.body[0].cells.length) return;
        let nextCell = currentCell + height;
        while (
          !isCellUsable(nextCell) &&
          nextCell + height < puzzle.body[0].cells.length
        )
          nextCell += height;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.key === "ArrowRight") {
      if (direction != "Across") {
        setDirection("Across");
        return;
      }
      advanceCell();
    } else if (e.key === "ArrowLeft") {
      if (direction != "Across") {
        setDirection("Across");
        return;
      }
      advanceCell({ reverse: true });
    } else if (e.key === "ArrowDown") {
      if (direction != "Down") {
        setDirection("Down");
        return;
      }
      advanceCell();
    } else if (e.key === "ArrowUp") {
      if (direction != "Down") {
        setDirection("Down");
        return;
      }
      advanceCell({ reverse: true });
    } else if (e.key === "Backspace") {
      setUserAnswers(
        userAnswers.map((answer, i) => (i === currentCell ? "" : answer)),
      );
      advanceCell({ reverse: true });
    } else if (e.key === "Enter" || e.key === "Tab") {
      setDirection(direction === "Across" ? "Down" : "Across");
    } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      setUserAnswers(
        userAnswers.map((answer, i) =>
          i === currentCell ? e.key.toUpperCase() : answer,
        ),
      );
      advanceCell();
    }
  };

  const cellColor = (cellIndex: number) => {
    if (!puzzle.body[0].cells[cellIndex].answer) return "bg-black";
    if (currentCell === cellIndex) return "bg-yellow-100";
    if (secondaryCells?.includes(cellIndex)) return "bg-gray-300";
    return "bg-white";
  };

  return (
    <div
      className="flex h-screen flex-col items-center justify-center xl:flex-row"
      onKeyDown={(e) => handleKeyDown(e)}
    >
      <div className="justify-left 3xl:h-[72rem] flex w-[100vw] flex-row p-1 pb-0 md:max-w-3xl xl:h-[48rem] xl:w-11 xl:flex-col">
        <button
          onClick={() => {}}
          className="group relative m-1 flex grow cursor-pointer flex-row justify-center rounded-lg bg-gray-800 p-2 text-gray-400 transition duration-150 hover:bg-blue-600 hover:text-white xl:grow-0"
        >
          <div className="flex h-full items-center">
            <FaGear />
          </div>
          <div className="right-10 m-0 p-0 pl-1 text-sm group-hover:visible xl:invisible xl:absolute xl:justify-end">
            Settings
          </div>
        </button>
        <button
          onClick={() => {}}
          className="group relative m-1 flex grow cursor-pointer flex-row justify-center rounded-lg bg-gray-800 p-2 text-gray-400 transition duration-150 hover:bg-green-500 hover:text-white xl:grow-0"
        >
          <div className="flex h-full items-center">
            <FaCheck />
          </div>
          <div className="right-10 m-0 p-0 pl-1 text-sm group-hover:visible xl:invisible xl:absolute xl:justify-end">
            Check
          </div>
        </button>
        <button
          onClick={() => {}}
          className="group relative m-1 flex grow cursor-pointer flex-row justify-center rounded-lg bg-gray-800 p-2 text-gray-400 transition duration-150 hover:bg-red-700 hover:text-yellow-400 xl:grow-0"
        >
          <div className="flex h-full items-center">
            <FaPencilAlt />
          </div>
          <div className="right-10 m-0 p-0 pl-1 text-sm group-hover:visible group-hover:text-white xl:invisible xl:absolute xl:justify-end">
            Rebus
          </div>
        </button>
      </div>
      <div
        className={`3xl:max-w-6xl grid aspect-square w-[100vw] grid-rows-(--grid-template-rows-15) p-2 md:max-w-3xl`}
      >
        {Array.from({ length: height }).map((_, i) => (
          <div
            key={i}
            className={`grid grid-cols-(--grid-template-columns-15)`}
          >
            {Array.from({ length: width }).map((_, j) => (
              <div
                className={`relative border border-gray-500 ${cellColor(
                  i * width + j,
                )} aspect-square h-auto w-auto`}
                key={`${i * width + j}`}
              >
                {puzzle.body[0].cells[i * width + j].label && (
                  <div className="absolute inset-0 text-xs text-black select-none">
                    {puzzle.body[0].cells[i * width + j].label}
                  </div>
                )}
                {puzzle.body[0].cells[i * width + j].answer && (
                  <>
                    <div className="3xl:text-5xl absolute inset-0 flex items-center justify-center text-3xl text-black select-none">
                      {userAnswers[i * width + j]}
                    </div>
                    <button
                      className="absolute inset-0 z-10 cursor-pointer"
                      onClick={() => handleCellClick(i * width + j)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex w-[100vw] flex-row justify-end overflow-auto md:max-h-[75vh] md:max-w-xl xl:pl-9">
        {["Across", "Down"].map((directionIndex) => {
          return (
            <div key={directionIndex} className="flex w-[50vw] grow flex-col">
              <div className="pt-1 pb-1 pl-3">
                <div className="m-0 p-0 text-xl font-bold">
                  {directionIndex}
                </div>
              </div>
              <ol className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800 overflow-auto p-2">
                {puzzle.body[0].clues.map((clue, i) => {
                  if (clue.direction != directionIndex) return;
                  return (
                    <li
                      key={i}
                      ref={elementsRef.current[i]}
                      className={`font-white text-sm hover:bg-gray-800 ${
                        clue.cells.includes(currentCell) &&
                        clue.direction === direction
                          ? "bg-gray-900"
                          : ""
                      }`}
                    >
                      <button
                        className="size-full cursor-pointer p-1 text-left"
                        onClick={() => {
                          setCurrentCell(clue.cells[0]);
                          setDirection(clue.direction);
                        }}
                      >
                        {clue.label}. {clue.text[0].plain}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}
