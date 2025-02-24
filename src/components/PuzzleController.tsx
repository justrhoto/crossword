import { useEffect, useState } from "react";
import { Clue, Puzzle, PuzzleCursor } from "@/types/types";
import { PuzzleClues } from "@/components/PuzzleClues";
import { PuzzleGrid } from "@/components/PuzzleGrid";
import { UserAnswer } from "@/lib/UserAnswer";

export const PuzzleController = (props: {
  puzzle: Puzzle;
  userAnswers: UserAnswer[];
  setUserAnswers: (answers: UserAnswer[]) => void;
  setPuzzleCursor: (cursor: PuzzleCursor) => void;
}) => {
  const [direction, setDirection] = useState<"Across" | "Down">("Across");
  const { puzzle, userAnswers, setUserAnswers, setPuzzleCursor } = props;
  const [currentCell, setCurrentCell] = useState(0);
  const [cursor, setCursor] = useState<PuzzleCursor>({
    currentCell: 0,
    direction: "Across",
    wordCells: [],
  });

  useEffect(() => {
    setPuzzleCursor(cursor);
  }, [cursor, setPuzzleCursor]);

  useEffect(() => {
    const {
      cells,
      dimensions: { height, width },
    } = puzzle.body[0];
    const wordCells = [];
    wordCells.push(currentCell);
    if (direction === "Across") {
      let cellIndex = currentCell;
      while (cellIndex % width != 0 && cells[cellIndex - 1].answer) {
        wordCells.push(--cellIndex);
      }
      cellIndex = currentCell;
      while ((cellIndex + 1) % width != 0 && cells[cellIndex + 1].answer) {
        wordCells.push(++cellIndex);
      }
    } else {
      let cellIndex = currentCell;
      while (cellIndex >= width && cells[cellIndex - width].answer) {
        wordCells.push((cellIndex -= width));
      }
      cellIndex = currentCell;
      while (
        cellIndex < width * height - width &&
        cells[cellIndex + width].answer
      ) {
        wordCells.push((cellIndex += width));
      }
    }
    setCursor({ currentCell, direction, wordCells });
  }, [currentCell, direction, puzzle.body]);

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
        userAnswers.map((answer, i) =>
          i === currentCell ? new UserAnswer("") : answer,
        ),
      );
      advanceCell({ reverse: true });
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      setDirection(direction === "Across" ? "Down" : "Across");
    } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      setUserAnswers(
        userAnswers.map((answer, i) =>
          i === currentCell
            ? new UserAnswer({
                answer: e.key.toUpperCase(),
                checked: false,
                correct: e.key.toUpperCase() === puzzle.body[0].cells[i].answer,
              })
            : answer,
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
        puzzleCursor={cursor}
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
