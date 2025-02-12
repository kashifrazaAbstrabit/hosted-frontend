import { useState } from "react";

import xClose from "../assets/x-close.svg";

const AddCopiedText = ({
  isOpenPastedText,
  setIsOpenPastedText,
}: {
  isOpenPastedText: boolean;
  setIsOpenPastedText: (isOpen: boolean) => void;
}) => {
  const [urlValue, setUrlValue] = useState<string>("");

  return (
    <div
      className={`fixed inset-0 flex -top-5 items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpenPastedText ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <div className="w-[calc(100%-288px)] mx-auto left-72 ml-72 px-24">
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">Paste copied text</h2>
            <img
              className="cursor-pointer w-5 h-5 hover:bg-gray-300 rounded-full hover:text-white"
              onClick={() => setIsOpenPastedText(false)}
              src={xClose}
              alt="closeIcon"
            />
          </div>

          <p className="text-[#0B0B0B99] text-xl font-medium mb-6">
            Paste your copied text below to upload as a source in IntelliDev
          </p>

          <div className="mt-10 mb-36">
            <textarea
              value={urlValue}
              rows={10}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="Paste Text here.."
              className="w-full ps-4 py-3 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button className="px-5 py-2 bg-[var(--button-bg-color)] text-black font-medium hover:bg-[var(--button-bg-color)] rounded-lg">
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCopiedText;
