import  { useState } from "react";

import xClose from "../assets/x-close.svg";
import url from "../assets/url.svg";

const AddWebsiteUrl = ({
  isOpenWebsiteUrl,
  setIsOpenWebsiteUrl,
}: {
  isOpenWebsiteUrl: boolean;
  setIsOpenWebsiteUrl: (isOpen: boolean) => void;
}) => {
  const [urlValue, setUrlValue] = useState<string>("");

  return (
    <div
      className={`fixed inset-0 flex -top-5 items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpenWebsiteUrl ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <div className="w-[calc(100%-288px)] mx-auto left-72 ml-72 px-24">
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">Website URL</h2>
            <img
              className="cursor-pointer w-5 h-5 hover:bg-gray-300 rounded-full hover:text-white"
              onClick={() => setIsOpenWebsiteUrl(false)}
              src={xClose}
              alt="closeIcon"
            />
          </div>

          <p className="text-[#0B0B0B99] text-xl font-medium mb-6">
            Paste in a Web URL below to upload as a source in IntelliDev.
          </p>

          <div className="my-5 relative">
            <img src={url} alt="" className="absolute top-3 left-3" />
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="Enter url (eg. https://www.example.com)"
              className="w-full ps-11 py-3 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
            />
          </div>

          <div className="mt-5 mb-40">
            <h1 className="text-base font-medium">Notes</h1>
            <ul className="text-base font-medium text-[#0B0B0B99] list-disc ms-10 mt-3 mb-10">
              <li>
                Only the visible text on the website will be imported at this
                moment
              </li>
              <li>Paid articles are not supported</li>
            </ul>
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

export default AddWebsiteUrl;
