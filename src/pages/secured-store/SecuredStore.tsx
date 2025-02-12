import { useState, useEffect } from "react";
import { MoreVert } from "@mui/icons-material";
import { MdEdit } from "react-icons/md";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../types/reduxTypes";

import Loading from "../../components/common/Loading";

import MetaData from "../../components/common/MetaData";
import AddNewCredential from "./AddNewCredential";
import AddFileData from "./AddFileData";

import { LightTooltip } from "../../utils/help";
import {
  deleteSecureCredetial,
  deleteSecureFile,
  fetchsecureFileStore,
  fetchsecureStore,
  singleSecureFileStore,
  singleSecureStore,
} from "../../redux/securedStoreSlice";
import CredentialInfoModal from "../../popup/CredentialInfoModal";
import FileInfoModal from "../../popup/FileInfoModal";

import EditCredential from "./EditCredential";
import EditFile from "./EditFile";
import Popup from "../../popup/Popup";

import NoDataFound from "../../components/common/NoDataFound";

interface RowForCredential {
  id: number;
  itemName: string;
  username: string;
  password: string;
  projectName: string;
  note: string;
  website: string;
}

interface RowForFileData {
  id: number;
  itemName: string;
  secureFile: string;
  note: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const SecuredStore = ({
  open,
  isCredentialOpenPopup,
  setIsCredentialOpenPopup,
  isFileOpenPopup,
  setIsFileOpenPopup,
  selectedProjectDetails,
}: {
  open: boolean;
  isCredentialOpenPopup: boolean;
  setIsCredentialOpenPopup: (isOpenStore: boolean) => void;
  isFileOpenPopup: boolean;
  setIsFileOpenPopup: (isOpenStore: boolean) => void;
  selectedProjectDetails: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);

  const {
    securedStore,
    securedFileStore,
    isDeletedForCredential,
    isDeletedForFile,
    securedSotreDetail,
    secruedSotreFileDetail,
    loadingCredential,
    loadingFile,
  } = useSelector((state: RootState) => state.securedStore);

  const projectSelected = JSON.parse(
    localStorage.getItem("selectedProject") || '""'
  );

  const [selectedUrl, setSelectedUrl] = useState<string | null>("");

  const [isChangeDiscardForCredential, setIsChangeDiscardForCredential] =
    useState<boolean>(false);
  const [isChangeDiscardForFileData, setIsChangeDiscardForFileData] =
    useState<boolean>(false);

  const [isCredentialOpen, setIsCredentialOpen] = useState<boolean>(true);
  const [isFileOpen, setIsFileOpen] = useState<boolean>(false);

  const fetchData = async () => {
    await dispatch(fetchsecureStore(selectedProjectDetails?.value));
  };

  const fetchFileData = async () => {
    await dispatch(fetchsecureFileStore(selectedProjectDetails?.value));
  };

  useEffect(() => {
    if (selectedProjectDetails?.value) {
      fetchData();
      fetchFileData();
    }
  }, [dispatch, selectedProjectDetails?.value]);

  //searching filtering technique -------------------------------------------------------------------------------------------------->

  const [rowsForCredential, setRowsCredential] = useState<RowForCredential[]>(
    []
  );
  const [rowsForFile, setRowsForFile] = useState<RowForFileData[]>([]);

  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});

  const togglePasswordVisibility = (rowId: number) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const [copiedRowId, setCopiedRowId] = useState<number | null>(null);
  const [copiedRowIdForUsername, setCopiedRowIdUsername] = useState<
    number | null
  >(null);
  const [copiedRowIdForWebsite, setCopiedRowIdWebsite] = useState<
    number | null
  >(null);

  const copyPassword = (rowId: number, password: string) => {
    navigator.clipboard.writeText(password);
    setCopiedRowId(rowId);

    // Reset the copied message after 2 seconds
    setTimeout(() => {
      setCopiedRowId(null);
    }, 2000);
  };

  const copyPasswordForUsername = (rowId: number, password: string) => {
    navigator.clipboard.writeText(password);
    setCopiedRowIdUsername(rowId);

    // Reset the copied message after 2 seconds
    setTimeout(() => {
      setCopiedRowIdUsername(null);
    }, 2000);
  };

  const copyPasswordForWebsite = (rowId: number, password: string) => {
    navigator.clipboard.writeText(password);
    setCopiedRowIdWebsite(rowId);

    // Reset the copied message after 2 seconds
    setTimeout(() => {
      setCopiedRowIdWebsite(null);
    }, 2000);
  };

  //for credentila users
  const [selectedCredentialRowId, setSelectedCredentialrowId] = useState<
    number | undefined
  >(undefined);
  const [selectedCredentialItem, setSelectedCredentialItem] =
    useState<string>("");

  //for credentila users
  const [selectedFileRowId, setSelectedFilerowId] = useState<
    number | undefined
  >(undefined);
  const [selectedFileItem, setSelectedFilealItem] = useState<string>("");

  const [showConfirmationForCredential, setShowConfirmationForCredential] =
    useState<boolean>(false);
  const [showConfirmationForFile, setShowConfirmationFile] =
    useState<boolean>(false);

  const cancelDeleteForCredential = () => {
    setShowConfirmationForCredential(false);
  };

  const cancelDeleteForFile = () => {
    setShowConfirmationFile(false);
  };

  const handleDeleteCredential = (obj: any) => {
    setShowConfirmationForCredential(true);
    setSelectedCredentialrowId(obj.row?.id);
    setSelectedCredentialItem(obj.row?.itemName);
  };

  const handleDeleteFile = (obj: any) => {
    setShowConfirmationFile(true);
    setSelectedFilerowId(obj.row?.id);
    setSelectedFilealItem(obj.row?.itemName);
  };

  const handleDeleteCredentialRow = async () => {
    if (selectedCredentialRowId !== undefined) {
      await dispatch(deleteSecureCredetial(selectedCredentialRowId));
      fetchData();
      setShowConfirmationForCredential(false);
    }
  };

  const handleDeleteFileRow = async () => {
    if (selectedFileRowId !== undefined) {
      await dispatch(deleteSecureFile(selectedFileRowId));
      fetchFileData();
      setShowConfirmationFile(false);
    }
  };

  const [isOpenCredentialInfo, setIsOpenCredentialInfo] =
    useState<boolean>(false);
  const [isOpenFilenfo, setIsOpenfileInfo] = useState<boolean>(false);
  const [isEditForCredential, setIsEditForCredential] =
    useState<boolean>(false);

  const [isEditForFile, setIsEditForFile] = useState<boolean>(false);

  const handleRowClickforCredential = async (id: number) => {
    setIsOpenCredentialInfo(true);

    await dispatch(singleSecureStore(id));
  };

  const handleRowClickforFile = async (id: number) => {
    setIsOpenfileInfo(true);
    await dispatch(singleSecureFileStore(id));
  };

  const handleEditProjectForCredential = async (id: number) => {
    await dispatch(singleSecureStore(id));
  };

  const handleEditProjectForFile = async (id: number) => {
    await dispatch(singleSecureFileStore(id));
  };

  let columnsForCredentials: GridColDef<(typeof rowsForCredential)[number]>[] =
    [
      {
        field: "itemName",
        headerName: "Item Name",
        headerClassName: "header-color",
        cellClassName: "header-color1",
        width: 300,
        renderCell: (params) => (
          <div className="mt-5">
            <h1
              onClick={() => handleRowClickforCredential(params?.row?.id)}
              className=" cursor-pointer hover:underline ms-2 text-black text-base leading-6 font-medium"
            >
              {params.value}
            </h1>
          </div>
        ),
      },
      {
        field: "projectName",
        headerName: "Project Name",
        headerClassName: "header-color",
        cellClassName: "header-color1",
        width: 300,
        renderCell: (params) => (
          <div className="mt-5">
            <h1 className="  ms-2 text-black text-base leading-6 font-medium">
              {params.value}
            </h1>
          </div>
        ),
      },
      {
        field: "username",
        headerName: "Username",
        headerClassName: "header-color",
        cellClassName: "header-color1",
        width: 300,
        renderCell: (params) => {
          return (
            <div className="mt-5 relative ps-2 flex items-center justify-between">
              <h1 className="  ms-2 text-black text-base leading-6 font-medium">
                {params.value}
              </h1>
              <LightTooltip title="Copy">
                <div className="flex gap-x-1.5 flex-shrink-0">
                  <FaRegCopy
                    onClick={() =>
                      copyPasswordForUsername(params.row.id, params.value)
                    }
                    className="text-xl cursor-pointer"
                  />
                </div>
              </LightTooltip>
              {copiedRowIdForUsername === params.row.id && (
                <span className="absolute  right-6 bg-green-500 text-white text-base px-2 py-1 rounded">
                  Copied!
                </span>
              )}
            </div>
          );
        },
      },

      {
        field: "password",
        headerName: "Passsword",
        headerClassName: "header-color",
        cellClassName: "header-color1",
        width: 350,
        renderCell: (params) => {
          const isPasswordVisible = passwordVisibility[params.row.id] || false;
          return (
            <div className="mt-5 relative ps-2  flex items-center justify-between">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="py-0 w-full text-base border-none outline-none"
                readOnly
                value={params.value}
              />

              <div className="flex gap-x-1.5 flex-shrink-0">
                {isPasswordVisible ? (
                  <FaEye
                    onClick={(e) => {
                      togglePasswordVisibility(params.row.id);
                      e.stopPropagation();
                    }}
                    className="text-xl cursor-pointer"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={(e) => {
                      togglePasswordVisibility(params.row.id);
                      e.stopPropagation();
                    }}
                    className="text-xl cursor-pointer"
                  />
                )}
                <LightTooltip title="Copy">
                  <FaRegCopy
                    onClick={(e) => {
                      e.stopPropagation();
                      copyPassword(params.row.id, params.value);
                    }}
                    className="text-xl cursor-pointer"
                  />
                </LightTooltip>
              </div>
              {copiedRowId === params.row.id && (
                <span className="absolute  right-6 bg-green-500 text-white text-base px-2 py-1 rounded">
                  Copied!
                </span>
              )}
            </div>
          );
        },
      },

      {
        field: "website",
        headerName: "Link",
        headerClassName: "header-color",
        cellClassName: "header-color1",
        width: 450,
        renderCell: (params) => {
          return (
            <div className="mt-5 flex items-center justify-between relative w-full">
              <LightTooltip title={params.value}>
                <button
                  onClick={() => {
                    window.open(params.value, "_blank");
                  }}
                  className="text-left text-[#0000FF] text-base leading-6 font-medium hover:underline hover:underline-offset-2 
                     w-96 truncate"
                >
                  {params.value}
                </button>
              </LightTooltip>

              <LightTooltip title="Copy">
                <div className="flex gap-x-1.5 flex-shrink-0">
                  <FaRegCopy
                    onClick={(e) => {
                      e.stopPropagation();
                      copyPasswordForWebsite(params.row.id, params.value);
                    }}
                    className="text-xl cursor-pointer"
                  />
                </div>
              </LightTooltip>
              {copiedRowIdForWebsite === params.row.id && (
                <span className="absolute  right-6 bg-green-500 text-white text-base px-2 py-1 rounded">
                  Copied!
                </span>
              )}
            </div>
          );
        },
      },
      {
        field: "note",
        headerName: "Note",
        headerClassName: "header-color",
        cellClassName: "header-color1",
        width: 450,
        renderCell: (params) => {
          const text = params.value || "";
          const maxLength = 45;

          return (
            <div className="mt-5 flex items-center justify-between relative w-full">
              <LightTooltip title={text}>
                <div className="text-base font-medium cursor-pointer">
                  {text.length > maxLength
                    ? text.slice(0, maxLength) + "..."
                    : text}{" "}
                </div>
              </LightTooltip>
            </div>
          );
        },
      },

      {
        field: "actions",
        headerName: "Actions",
        headerClassName: "header-color",
        cellClassName: "header-color1",
        width: 100,

        renderCell: (params) => {
          return (
            <Menu as="div" className="fixed inline-block text-left mt-2 z-10">
              <div
                className="actions-column z-10"
                style={{ paddingLeft: "20px" }}
              >
                <MenuButton
                  style={{
                    zIndex: "-1",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className=" justify-center gap-x-1.5   z-0 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  <div className="w-5 h-5 flex border-2 border-gray-300  mt-1 z-0 items-center rotate-90 rounded-full p-5 justify-center">
                    <MoreVert className="text-[#52637D] z-0 text-xl" />
                  </div>
                </MenuButton>
              </div>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems
                  style={{
                    zIndex: "9999999999999",
                  }}
                  className="absolute top-3 right-11 w-36 h-[81px] z-100 rounded-xl  origin-bottom-right  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="font-medium">
                    <MenuItem>
                      {({ focus }) => (
                        <div>
                          <Link
                            onClick={() => {
                              setIsEditForCredential(true);
                              handleEditProjectForCredential(params?.row?.id);
                            }}
                            to="#"
                            className={classNames(
                              focus
                                ? "bg-[var(--button-bg-color)] rounded-t-lg  text-black font-semibold flex items-center gap-x-1"
                                : "text-black font-semibold rounded-lg flex items-center gap-1",
                              "block px-4 py-2 text-base"
                            )}
                          >
                            <MdEdit className="mr-2 text-lg" />
                            Edit
                          </Link>
                        </div>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ focus }) => (
                        <div>
                          <Link
                            to="#"
                            onClick={() => handleDeleteCredential(params)}
                            className={classNames(
                              focus
                                ? "bg-[var(--button-bg-color)] rounded-b-lg  text-red-600 font-semibold flex items-center gap-x-1"
                                : "text-red-600 rounded-b-lg  font-semibold flex items-center gap-1",
                              "block px-4 py-2 text-base"
                            )}
                          >
                            <MdDelete className="mr-2 text-lg" /> Delete
                          </Link>
                        </div>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          );
        },
      },
    ];

  let columnsForFileData: GridColDef<(typeof rowsForFile)[number]>[] = [
    {
      field: "itemName",
      headerName: "Item Name",
      headerClassName: "header-color",
      cellClassName: "header-color1",
      width: 350,
      renderCell: (params) => (
        <div className="mt-5">
          <h1
            onClick={() => handleRowClickforFile(params?.row?.id)}
            className=" cursor-pointer hover:underline ms-2 text-black text-base leading-6 font-medium"
          >
            {params.value}
          </h1>
        </div>
      ),
    },
    {
      field: "projectName",
      headerName: "Project Name",
      headerClassName: "header-color",
      cellClassName: "header-color1",
      width: 300,
      renderCell: (params) => (
        <div className="mt-5">
          <h1 className="  ms-2 text-black text-base leading-6 font-medium">
            {params.value}
          </h1>
        </div>
      ),
    },
    {
      field: "secureFile",
      headerName: "Secure File",
      headerClassName: "header-color",
      cellClassName: "header-color1",
      width: 420,
      renderCell: (params) => {
        const handleDownload = () => {
          if (params.value) {
            const link = document.createElement("a");
            link.href = params.value;
            link.setAttribute(
              "download",
              params.value.split("?")[0].split("/").pop()
            ); // Extracts filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            alert("File not available for download.");
          }
        };

        return (
          <div className="mt-5 flex items-center justify-between">
            <h1
              className="text-left text-black text-base leading-6 font-medium hover:underline hover:underline-offset-2 
                     w-80 truncate"
            >
              {params.value
                ? decodeURIComponent(
                    params.value.split("?")[0].split("/").pop()
                  )
                : "No File"}
            </h1>
            <LightTooltip title="Download File">
              <button onClick={handleDownload} className="me-5">
                <IoMdDownload className="text-xl text-blue-600" />
              </button>
            </LightTooltip>
          </div>
        );
      },
    },

    {
      field: "note",
      headerName: "Note",
      headerClassName: "header-color",
      cellClassName: "header-color1",
      width: 550,
      renderCell: (params) => {
        const text = params.value || "";

        const maxLength = 60;

        return (
          <div className="mt-5 flex items-center justify-between relative w-full">
            <LightTooltip title={text}>
              <div className="text-base font-medium cursor-pointer">
                {text.length > maxLength
                  ? text.slice(0, maxLength) + "..."
                  : text}{" "}
              </div>
            </LightTooltip>
          </div>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "header-color",
      cellClassName: "header-color1",
      width: 100,

      renderCell: (params) => {
        return (
          <Menu as="div" className="fixed inline-block text-left mt-2 z-10">
            <div
              className="actions-column z-10"
              style={{ paddingLeft: "20px" }}
            >
              <MenuButton
                style={{
                  zIndex: "-1",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className=" justify-center gap-x-1.5   z-0 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                <div className="w-5 h-5 flex border-2 border-gray-300  mt-1 z-0 items-center rotate-90 rounded-full p-5 justify-center">
                  <MoreVert className="text-[#52637D] z-0 text-xl" />
                </div>
              </MenuButton>
            </div>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems
                style={{
                  zIndex: "9999999999999",
                }}
                className="absolute top-3 right-11 w-36 h-[81px] z-100 rounded-xl  origin-bottom-right  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="font-medium">
                  <MenuItem>
                    {({ focus }) => (
                      <div>
                        <Link
                          onClick={() => {
                            setIsEditForFile(true);
                            handleEditProjectForFile(params?.row?.id);
                            setSelectedUrl(params?.row?.secureFile);
                          }}
                          to="#"
                          className={classNames(
                            focus
                              ? "bg-[var(--button-bg-color)] rounded-t-lg  text-black font-semibold flex items-center gap-x-1"
                              : "text-black font-semibold rounded-lg flex items-center gap-1",
                            "block px-4 py-2 text-base"
                          )}
                        >
                          <MdEdit className="mr-2 text-lg" />
                          Edit
                        </Link>
                      </div>
                    )}
                  </MenuItem>

                  <MenuItem>
                    {({ focus }) => (
                      <div>
                        <Link
                          to="#"
                          onClick={() => handleDeleteFile(params)}
                          className={classNames(
                            focus
                              ? "bg-[var(--button-bg-color)] rounded-b-lg  text-red-600 font-semibold flex items-center gap-x-1"
                              : "text-red-600 rounded-b-lg  font-semibold flex items-center gap-1",
                            "block px-4 py-2 text-base"
                          )}
                        >
                          <MdDelete className="mr-2 text-lg" /> Delete
                        </Link>
                      </div>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        );
      },
    },
  ];

  useEffect(() => {
    if (securedStore && securedStore?.length > 0) {
      const newRows = securedStore?.map((item: any) => ({
        id: item.id,
        username: item.username,
        itemName: item.itemName,
        projectName:
          selectedProjectDetails.value === item.projectId
            ? selectedProjectDetails.label
            : "No Project found with this Id",
        password: item.password,
        website: item.url,
        projectId: item.projectId,
        note: item.notes,
      }));
      setRowsCredential(newRows);
    }

    if (securedFileStore && securedFileStore?.length > 0) {
      const newRows = securedFileStore?.map((item: any) => ({
        id: item.id,
        itemName: item.itemName,
        secureFile: item.fileUrl,
        projectName:
          selectedProjectDetails.value === item.projectId
            ? selectedProjectDetails.label
            : "No Project found with this Id",
        projectId: item.projectId,

        note: item.notes,
      }));
      setRowsForFile(newRows);
    }
  }, [securedStore, securedFileStore]);

  const [searchQueryForCredential, setSearchQueryCredential] = useState("");
  const [searchQueryForFile, setSearchQueryForFile] = useState("");

  const filteredOnSearchAndFilterRowForCredential = rowsForCredential?.filter(
    (row: any) => {
      const searchQuery = searchQueryForCredential?.trim()?.toLowerCase();

      const matchesSearchQuery =
        !searchQuery ||
        row.username?.toLowerCase().includes(searchQuery) ||
        row.itemName?.toLowerCase().includes(searchQuery);

      const selectedProjectId = selectedProjectDetails?.value
        ? Number(selectedProjectDetails.value)
        : null;

      const matchProjectSelected =
        selectedProjectId === null ||
        Number(row.projectId) === selectedProjectId;

      return matchesSearchQuery && matchProjectSelected;
    }
  );

  const filteredOnSearchAndFilerRowForFileData = rowsForFile?.filter(
    (row: any) => {
      const matchesSearchQuery = row.itemName
        ?.toLowerCase()
        .includes(searchQueryForFile.toLowerCase());

      const nameProject = projectSelected?.label || "";
      const matchprojectSelected =
        !nameProject ||
        row.projectName?.toLowerCase().includes(nameProject.toLowerCase());

      return matchesSearchQuery && matchprojectSelected;
    }
  );

  const filterDataForCredential = [
    ...filteredOnSearchAndFilterRowForCredential,
  ].reverse();

  const filterDataForFileData = [
    ...filteredOnSearchAndFilerRowForFileData,
  ].reverse();

  return (
    <div
      className={`${
        !open
          ? "w-[calc(100%-80px)] left-20 ml-20"
          : "w-[calc(100%-288px)] ml-72 left-72"
      } px-10 h-auto space-y-4 pb-20 sidebar-scrollbar`}
    >
      <MetaData title="Secured Store" />

      <div className="space-y-5 ">
        <div className="flex bg-gray-100 ps-5 py-4 items-center justify-start gap-x-2">
          <button onClick={() => setIsCredentialOpen(!isCredentialOpen)}>
            <IoIosArrowDown
              className={`${
                isCredentialOpen ? "rotate-180  text-sky-500 " : ""
              } mt-1 text-2xl`}
            />
          </button>
          <p className="text-2xl font-bold ">
            Credentials{" "}
            {securedStore.length > 0 && (
              <span className="font-normal text-xl">
                ( {filterDataForCredential.length + " credentials"})
              </span>
            )}
          </p>
        </div>
        <div
          className={`w-full ${
            isCredentialOpen ? "h-full" : " h-0"
          } overflow-auto  space-y-5 sidebar-scrollbar`}
        >
          <div className="flex items-center justify-between py-2">
            {securedStore && securedStore?.length > 0 && (
              <div className="flex rounded-xl w-[28%] bg-white items-center justify-center gap-3 ps-2  border-2 border-gray-300">
                <input
                  type="text"
                  value={searchQueryForCredential}
                  onChange={(e) => setSearchQueryCredential(e.target.value)}
                  placeholder="Search by Username or ItemName"
                  className="outline-none w-full text-gray-950 ps-2 bg-white focus:outline-1 py-2.5 text-lg"
                />
                <button className="me-1 hover:bg-gray-300 rounded-full p-3">
                  <FaSearch className="text-gray-400" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#fff] h-full z-10 w-full flex items-center justify-center">
            {filterDataForCredential?.length > 0 ? (
              <DataGrid
                rows={filterDataForCredential}
                columns={columnsForCredentials}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                rowHeight={67}
                className="mb-10"
                sx={{
                  "& .MuiDataGrid-virtualScroller": {
                    paddingBottom: "70px",
                  },
                }}
              />
            ) : loadingCredential ? (
              <Loading />
            ) : (
              <NoDataFound />
            )}
          </div>
        </div>

        {showConfirmationForCredential && (
          <Popup
            message={
              <>
                Are you sure you want to delete this{" "}
                <strong>"{selectedCredentialItem}"</strong>?
              </>
            }
            onConfirm={handleDeleteCredentialRow}
            onCancel={cancelDeleteForCredential}
            loading={isDeletedForCredential}
          />
        )}

        {isOpenCredentialInfo && (
          <CredentialInfoModal
            isOpenCredentialInfo={isOpenCredentialInfo}
            setIsOpenCredentialInfo={setIsOpenCredentialInfo}
            selectedProject={securedSotreDetail}
            setIsEditForCredential={setIsEditForCredential}
            setShowConfirmationForCredential={setShowConfirmationForCredential}
            setSelectedCredentialrowId={setSelectedCredentialrowId}
            setSelectedCredentialItem={setSelectedCredentialItem}
          />
        )}

        <AddNewCredential
          isCredentialOpenPopup={isCredentialOpenPopup}
          setIsCredentialOpenPopup={setIsCredentialOpenPopup}
          projects={projects}
          setIsFileOpenPopup={setIsFileOpenPopup}
          setIsChangeDiscardForCredential={setIsChangeDiscardForCredential}
          isChangeDiscardForCredential={isChangeDiscardForCredential}
          fetchData={fetchData}
          setIsCredentialOpen={setIsCredentialOpen}
          setIsFileOpen={setIsFileOpen}
        />

        <EditCredential
          isEditForCredential={isEditForCredential}
          setIsEditForCredential={setIsEditForCredential}
          projects={projects}
          setIsEditForFile={setIsEditForFile}
          setIsChangeDiscardForCredential={setIsChangeDiscardForCredential}
          isChangeDiscardForCredential={isChangeDiscardForCredential}
          fetchData={fetchData}
          setIsCredentialOpen={setIsCredentialOpen}
          setIsFileOpen={setIsFileOpen}
          selectedCredentialEdit={securedSotreDetail}
        />
      </div>

      <div className="space-y-5">
        <div className="flex bg-gray-100 ps-5 py-4  items-center justify-start gap-x-2">
          <button onClick={() => setIsFileOpen(!isFileOpen)}>
            <IoIosArrowDown
              className={`${
                isFileOpen ? "rotate-180  text-sky-500 " : ""
              } mt-1 text-2xl`}
            />
          </button>
          <p className="text-2xl font-bold ">
            Files/Data{" "}
            {securedFileStore.length > 0 && (
              <span className="font-normal text-xl">
                ( {filterDataForFileData.length + " files"})
              </span>
            )}
          </p>
        </div>
        <div
          className={`w-full ${
            isFileOpen ? "h-full" : " h-0"
          } overflow-auto  space-y-5 sidebar-scrollbar`}
        >
          <div className="flex items-center justify-between py-2">
            {securedFileStore && securedFileStore?.length > 0 && (
              <div className="flex rounded-xl w-[30%] bg-white items-center justify-center gap-3 ps-2  border-2 border-gray-300">
                <input
                  type="text"
                  value={searchQueryForFile}
                  onChange={(e) => setSearchQueryForFile(e.target.value)}
                  placeholder="Search by ItemName"
                  className="outline-none w-full text-gray-950 ps-2 bg-white focus:outline-1 py-2.5 text-lg"
                />
                <button className="me-2 hover:bg-gray-300 rounded-full p-3">
                  <FaSearch className="text-gray-400" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#fff] h-full z-10 w-full flex items-center justify-center">
            {filterDataForFileData?.length ? (
              <DataGrid
                rows={filterDataForFileData}
                columns={columnsForFileData}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                // checkboxSelection
                rowHeight={67}
                className="mb-10"
                sx={{
                  "& .MuiDataGrid-virtualScroller": {
                    paddingBottom: "70px",
                  },
                }}
              />
            ) : loadingFile ? (
              <Loading />
            ) : (
              <NoDataFound />
            )}
          </div>
        </div>

        {showConfirmationForFile && (
          <Popup
            message={
              <>
                Are you sure you want to delete this{" "}
                <strong>"{selectedFileItem}"</strong>?
              </>
            }
            onConfirm={handleDeleteFileRow}
            onCancel={cancelDeleteForFile}
            loading={isDeletedForFile}
          />
        )}

        {isOpenFilenfo && (
          <FileInfoModal
            isOpenFilenfo={isOpenFilenfo}
            setIsOpenfileInfo={setIsOpenfileInfo}
            selectedFile={secruedSotreFileDetail}
            setIsEditForFile={setIsEditForFile}
            setShowConfirmationFile={setShowConfirmationFile}
            setSelectedFilerowId={setSelectedFilerowId}
            setSelectedFilealItem={setSelectedFilealItem}
          />
        )}

        <EditFile
          isEditForFile={isEditForFile}
          setIsEditForFile={setIsEditForFile}
          projects={projects}
          setIsEditForCredential={setIsEditForCredential}
          setIsChangeDiscardForFileData={setIsChangeDiscardForFileData}
          isChangeDiscardForFileData={isChangeDiscardForFileData}
          fetchFileData={fetchFileData}
          setIsCredentialOpen={setIsCredentialOpen}
          setIsFileOpen={setIsFileOpen}
          selectedFileEdit={secruedSotreFileDetail}
          selectedUrl={selectedUrl || ""}
        />

        {isFileOpenPopup && (
          <AddFileData
            isFileOpenPopup={isFileOpenPopup}
            setIsFileOpenPopup={setIsFileOpenPopup}
            projects={projects}
            setIsCredentialOpenPopup={setIsCredentialOpenPopup}
            setIsChangeDiscardForFileData={setIsChangeDiscardForFileData}
            isChangeDiscardForFileData={isChangeDiscardForFileData}
            fetchFileData={fetchFileData}
            setIsCredentialOpen={setIsCredentialOpen}
            setIsFileOpen={setIsFileOpen}
          />
        )}
      </div>
    </div>
  );
};

export default SecuredStore;
