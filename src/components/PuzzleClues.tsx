import { createRef, useEffect, useRef } from "react";
import { Puzzle, Clue } from "@/types/types";

export const PuzzleClues = (props: {
  puzzle: Puzzle;
  currentCell: number;
  direction: "Across" | "Down";
  onClueClick: (clue: Clue) => void;
}) => {
  const { puzzle, currentCell, direction } = props;
  const elementsRef = useRef(
    puzzle.body[0].clues.map(() => createRef<HTMLLIElement>()),
  );

  useEffect(() => {
    const currentClue =
      puzzle.body[0].cells[currentCell].clues[direction === "Across" ? 0 : 1];
    elementsRef.current[currentClue].current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentCell, direction, puzzle.body]);

  return (
    <div className="flex h-[50vh] w-[100vw] flex-row justify-end md:max-h-[75vh] md:max-w-xl xl:pl-9">
      {["Across", "Down"].map((directionIndex) => {
        return (
          <div key={directionIndex} className="flex w-[50vw] grow flex-col">
            <div className="pt-1 pb-1 pl-3">
              <div className="m-0 p-0 text-xl font-bold">{directionIndex}</div>
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
                      onClick={() => props.onClueClick(clue)}
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
  );
};
