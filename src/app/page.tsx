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
    <div className="flex justify-center items-center h-screen">
      <div className={`grid grid-rows-${puzzle.body[0].dimensions.width} h-2/3 aspect-square`}>
        {Array.from({ length: puzzle.body[0].dimensions.height }).map((_, i) => (
          <div key={i} className={`grid grid-cols-${puzzle.body[0].dimensions.height}`}>
            {Array.from({ length: puzzle.body[0].dimensions.width }).map((_, j) => (
              <div className={`border border-gray-500 ${puzzle.body[0].cells[(i * 15) + j].answer ? 'bg-white' : 'bg-black'} aspect-square w-auto h-auto`} key={`${i}-${j}`}>
                <div className="text-[1.2vh] text-black">
                  {puzzle.body[0].cells[(i * 15) + j].label}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
