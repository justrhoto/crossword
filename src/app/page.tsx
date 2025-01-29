import _puzzle from './crossword.json';

interface Puzzle {
  body: {
    board: string;
    cells: {
      answer: string;
      clues: [number, number];
      label: string;
      type: number;
    }[]
    clueLists: unknown;
    clues: unknown;
    dimensions: {
      height: number;
      width: number;
    }
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
  }
}

export default function Home() {
  const puzzle = _puzzle as Puzzle;


  return (
    <div className={`grid grid-rows-${puzzle.body[0].dimensions.width} items-center`}>
      {Array.from({ length: puzzle.body[0].dimensions.height }).map((_, i) => (
        <div key={i} className="grid grid-cols-15 gap-0">
          {Array.from({ length: puzzle.body[0].dimensions.width }).map((_, j) => (
            <div className="border border-gray-500 w-6 h-6" key={`${i}-${j}`}>X</div>
          ))}
        </div>
      ))}
    </div>
  );
}
