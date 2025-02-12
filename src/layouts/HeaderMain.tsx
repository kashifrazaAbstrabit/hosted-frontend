import { useLocation } from "react-router-dom";
import { User } from "../types/userTypes";
import SelectProject, {
  ProjectOption,
} from "../components/common/SelectProject";
import { useEffect, useRef, useState } from "react";
import { SingleValue } from "react-select";
const HeaderMain = ({
  open,
  page,
  setIsOpenCreateDevTeam,
  user,
  setIsCredentialOpen,
  setIsFileOpenPopup,
  setSelectedProjectDetails,
}: {
  open: boolean;
  page: string;
  setIsOpenCreateDevTeam: (isOpen: boolean) => void;
  user: User | null;

  setIsCredentialOpen: (isOpenStore: boolean) => void;
  setIsFileOpenPopup: (isOpenStore: boolean) => void;
  setSelectedProjectDetails: (value: SingleValue<ProjectOption>) => void;
}) => {
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${
        !open
          ? "w-[calc(100%-80px)] left-20 ml-20"
          : "w-[calc(100%-288px)] ml-72 left-72"
      } bg-white sticky top-0 z-50 right-0 sidebar-scrollbar py-5   px-10`}
    >
      <div
        ref={dropdownRef}
        className="flex pb-3 relative items-center justify-between border-r-0 border-2 border-t-0 border-l-0 border-b-gray-300  w-full"
      >
        <div className={`flex items-center justify-start gap-x-10`}>
          <h2 className="text-black text-2xl  border-4 border-y-0 ps-3 border-r-0 border-l-[var(--button-bg-color)] font-bold">
            {(location?.state?.title || "Manage Project") || localStorage.getItem("activeSidebar")}
          </h2>
          {page !== "/manage-project" && page !== "/dev-teams" && (
            <div className="w-80">
              <SelectProject
                setSelectedProjectDetails={setSelectedProjectDetails}
              />
            </div>
          )}
        </div>
        {user?.user_type === "client" && page === "/dev-teams" && (
          <button
            onClick={() => setIsOpenCreateDevTeam(true)}
            className="px-5 py-2 bg-[var(--button-bg-color)] font-semibold  rounded-lg flex items-center justify-center  text-lg"
          >
            + Invite Dev Member
          </button>
        )}
        {user?.user_type === "client" && page === "/secured-store" && (
          <button
            onClick={() => {
              setIsOpenDropDown(!isOpenDropDown);
            }}
            className=" w-36 py-2 bg-[var(--button-bg-color)] font-semibold  rounded-lg flex items-center justify-center  text-lg"
          >
            + Add New
          </button>
        )}

        {isOpenDropDown && (
          <div className="absolute z-50 top-12 right-0 w-36 rounded-xl shadow-md bg-white">
            <button
              onClick={() => setIsCredentialOpen(true)}
              className="py-2 w-full hover:rounded-t-xl font-medium ps-0 text-black hover:bg-[var(--button-bg-color)]"
            >
              Credentials
            </button>
            <div className="border border-b-gray-50 w-full"></div>
            <button
              onClick={() => setIsFileOpenPopup(true)}
              className="py-2 w-full left-0 hover:rounded-b-xl font-medium  text-black hover:bg-[var(--button-bg-color)]"
            >
              File/Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderMain;
