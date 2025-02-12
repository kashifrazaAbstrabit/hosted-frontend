import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../types/reduxTypes";
import xClose from "../assets/x-close.svg";
import Loading from "../components/common/Loading";
import { clearErrors, inviteDevMember } from "../redux/inviteUserSlice";

const InviteDevMemberModal = ({
  isOpenCreateDevTeam,
  setIsOpenCreateDevTeam,
  fetchData,
  setIsOpenActiveDropDown,
  setIsOpenInvitedDropDown,
}: {
  isOpenCreateDevTeam: boolean;
  setIsOpenCreateDevTeam: (isOpen: boolean) => void;
  fetchData: any;
  setIsOpenActiveDropDown: (isOpen: boolean) => void;
  setIsOpenInvitedDropDown: (isOpen: boolean) => void;
}) => {
  const { error } = useSelector((state: RootState) => state.inviteUser);
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const [loadingMain, setLoadingMain] = useState(false);

  const handleCloseCreateDevTeam = () => {
    setIsOpenCreateDevTeam(false);
  };

  const handleAddEmails = () => {
    const newEmails = inputValue
      .split(/[\s,]+/)
      .filter((email) => email && valiEmail(email));
    setEmails((prevEmails) => [...new Set([...prevEmails, ...newEmails])]);
    setInputValue("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails((prevEmails) =>
      prevEmails.filter((email) => email !== emailToRemove)
    );
  };

  const valiEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCreateDevTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emails.length === 0) {
      setErrorMessage("Please add at least one email.");
      return;
    }

    try {
      setLoadingMain(true);
      await dispatch(inviteDevMember(emails));
      fetchData();
      setEmails([]);
      setIsOpenCreateDevTeam(false);
      setIsOpenInvitedDropDown(true);
      setIsOpenActiveDropDown(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to send invites.";
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingMain(false);
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmails();
    }
  };

  return (
    <div
      className={`fixed overflow-auto -top-5 flex items-center justify-center left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
        isOpenCreateDevTeam ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <form className="gap-5" onSubmit={handleCreateDevTeam}>
        <div className="bg-white w-[500px] mx-auto rounded-lg shadow-lg p-7">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Invite People</h1>
            <img
              className="cursor-pointer w-5 h-5 hover:bg-gray-300 rounded-full hover:text-white"
              onClick={handleCloseCreateDevTeam}
              src={xClose}
              alt="closeIcon"
            />
          </div>
          <p className="text-sm mt-1">
            New members will gain access to public spaces, Docs, and Dashboards.
          </p>

          {errorMessage && (
            <p className="text-white my-3 text-center py-1.5 bg-red-700 font-medium text-base">
              {errorMessage}
            </p>
          )}

          <div className={`${errorMessage ? "mb-5" : "my-6"}`}>
            <label className="font-medium">Invite by email</label>
            <div className="relative w-full mt-1 flex flex-wrap items-center  rounded-md">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center my-2 bg-gray-200 text-sm text-gray-700 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Email, comma or space separated and press enter"
                name="email"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} // Add this
                className="w-full pl-3 outline-none py-2 focus:ring focus:ring-[var(--button-bg-color)] border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4 items-center justify-end">
            <div
              onClick={handleCloseCreateDevTeam}
              className="px-4 cursor-pointer py-1.5 bg-[#fff] rounded-lg hover:bg-[#52637D] hover:text-white text-[#52637D] text-lg border-[#52637D] border-[1px]"
            >
              Cancel
            </div>
            <button
              type="submit"
              className="bg-[var(--button-bg-color)] flex items-center font-medium gap-2 justify-center text-black py-2 px-4 rounded-md hover:bg-[var(--button-bg-color)] transition-all shadow-md cursor-pointer"
            >
              Send Invite {loadingMain ? <Loading /> : ""}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InviteDevMemberModal;
