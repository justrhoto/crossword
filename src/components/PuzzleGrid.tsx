import { useEffect, useState } from "react";
import { Puzzle } from "../types/types";

export const PuzzleGrid = (props: {
  puzzle: Puzzle;
  onCellClick: (cellIndex: number) => void;
  currentCell: number;
  direction: "Across" | "Down";
  userAnswers: string[];
}) => {
  const {
    cells,
    dimensions: { height, width },
  } = props.puzzle.body[0];
  const [secondaryCells, setSecondaryCells] = useState<number[]>();

  const cellColor = (cellIndex: number) => {
    if (!cells[cellIndex].answer) return "bg-black";
    if (props.currentCell === cellIndex) return "bg-yellow-100";
    if (secondaryCells?.includes(cellIndex)) return "bg-gray-300";
    return "bg-white";
  };

  useEffect(() => {
    const { currentCell, direction, puzzle } = props;
    const {
      cells,
      dimensions: { height, width },
    } = puzzle.body[0];
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
  }, [props]);

  return (
    <div
      className={`3xl:max-w-6xl grid aspect-square w-[100vw] grid-rows-(--grid-template-rows-15) p-2 md:max-w-3xl`}
    >
      {Array.from({ length: height }).map((_, i) => (
        <div key={i} className={`grid grid-cols-(--grid-template-columns-15)`}>
          {Array.from({ length: width }).map((_, j) => (
            <div
              className={`relative border border-gray-500 ${cellColor(
                i * width + j,
              )} aspect-square h-auto w-auto`}
              key={`${i * width + j}`}
            >
              {cells[i * width + j].label && (
                <div className="absolute inset-0 text-xs text-black select-none">
                  {cells[i * width + j].label}
                </div>
              )}
              {cells[i * width + j].answer && (
                <>
                  <div className="3xl:text-5xl absolute inset-0 flex items-center justify-center text-3xl text-black select-none">
                    {props.userAnswers[i * width + j]}
                  </div>
                  <button
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={() => props.onCellClick(i * width + j)}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
