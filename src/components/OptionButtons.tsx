import { FaGear, FaCheck } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { useState } from "react";

export const OptionButtons = (props: { clearPuzzle: () => void }) => {
  const { clearPuzzle } = props;
  const [showSettings, setShowSettings] = useState(false);
  const SettingsDialog = () => {
    return (
      <div
        className="bg-opacity-50 absolute inset-0 z-15 bg-black/50"
        onClick={() => setShowSettings(false)}
      >
        <div
          className="absolute top-40 left-1/2 z-20 w-100 -translate-x-1/2 -translate-y-1/2 transform bg-slate-600"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="m-2 flex w-full items-center p-2">
            <FaGear className="mx-2" /> Settings
          </div>
          <hr className="my-2 border-t border-gray-300" />
          <div className="my-5 flex w-full justify-between">
            <div className="mx-5 content-center p-2">Clear All Answers</div>
            <button
              className="m-2 mx-5 cursor-pointer justify-end rounded-lg bg-slate-950 p-2 transition duration-150 hover:bg-red-600"
              onClick={() => {
                clearPuzzle();
              }}
            >
              Reset Puzzle
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="justify-left 3xl:h-[72rem] flex w-[100vw] flex-row p-1 pb-0 md:max-w-3xl xl:h-[48rem] xl:w-11 xl:flex-col">
      {showSettings && <SettingsDialog />}
      <div className="relative flex grow xl:grow-0">
        <button
          onClick={() => {
            setShowSettings(!showSettings);
          }}
          className="group relative m-1 flex grow cursor-pointer flex-row justify-center rounded-lg bg-gray-800 p-2 text-gray-400 transition duration-150 hover:bg-blue-600 hover:text-white xl:grow-0"
        >
          <div className="flex h-full items-center">
            <FaGear />
          </div>
          <div className="right-10 m-0 p-0 pl-1 text-sm group-hover:visible xl:invisible xl:absolute xl:justify-end">
            Settings
          </div>
        </button>
      </div>
      <div className="relative flex grow xl:grow-0">
        <button
          onClick={() => {}}
          className="group relative m-1 flex grow cursor-pointer flex-row justify-center rounded-lg bg-gray-800 p-2 text-gray-400 transition duration-150 hover:bg-green-500 hover:text-white focus:bg-green-500 focus:text-white xl:grow-0"
        >
          <div className="flex h-full items-center">
            <FaCheck />
          </div>
          <div className="right-10 m-0 p-0 pl-1 text-sm group-hover:visible group-focus:visible xl:invisible xl:absolute xl:justify-end">
            Check
          </div>
          <div
            className={`absolute top-full z-15 m-1 w-full scale-0 rounded-lg border-2 border-green-800 bg-black text-left opacity-0 transition-opacity duration-150 group-focus:scale-100 group-focus:opacity-100 md:max-w-[16rem] xl:-top-1 xl:left-full xl:w-40 xl:max-w-[11rem]`}
          >
            <ul>
              <li className="p-1 transition-colors hover:bg-green-600">
                <a className="grow">Check Cell</a>
              </li>
              <li className="border-t-1 border-b-1 p-1 transition-colors hover:bg-green-700">
                <a>Check Word</a>
              </li>
              <li className="p-1 transition-colors hover:bg-green-800">
                <a>Check Puzzle</a>
              </li>
            </ul>
          </div>
        </button>
      </div>
      <div className="relative flex grow xl:grow-0">
        <button
          onClick={() => {}}
          className="group relative m-1 flex grow cursor-pointer flex-row justify-center rounded-lg bg-gray-800 p-2 text-gray-400 transition duration-150 hover:bg-red-700 hover:text-yellow-400 xl:grow-0"
        >
          <div className="flex h-full items-center">
            <FaPencilAlt />
          </div>
          <div className="right-10 m-0 p-0 pl-1 text-sm group-hover:visible group-hover:text-white xl:invisible xl:absolute xl:justify-end">
            Rebus
          </div>
        </button>
      </div>
    </div>
  );
};
