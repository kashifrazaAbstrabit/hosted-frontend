import React, { useState, useRef } from "react";
import { FaUpload, FaLink, FaClipboard } from "react-icons/fa";

import xClose from "../assets/x-close.svg";
import { TbWorld } from "react-icons/tb";

import {  useSelector } from "react-redux";
import {  RootState } from "../types/reduxTypes";
import { toast } from "react-toastify";
import Loading from "../components/common/Loading";
import customAxios from "../api/axios";
import axios from "axios";

const AddSources = ({
  isOpenAddSource,
  setIsOpenAddSource,
  setIsOpenWebsiteUrl,
  setIsOpenPastedText,
  selectedProjectId,
  fetchAllProjectKnowlegeDocs,
}: {
  isOpenAddSource: boolean;
  setIsOpenAddSource: (isOpen: boolean) => void;
  setIsOpenWebsiteUrl: (isOpen: boolean) => void;
  setIsOpenPastedText: (isOpen: boolean) => void;
  selectedProjectId: number;
  fetchAllProjectKnowlegeDocs: any;
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { loading } = useSelector((state: RootState) => state.documents);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const hanldeUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedFile) {
        toast.error("Please select a file to upload.");
        return;
      }

      // Normalize file name for compatibility
      const normalizedFileName = selectedFile.name.replace(
        /[^a-zA-Z0-9_.-]/g,
        "_"
      );

      const data = {
        fileName: normalizedFileName,
        projectId: selectedProjectId,
        contentType: selectedFile.type,
      };

      const response = await customAxios.post(
        `${baseUrl}/api/v1/documents/azure/upload`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const uploadUrl = response?.data?.data?.uploadUrl;
      if (!uploadUrl) {
        throw new Error("Upload URL not found in the response.");
      }

      // Step 2: Upload the file to Azure Blob Storage
      const fileData = new Blob([selectedFile], { type: selectedFile.type });

      const headers = {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": selectedFile.type || "application/octet-stream",
      };

      const res = await axios.put(uploadUrl, fileData, {
        headers,
      });

      if (res.status === 201) {
        toast.success("File uploaded successfully!");
        setIsOpenAddSource(false);
        await fetchAllProjectKnowlegeDocs();
        setSelectedFile(null);
      }
    } catch (error: any) {
      let errorMessage = "Upload failed. Please try again.";

      if (error.response) {
        errorMessage =
          error.response.data?.error?.message ||
          error.response.data?.message ||
          "Upload failed due to a server error.";
      } else if (error.request) {
        errorMessage =
          "No response from the server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Upload Error:", error);
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex -top-5 items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpenAddSource ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <div className="w-[calc(100%-288px)] mx-auto left-72 ml-72 px-24">
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">Add Sources</h2>
            <img
              className="cursor-pointer w-5 h-5 hover:bg-gray-300 rounded-full hover:text-white"
              onClick={() => setIsOpenAddSource(false)}
              src={xClose}
              alt="closeIcon"
            />
          </div>

          <p className="text-black mb-6">
            Sources let IntelliDev base its responses on the information that
            matters most to you.
            <br />
            (Examples: marketing plans, course reading, research notes, meeting
            transcripts, sales documents, etc.)
          </p>

          <div
            className={`border-2 border-dashed border-spacing-8 ${
              isDragging
                ? "border-[var(--button-bg-color)] border-4"
                : "border-gray-300"
            } rounded-lg flex flex-col items-center p-6 text-center mb-6`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="bg-green-300 rounded-full p-5 mb-4">
              <FaUpload className="text-black text-4xl" />
            </div>
            <p className="text-black text-xl font-medium mb-4">
              Upload Sources
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Drag & drop or{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={handleChooseFileClick}
              >
                choose file
              </span>{" "}
              to upload
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Supported file types: PDF, txt, and doc.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.jpg,.png,.xlsx,.jpeg,.doc,.txt"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          {selectedFile && (
            <div className="text-center mb-6">
              <p className="text-black text-sm">
                Selected file: <strong>{selectedFile.name}</strong>
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 my-6 ">
            {/* <div className="border rounded-xl border-green-500 p-4 space-y-8 flex flex-col items-start cursor-pointer ">
              <div className="flex items-center justify-center gap-x-3">
                <FaGoogleDrive className="text-2xl mb-0 text-black" />
                <p className=" font-medium  text-xl">Google Drive</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-black">
                <button className="border px-5 py-2 flex items-center text-sm rounded-full bg-[#EEEEEE]  ">
                  <SiGoogledocs className="mr-2 text-xl" /> Google Docs
                </button>
                <button className="border px-5 py-2 text-sm rounded-full bg-[#EEEEEE] ">
                  Google Slides
                </button>
              </div>
            </div> */}

            <div className="border rounded-xl border-green-500 p-4 space-y-8 flex flex-col items-start cursor-pointer">
              <div className="flex items-center justify-center gap-x-3">
                <FaLink className="text-2xl text-black" />
                <p className="text-xl font-medium">Link</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-black">
                <button
                  onClick={() => setIsOpenWebsiteUrl(true)}
                  className="border px-5 py-2 flex items-center text-sm rounded-full bg-[#EEEEEE]  "
                >
                  <TbWorld className="text-xl text-black mr-2" /> Website
                </button>
              </div>
            </div>

            <div className="border rounded-xl border-green-500 p-4 space-y-8 flex flex-col items-start cursor-pointer">
              <div className="flex items-center justify-center gap-x-3">
                <FaClipboard className="text-xl text-black" />
                <p className="text-xl font-medium">Paste text</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-black">
                <button
                  onClick={() => setIsOpenPastedText(true)}
                  className="border px-5 py-2 flex items-center text-sm rounded-full bg-[#EEEEEE]"
                >
                  Pasted Text
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsOpenAddSource(false)}
              className="bg-[#EEEEEE] text-black px-4 py-2 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              onClick={hanldeUploadFile}
              className="px-5 py-2 bg-[var(--button-bg-color)] text-black font-medium hover:bg-[var(--button-bg-color)] rounded-lg"
            >
              Upload {loading && <Loading />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSources;
