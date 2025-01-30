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
    clues: {
      cells: number[];
      direction: string;
      label: string;
      text: {
        plain: string;
      }[];
    }[];
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
    <div className="flex flex-col md:flex-row justify-center items-center h-screen">
      <div className={`grid grid-rows-${puzzle.body[0].dimensions.width} w-[100vw] md:max-w-3xl aspect-square p-2`}>
        {Array.from({ length: puzzle.body[0].dimensions.height }).map((_, i) => (
          <div key={i} className={`grid grid-cols-${puzzle.body[0].dimensions.height}`}>
            {Array.from({ length: puzzle.body[0].dimensions.width }).map((_, j) => (
              <div className={`relative border border-gray-500 ${puzzle.body[0].cells[(i * 15) + j].answer ? 'bg-white' : 'bg-black'} aspect-square w-auto h-auto`} key={`${i}-${j}`}>
                {puzzle.body[0].cells[(i * 15) + j].label &&
                  <div className="absolute inset-0 text-xs text-black select-none">
                    {puzzle.body[0].cells[(i * 15) + j].label}
                  </div>}
                {puzzle.body[0].cells[(i * 15) + j].answer &&
                  <div className="absolute inset-0 flex justify-center items-center text-3xl text-black select-none">
                    {puzzle.body[0].cells[(i * 15) + j].answer}
                  </div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-row w-[100vw] md:max-w-xl md:max-h-[75vh] justify-end overflow-scroll">
        {['Across', 'Down'].map((direction) => {
          return (
            <div key={direction} className="flex flex-col w-[50vw] overflow-scroll grow">
              <div className="p-2">
                <div className="text-xl font-bold m-0 p-0">{direction}</div>
              </div>
              <ol className="p-2 overflow-scroll">
                {puzzle.body[0].clues.map((clue, i) => {
                  if (clue.direction != direction) return;
                  return (
                    <li key={i} className="text-sm font-white">
                      {clue.label}. {clue.text[0].plain}
                    </li>
                  );
                })}
              </ol>
            </div>
          )
        })}
      </div>
    </div>
  );
}
