"use client";

import { useEffect, useState, useRef } from "react";
import _puzzle from "./crossword.json";
import { useCookies } from "react-cookie";
import { Puzzle } from "@/types/types";
import { PuzzleController } from "@/components/PuzzleController";
import { OptionButtons } from "@/components/OptionButtons";

const Home = () => {
  const puzzle = _puzzle as Puzzle;

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

  return (
    <div className="flex h-screen flex-col items-center justify-center xl:flex-row">
      <OptionButtons clearPuzzle={clearPuzzle} />
      <PuzzleController
        puzzle={puzzle}
        userAnswers={userAnswers}
        setUserAnswers={(str) => setUserAnswers(str)}
      />
    </div>
  );
};

export default Home;
