import React, { useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { FaRegCopy } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../types/reduxTypes";
import { updatesecureStore } from "../../redux/securedStoreSlice";
import { SecureDataInterface } from "../../types/secureTypes";
import Loading from "../../components/common/Loading";
import { toast } from "react-toastify";
import DiscardUnSaveChange from "../../popup/DiscardUnSaveChange";

const EditCredential = ({
  isEditForCredential,
  setIsEditForCredential,
  projects,

  setIsEditForFile,
  setIsChangeDiscardForCredential,
  isChangeDiscardForCredential,
  fetchData,
  setIsCredentialOpen,
  setIsFileOpen,
  selectedCredentialEdit,
}: {
  isEditForCredential: boolean;
  setIsEditForCredential: (value: boolean) => void;
  projects: any;
  setIsEditForFile: (value: boolean) => void;
  setIsChangeDiscardForCredential: (value: boolean) => void;
  isChangeDiscardForCredential: boolean;
  fetchData: any;
  setIsCredentialOpen: (value: boolean) => void;
  setIsFileOpen: (value: boolean) => void;

  selectedCredentialEdit: any;
}) => {
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [itemName, setItemName] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | undefined>(
    undefined
  );
  const [shareWithDev, setShareWithDev] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    (selectedCredentialEdit && "Credentials") || ""
  );
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const { loadingEdit, successEditCredential } = useSelector(
    (state: RootState) => state.securedStore
  );

  const onClose = () => {
    setIsEditForCredential(false);
  };

  useEffect(() => {
    if (selectedCredentialEdit) {
      setUsername(selectedCredentialEdit?.username);
      setUrl(selectedCredentialEdit?.url);
      setItemName(selectedCredentialEdit?.itemName);
      setNote(selectedCredentialEdit?.notes);
      setShareWithDev(selectedCredentialEdit?.sharedWith);
      setPassword(selectedCredentialEdit?.password);
      setSelectedProject(selectedCredentialEdit?.projectId);
    }
  }, [selectedCredentialEdit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }
    // Handle form submission logic
    const secureData: SecureDataInterface = {
      url,
      username,
      password,
      notes: note,
      isShared: shareWithDev,
      itemName,
      projectId: selectedProject ?? 0,
    };

    try {
      await dispatch(updatesecureStore(secureData, selectedCredentialEdit?.id));
      fetchData();
    } catch (error) {}

    // onClose();
  };

  const validProjects = Array.isArray(projects)
    ? projects.filter(
        (project) =>
          project &&
          typeof project === "object" &&
          "id" in project &&
          "name" in project
      )
    : [];

  const [copiedRowId, setCopiedRowId] = useState<boolean | null>(false);

  const copyPassword = (password: string) => {
    if (password.trim() === "") return;
    navigator.clipboard.writeText(password);

    setCopiedRowId(true);

    // Reset the copied message after 2 seconds
    setTimeout(() => {
      setCopiedRowId(false);
    }, 2000);
  };

  const reset = () => {
    setItemName("");
    setUrl("");
    setUsername("");
    setItemName("");
    setPassword("");
    setNote("");
    setSelectedProject(undefined);
    setShareWithDev(false);
  };

  useEffect(() => {
    if (successEditCredential) {
      setIsEditForCredential(false);
      setIsCredentialOpen(true);
      setIsFileOpen(false);
      toast.success("Credential updated successfully");
      reset();
    }
  }, [successEditCredential]);

  const isFormFilled =
    url?.trim() !== "" ||
    username?.trim() !== "" ||
    password?.trim() !== "" ||
    note?.trim() !== "" ||
    selectedProject !== undefined ||
    itemName?.trim() !== "" ||
    shareWithDev;

  return (
    <div>
      <div
        className={`fixed inset-0 flex items-end justify-end bg-black bg-opacity-50 z-50 transition-opacity ${
          isEditForCredential ? "opacity-100" : "opacity-0 hidden"
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
              <h1 className="text-lg font-semibold ">Edit a login</h1>
              <select
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  if (e.target.value === "Credentials") {
                    setIsEditForCredential(true);
                    setIsEditForFile(false);
                  } else if (e.target.value === "Files/Data") {
                    setIsEditForCredential(false);
                    setIsEditForFile(true);
                  }
                }}
                value={selectedOption || "Credentials"}
                className="px-4 py-2.5 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
              >
                <option value="Credentials">Credentials</option>
                <option value="Files/Data">Files/Data</option>
              </select>
            </div>

            {/* Login Details */}
            <div className="space-y-4 bg-white p-5 rounded-lg text-base">
              <label className="text-base">Login Details</label>
              <input
                type="url"
                placeholder="Url (eg.https://www.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-10 top-3 text-gray-500"
                >
                  {showPassword ? (
                    <MdVisibility className="text-xl" />
                  ) : (
                    <MdVisibilityOff className="text-xl" />
                  )}
                </button>

                <FaRegCopy
                  onClick={() => copyPassword(password)}
                  className="text-xl cursor-pointer absolute right-3 top-3"
                />

                {copiedRowId === true && (
                  <span className="absolute top-2  right-8 bg-green-500 text-white text-base px-2 py-1 rounded">
                    Copied!
                  </span>
                )}
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
              <div className="bg-white   rounded-lg space-y-3">
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
              <div className="space-y-3">
                <label className="block text-base font-medium">Item Name</label>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-2.5 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
                />
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
                onClick={() => setIsChangeDiscardForCredential(true)}
                disabled={!isFormFilled} // Disable button if form is empty
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
                Update {loadingEdit && <Loading />}
              </button>
            </div>
          </form>
        </div>
      </div>
      {isChangeDiscardForCredential && (
        <DiscardUnSaveChange
          message="Closing this editing view will discard all your unsaved changes"
          onCancel={() => setIsChangeDiscardForCredential(false)}
          onConfirm={() => {
            reset();
            setIsChangeDiscardForCredential(false);
          }}
        />
      )}
    </div>
  );
};

export default EditCredential;
