import { useState } from "react";
import { Clue, Puzzle } from "@/types/types";
import { PuzzleClues } from "@/components/PuzzleClues";
import { PuzzleGrid } from "@/components/PuzzleGrid";

export const PuzzleController = (props: {
  puzzle: Puzzle;
  userAnswers: string[];
  setUserAnswers: (answers: string[]) => void;
}) => {
  const [direction, setDirection] = useState<"Across" | "Down">("Across");
  const { puzzle, userAnswers, setUserAnswers } = props;
  const [currentCell, setCurrentCell] = useState(0);

  const isCellUsable = (cellIndex: number) => {
    return !!puzzle.body[0].cells[cellIndex].answer;
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

  return (
    <div
      className="flex h-auto flex-col items-center xl:flex-row"
      onKeyDown={(e) => handleKeyDown(e)}
    >
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
