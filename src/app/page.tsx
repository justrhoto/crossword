"use client";

import { useEffect, useState, useRef } from "react";
import _puzzle from "./crossword.json";
import { useCookies } from "react-cookie";
import { Puzzle, PuzzleCursor } from "@/types/types";
import { PuzzleController } from "@/components/PuzzleController";
import { OptionButtons } from "@/components/OptionButtons";
import { UserAnswer } from "@/lib/UserAnswer";

const Home = () => {
  const puzzle = _puzzle as Puzzle;

  const [cookies, setCookie] = useCookies(["userAnswers"]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(
    Array.from(
      { length: puzzle.body[0].cells.length },
      () => new UserAnswer(""),
    ),
  );
  const hasSetUserAnswers = useRef(false);
  const [puzzleCursor, setPuzzleCursor] = useState<PuzzleCursor>({
    currentCell: 0,
    direction: "Across",
    wordCells: [],
  });

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
      Array.from(
        { length: puzzle.body[0].cells.length },
        () => new UserAnswer(""),
      ),
    );
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center xl:flex-row">
      <OptionButtons
        clearPuzzle={clearPuzzle}
        puzzleCursor={puzzleCursor}
        userAnswers={userAnswers}
        setUserAnswers={(answers) => setUserAnswers(answers)}
      />
      <PuzzleController
        puzzle={puzzle}
        userAnswers={userAnswers}
        setUserAnswers={(answers) => setUserAnswers(answers)}
        setPuzzleCursor={(cursor) => setPuzzleCursor(cursor)}
      />
    </div>
  );
};

export default Home;
