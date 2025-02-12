import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../types/reduxTypes";
import xClose from "../assets/x-close.svg";
import Loading from "../components/common/Loading";
import { createDocument } from "../redux/documentSlice";
import { useNavigate } from "react-router-dom";


const CreateNewDocument = ({
  isOpenCreateDocument,
  setIsOpenCreateDocument,
  fetchAllDocs,
  selectedProjectId,
}: {
  isOpenCreateDocument: boolean;
  setIsOpenCreateDocument: (isOpen: boolean) => void;
  fetchAllDocs: any;
  selectedProjectId: number;
}) => {
  const [title, setTitle] = useState<string>("");
  const [isShared, setIsShared] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loadingCreate } = useSelector(
    (state: RootState) => state.documents
  );
  const navigate = useNavigate();



  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleCreateDocumets = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const documentData = {
        title,
        isShared,
        projectId: selectedProjectId,
      };
      await dispatch(createDocument(documentData, setIsOpenCreateDocument , navigate));
      await fetchAllDocs();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to send invites.";
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      //   setLoadingMain(false);
    }
  };


  return (
    <div
      className={`fixed overflow-auto -top-5 flex items-center justify-center left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
        isOpenCreateDocument ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <form className="gap-5" onSubmit={handleCreateDocumets}>
        <div className="bg-white w-[500px] mx-auto rounded-lg shadow-lg p-7">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Create a new document</h1>
            <img
              className="cursor-pointer w-5 h-5 hover:bg-gray-300 rounded-full hover:text-white"
              onClick={() => setIsOpenCreateDocument(false)}
              src={xClose}
              alt="closeIcon"
            />
          </div>

          {errorMessage && (
            <p className="text-white my-3 text-center py-1.5 bg-red-700 font-medium text-base">
              {errorMessage}
            </p>
          )}

          <div className={`${errorMessage ? "mb-5" : "my-6"}`}>
            <label className="font-medium">Document Name</label>
            <div className="relative w-full mt-1 flex flex-wrap items-center  rounded-md">
              <input
                type="text"
                placeholder="Enter document name"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-3 outline-none py-2 focus:ring focus:ring-[var(--button-bg-color)] border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center mb-5">
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="w-5 h-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--button-bg-color)]"
            />
            <label className="font-medium ms-2.5">
              Share with the Dev team
            </label>
          </div>

          <div className="flex gap-4 items-center justify-end">
            <button
              type="submit"
              className="bg-[var(--button-bg-color)] flex items-center font-medium gap-2 justify-center text-black py-2 px-4 rounded-md hover:bg-[var(--button-bg-color)] transition-all shadow-md cursor-pointer"
            >
              Create
              {loadingCreate ? <Loading /> : ""}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateNewDocument;
