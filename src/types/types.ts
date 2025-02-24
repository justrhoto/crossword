export interface Puzzle {
  body: {
    board: string;
    cells: {
      answer: string;
      clues: [number, number];
      label: string;
      type: number;
    }[];
    clueLists: unknown;
    clues: Clue[];
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

export interface Clue {
  cells: number[];
  direction: "Across" | "Down";
  label: string;
  text: {
    plain: string;
  }[];
}

export interface PuzzleCursor {
  currentCell: number;
  direction: "Across" | "Down";
  wordCells: number[];
}
