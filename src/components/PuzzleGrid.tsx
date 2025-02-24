import { Puzzle, PuzzleCursor } from "@/types/types";
import { UserAnswer } from "@/lib/UserAnswer";

export const PuzzleGrid = (props: {
  puzzle: Puzzle;
  onCellClick: (cellIndex: number) => void;
  puzzleCursor: PuzzleCursor;
  userAnswers: UserAnswer[];
}) => {
  const {
    cells,
    dimensions: { height, width },
  } = props.puzzle.body[0];
  const { currentCell, wordCells } = props.puzzleCursor;
  const { userAnswers, onCellClick } = props;

  const cellColor = (cellIndex: number) => {
    if (!cells[cellIndex].answer) return "bg-black";
    if (currentCell === cellIndex) return "bg-yellow-100";
    if (wordCells?.includes(cellIndex)) return "bg-gray-300";
    return "bg-white";
  };

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
              {userAnswers[i * width + j].checked &&
                !userAnswers[i * width + j].correct && (
                  <div className="absolute inset-0 bg-red-500/30" />
                )}
              {userAnswers[i * width + j].checked &&
                userAnswers[i * width + j].correct && (
                  <div className="absolute inset-0 bg-green-500/30" />
                )}
              {cells[i * width + j].answer && (
                <>
                  <div className="3xl:text-5xl absolute inset-0 flex items-center justify-center text-3xl text-black select-none">
                    {userAnswers[i * width + j].answer}
                  </div>
                  <button
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={() => onCellClick(i * width + j)}
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
