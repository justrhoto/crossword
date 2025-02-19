"use client";

import { useEffect, useState, useRef } from "react";
import { FaGear, FaCheck } from "react-icons/fa6";
import _puzzle from "./crossword.json";
import { FaPencilAlt } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { Puzzle, Clue } from "../types/types";
import { PuzzleGrid } from "../components/PuzzleGrid";
import { PuzzleClues } from "../components/PuzzleClues";

const Home = () => {
  const puzzle = _puzzle as Puzzle;
  const [currentCell, setCurrentCell] = useState(0);
  const [direction, setDirection] = useState<"Across" | "Down">("Across");
  const [cookies, setCookie] = useCookies(["userAnswers"]);
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array.from({ length: puzzle.body[0].cells.length }, () => ""),
  );
  const hasSetUserAnswers = useRef(false);

  useEffect(() => {
    if (!hasSetUserAnswers.current && cookies.userAnswers) {
      setUserAnswers(cookies.userAnswers);
      hasSetUserAnswers.current = true;
    }
  }, [cookies.userAnswers]);

  useEffect(() => {
    setCookie("userAnswers", userAnswers);
  }, [userAnswers, setCookie]);

  const clearPuzzle = () => {
    setUserAnswers(
      Array.from({ length: puzzle.body[0].cells.length }, () => ""),
    );
  };

  const handleCellClick = (cellIndex: number) => {
    if (currentCell === cellIndex) {
      setDirection(direction === "Across" ? "Down" : "Across");
    } else {
      setCurrentCell(cellIndex);
    }
  };

  const handleClueClick = (clue: Clue) => {
    setCurrentCell(clue.cells[0]);
    setDirection(clue.direction);
  };

  const isCellUsable = (cellIndex: number) => {
    return !!puzzle.body[0].cells[cellIndex].answer;
  };

  const advanceCell = ({ reverse = false }: { reverse?: boolean } = {}) => {
    const { width, height } = puzzle.body[0].dimensions;
    if (direction === "Across") {
      if (reverse) {
        if (currentCell % width == 0) return;
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
        let nextCell = currentCell - height;
        if (nextCell < 0) return;
        while (!isCellUsable(nextCell) && nextCell - height >= 0)
          nextCell -= height;
        if (!isCellUsable(nextCell)) return;
        setCurrentCell(nextCell);
      } else {
        let nextCell = currentCell + height;
        if (nextCell >= puzzle.body[0].cells.length) return;
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
      e.preventDefault();
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

  const [showSettings, setShowSettings] = useState(false);
  const SettingsDialog = () => {
    return (
      <div className="bg-opacity-50 absolute inset-0 top-14 z-10 bg-black/50">
        <div className="absolute top-40 left-1/2 w-100 -translate-x-1/2 -translate-y-1/2 transform bg-slate-600">
          <div className="m-2 flex w-full items-center p-2">
            <FaGear className="mr-2" /> Settings
          </div>
          <button
            className="p-2"
            onClick={() => {
              clearPuzzle();
            }}
          >
            Settings
          </button>
          <div className="p-2">Settings</div>
          <div className="p-2">Settings</div>
        </div>
      </div>
    );
  };

  const OptionButtons = () => {
    return (
      <div className="justify-left 3xl:h-[72rem] flex w-[100vw] flex-row p-1 pb-0 md:max-w-3xl xl:h-[48rem] xl:w-11 xl:flex-col">
        {showSettings && <SettingsDialog />}
        <div className="relative flex grow xl:grow-0">
          <button
            onClick={() => {
              setShowSettings(!showSettings);
            }}
            className="group relative m-1 flex grow cursor-pointer flex-row justify-center rounded-lg bg-gray-800 p-2 text-gray-400 transition duration-150 hover:bg-blue-600 hover:text-white xl:grow-0"
          >
            <div className="flex h-full items-center">
              <FaGear />
            </div>
            <div className="right-10 m-0 p-0 pl-1 text-sm group-hover:visible xl:invisible xl:absolute xl:justify-end">
              Settings
            </div>
          </button>
        </div>
        <div className="relative flex grow xl:grow-0">
          <button
            onClick={() => {}}
            className="group relative m-1 flex grow cursor-pointer flex-row justify-center rounded-lg bg-gray-800 p-2 text-gray-400 transition duration-150 hover:bg-green-500 hover:text-white focus:bg-green-500 focus:text-white xl:grow-0"
          >
            <div className="flex h-full items-center">
              <FaCheck />
            </div>
            <div className="right-10 m-0 p-0 pl-1 text-sm group-hover:visible group-focus:visible xl:invisible xl:absolute xl:justify-end">
              Check
            </div>
            <div
              className={`absolute top-full z-15 m-1 w-full scale-0 rounded-lg border-2 border-green-800 bg-black text-left opacity-0 transition-opacity duration-150 group-focus:scale-100 group-focus:opacity-100 md:max-w-[16rem] xl:-top-1 xl:left-full xl:w-40 xl:max-w-[11rem]`}
            >
              <ul>
                <li className="p-1 transition-colors hover:bg-green-600">
                  <a className="grow">Check Cell</a>
                </li>
                <li className="border-t-1 border-b-1 p-1 transition-colors hover:bg-green-700">
                  <a>Check Word</a>
                </li>
                <li className="p-1 transition-colors hover:bg-green-800">
                  <a>Check Puzzle</a>
                </li>
              </ul>
            </div>
          </button>
        </div>
        <div className="relative flex grow xl:grow-0">
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
      </div>
    );
  };

  return (
    <div
      className="flex h-screen flex-col items-center justify-center xl:flex-row"
      onKeyDown={(e) => handleKeyDown(e)}
    >
      <OptionButtons />
      <PuzzleGrid
        puzzle={puzzle}
        onCellClick={(i) => handleCellClick(i)}
        currentCell={currentCell}
        direction={direction}
        userAnswers={userAnswers}
      />
      <PuzzleClues
        puzzle={puzzle}
        currentCell={currentCell}
        direction={direction}
        onClueClick={(clue) => handleClueClick(clue)}
      />
    </div>
  );
};

export default Home;
