import React, { useEffect, useState } from "react";
import { TbWorld } from "react-icons/tb";
import { AppDispatch, RootState } from "../../types/reduxTypes";
import { IoLink } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SecureDataFileInterface } from "../../types/secureTypes";
import {
  createsecureFileStore,
  resetSuccessFile,
} from "../../redux/securedStoreSlice";
import Loading from "../../components/common/Loading";
import axios from "axios";
import DiscardUnSaveChange from "../../popup/DiscardUnSaveChange";
import customAxios from "../../api/axios";

const AddFileData = ({
  isFileOpenPopup,
  setIsFileOpenPopup,
  projects,
  setIsCredentialOpenPopup,
  setIsChangeDiscardForFileData,
  isChangeDiscardForFileData,
  fetchFileData,
  setIsCredentialOpen,
  setIsFileOpen,
}: {
  isFileOpenPopup: boolean;
  setIsFileOpenPopup: (value: boolean) => void;
  projects: any;
  setIsCredentialOpenPopup: (value: boolean) => void;
  setIsChangeDiscardForFileData: (value: boolean) => void;
  isChangeDiscardForFileData: boolean;
  fetchFileData: any;
  setIsCredentialOpen: (value: boolean) => void;
  setIsFileOpen: (value: boolean) => void;
}) => {
  const [itemName, setItemName] = useState("");
  const [note, setNote] = useState("");
  const [uploadPhoto, setUploadPhoto] = useState<string | null>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const [selectedProject, setSelectedProject] = useState<number | undefined>(
    undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [shareWithDev, setShareWithDev] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loadingCreateFile, successFile } = useSelector(
    (state: RootState) => state.securedStore
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const hanldeUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedFile) {
        toast.error("Please select a file to upload.");
        return;
      }

      if (!selectedProject) {
        toast.error("Please select a project.");
        return;
      }

      // Normalize file name for compatibility
      const normalizedFileName = selectedFile.name.replace(
        /[^a-zA-Z0-9_.-]/g,
        "_"
      );

      const data = {
        fileName: normalizedFileName,
        projectId: selectedProject,
        contentType: selectedFile.type,
      };

      const response = await customAxios.post(
        `${baseUrl}/api/v1/secure-store/file/upload`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const uploadUrl = response?.data?.data?.uploadUrl;
      const blobPath = response?.data?.data?.blobPath;
      if (blobPath) {
        setUploadPhoto(blobPath);
      }
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

      console.log(res, "finalupload");

      if (res.status === 201) {
        toast.success("File uploaded successfully!");
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

  const onClose = () => {
    setIsFileOpenPopup(false);
  };

  const reset = () => {
    setItemName("");
    setItemName("");
    setNote("");
    setSelectedProject(undefined);
    setShareWithDev(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }

    // Handle form submission logic
    const secureData: SecureDataFileInterface = {
      fileUrl: uploadPhoto,
      notes: note,
      isShared: shareWithDev,
      itemName,
      projectId: selectedProject ?? 0,
    };

    try {
      await dispatch(createsecureFileStore(secureData));
      await fetchFileData();
    } catch (error) {}

    // onClose();
  };

  useEffect(() => {
    if (successFile) {
      setIsFileOpenPopup(false);
      setIsCredentialOpen(false);
      setIsFileOpen(true);
      toast.success("New file created successfully");
      reset();
      dispatch(resetSuccessFile());
    }
  }, [successFile, dispatch]);

  const validProjects = Array.isArray(projects)
    ? projects.filter(
        (project) =>
          project &&
          typeof project === "object" &&
          "id" in project &&
          "name" in project
      )
    : [];

  const isFormFilled =
    note.trim() !== "" ||
    selectedProject !== undefined ||
    itemName.trim() !== "" ||
    shareWithDev;

  return (
    <div>
      <div
        className={`fixed inset-0 -top-4  -mt-10 flex items-end justify-end bg-black bg-opacity-50 z-50 transition-opacity ${
          isFileOpenPopup ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        <div className="bg-[#EEEEEE] sidebar-scrollbar overflow-y-auto  w-[600px] ml-auto h-screen rounded-lg shadow-lg p-8 space-y-6">
          <button
            onClick={onClose}
            className="text-gray-500 bg-white mt-7 w-full h-0  rounded-full text-2xl flex justify-end items-end hover:text-gray-700"
          >
            &times;
          </button>
          <form onSubmit={handleSubmit} className=" space-y-6 relative -top-8">
            {/* Header */}
            <div className="flex justify-start items-center gap-x-4">
              <div className="bg-white p-3 rounded-xl border border-black">
                <TbWorld className="text-4xl" />
              </div>
              <h1 className="text-lg font-semibold ">
                Confidential Repository
              </h1>

              <select
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  if (e.target.value === "Credentials") {
                    setIsCredentialOpenPopup(true);
                    setIsFileOpenPopup(false);
                  } else {
                    setIsCredentialOpenPopup(false);
                    setIsFileOpenPopup(true);
                  }
                }}
                value={selectedOption || "Files/Data"}
                className="px-4 py-2.5 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
              >
                <option value="Credentials">Credentials</option>
                <option value="Files/Data">Files/Data</option>
              </select>
            </div>

            {/* Login Details */}
            <div className="space-y-5 bg-white p-5 rounded-lg text-base">
              <div className="space-y-2">
                <label className="text-base">Confidential Repository</label>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-2.5 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
                />
              </div>

              <div className="bg-white   rounded-lg space-y-2">
                <label className="block text-base font-medium">
                  Item Organization
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
                >
                  <option value="">Select a project</option>
                  {validProjects &&
                    validProjects.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              <textarea
                placeholder="Note"
                value={note}
                rows={3}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-2.5 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
              ></textarea>
            </div>

            {/* Item Organization */}

            <div className="space-y-4 bg-white p-5 rounded-lg text-base">
              <div className="flex items-center rounded-lg">
                <label className="w-full rounded-lg flex items-center text-base  border justify-between px-4 py-2.5 text-[#9AA2AE]  cursor-pointer">
                  <input
                    type="file"
                    name="file"
                    accept=".pdf,.docx,.jpg,.png , .xlsx"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  Upload secure file (Max 100MB)
                  <div className="">
                    <IoLink className="text-xl rotate-90 text-[#9AA2AE]" />
                  </div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                {selectedFile && (
                  <div className="text-center">
                    <p className="text-black text-sm">
                      Selected file: <strong>{selectedFile.name}</strong>
                    </p>
                  </div>
                )}

                {!selectedFile && <div></div>}
                {selectedFile && (
                  <div
                    onClick={hanldeUploadFile}
                    className="bg-blue-600 cursor-pointer py-1 px-4 rounded-lg text-white text-sm"
                  >
                    Upload
                  </div>
                )}
              </div>
            </div>

            {/* Sharing Options */}
            <div className="flex items-start gap-4 bg-white p-5 rounded-lg flex-col ">
              <label className="text-base">Sharing Options</label>
              <div className="flex items-center justify-center gap-x-2">
                <input
                  type="checkbox"
                  checked={shareWithDev}
                  onChange={() => setShareWithDev(!shareWithDev)}
                  className="w-6 h-6 px-4 py-2.5 border-none outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
                />
                <label className="text-base">Share with the Dev team</label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 border-t pt-4">
              <button
                type="button"
                onClick={() => setIsChangeDiscardForFileData(true)}
                disabled={!isFormFilled}
                className={`px-4 py-2 rounded-lg border ${
                  isFormFilled
                    ? "bg-gray-300 text-black hover:bg-gray-400"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 flex items-center gap-x-2 py-2 bg-[var(--button-bg-color)] text-black font-medium rounded-lg hover:bg-green-300"
              >
                Save {loadingCreateFile && <Loading />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isChangeDiscardForFileData && (
        <DiscardUnSaveChange
          message="Closing this editing view will discard all your unsaved changes"
          onCancel={() => setIsChangeDiscardForFileData(false)}
          onConfirm={() => {
            reset();
            setIsChangeDiscardForFileData(false);
          }}
        />
      )}
    </div>
  );
};

export default AddFileData;
