import { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { MoreVert } from "@mui/icons-material";
import { RxCross2 } from "react-icons/rx";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FaShare } from "react-icons/fa";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import NoDataFound from "../../components/common/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../types/reduxTypes";
import {
  deleteDevMember,
  fetchAllDevMembers,
  resendInvitation,
} from "../../redux/inviteUserSlice";
import Loading from "../../components/common/Loading";
import InviteDevMemberModal from "../../popup/InviteDevMemberModal";
import Popup from "../../popup/Popup";
import { deleteActiveUser, getActiveUsers } from "../../redux/userSlice";
import { toast } from "react-toastify";
import MetaData from "../../components/common/MetaData";

interface Row {
  id: number;
  email: string;
  status: string;
  created_at: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const DevTeam = ({
  open,
  isOpenCreateDevTeam,
  setIsOpenCreateDevTeam,
}: {
  open: boolean;
  isOpenCreateDevTeam: boolean;
  setIsOpenCreateDevTeam: (isOpen: boolean) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { inviteUsers } = useSelector((state: RootState) => state.inviteUser);
  const { activeUsers } = useSelector((state: RootState) => state.user);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showConfirmationForActive, setShowConfirmationActive] =
    useState<boolean>(false);

  //for active users
  const [selectedActiveRow, setSelectedActivRow] = useState<number | undefined>(
    undefined
  );
  const [selectedActiveEmail, setSelectedActiveEmail] = useState<string>("");

  // for invited users
  const [selectedInvitedRow, setSelectedInvitedRow] = useState<
    number | undefined
  >(undefined);
  const [selectedInvitedEmail, setSelectedInvitedEmail] = useState<string>("");

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const cancelDeleteActive = () => {
    setShowConfirmationActive(false);
  };

  //for active
  const handleDeleteActive = (obj: any) => {
    setShowConfirmationActive(true);
    setSelectedActivRow(obj.row?.id);
    setSelectedActiveEmail(obj.row?.email);
  };

  const handleDeleteActiveRow = async () => {
    if (selectedActiveRow !== undefined) {
      await dispatch(deleteActiveUser(selectedActiveRow));
      fetchData();
      setShowConfirmationActive(false);
    }
  };

  //for invited
  const handleDeleteInvited = (obj: any) => {
    setShowConfirmation(true);
    setSelectedInvitedRow(obj.row?.id);
    setSelectedInvitedEmail(obj.row?.email);
  };

  const [isloadingInvitaion, setIsLoadingInvitaion] = useState<boolean>(false);

  const handleResendInvitaion = async (obj: any) => {
    if (obj?.row?.email?.length === 0) {
      toast.error("Please select valid user email.");
      return;
    }
    const email = obj?.row?.email;

    try {
      setIsLoadingInvitaion(true);
      await dispatch(resendInvitation(email));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to send invites.";

      toast.error(errorMessage);
    } finally {
      setIsLoadingInvitaion(false);
    }
  };

  const handleDeleteInvitedRow = async () => {
    if (selectedInvitedRow !== undefined) {
      await dispatch(deleteDevMember(selectedInvitedRow));
      fetchData();
      setShowConfirmation(false);
    }
  };

  const fetchData = async () => {
    dispatch(fetchAllDevMembers());
    dispatch(getActiveUsers());
  };

  useEffect(() => {
    fetchData();
  }, []);

  //searching filtering technique -------------------------------------------------------------------------------------------------->
  const [loading] = useState(false);

  const [rowsActive, setRowsActive] = useState<Row[]>([]);
  const [rowsInvite, setRowsInvite] = useState<Row[]>([]);

  let columnsActive: GridColDef<(typeof rowsActive)[number]>[] = [
    {
      field: "name",
      headerClassName: "header-color",
      cellClassName: "header-color1",

      headerName: "Name",
      width: 300,
      renderCell: (params) => (
        <div className="mt-5">
          <h1 className="text-black text-base leading-6 font-medium">
            {params.value}
          </h1>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "header-color",
      cellClassName: "header-color1",

      width: 330,
      renderCell: (params) => (
        <div className="mt-5">
          <h1 className="text-black text-base leading-6 font-medium">
            {params.value}
          </h1>
        </div>
      ),
    },
    {
      field: "dateAdded",
      headerName: "Date Added",
      headerClassName: "header-color",
      cellClassName: "header-color1",

      width: 250,
      renderCell: (params) => (
        <div className="mt-5">
          <h1 className="text-black text-base leading-6 font-medium">
            {params.value}
          </h1>
        </div>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      headerClassName: "header-color",
      cellClassName: "header-color1",

      width: 180,
      renderCell: () => (
        <div className="mt-5">
          <h1 className="text-green-600 text-base flex items-center leading-6 font-semibold">
            <FaCheckCircle className="mr-2" /> Active
          </h1>
        </div>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "header-color",
      cellClassName: "header-color1",
      width: 100,
      flex: 0.4,
      align: "left",

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
                <div
                  // onClick={toggleButton}
                  className="w-5 h-5 flex border-2 border-gray-300  mt-1 z-0 items-center rotate-90 rounded-full p-5 justify-center"
                >
                  <MoreVert className="text-[#52637D] z-0" />
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
                className="absolute top-3 right-11 w-36 h-[41px] z-100 rounded-xl  origin-bottom-right  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="font-medium  ">
                  {/* <MenuItem
                  //   onClick={(e) => handleRemind(e, params.id)}
                  >
                    {({ focus }) => (
                      <Link
                        to="#"
                        className={classNames(
                          focus
                            ? "bg-gray-100 text-blue-600 font-semibold flex items-center gap-1"
                            : "text-blue-600 font-semibold flex items-center gap-1",
                          "block px-4 py-2 text-base"
                        )}
                      >
                        <MdEdit className="mr-2" />
                        Edit
                      </Link>
                    )}
                  </MenuItem> */}
                  <MenuItem>
                    {({ focus }) => (
                      <div>
                        <Link
                          to="#"
                          onClick={() => handleDeleteActive(params)}
                          className={classNames(
                            focus
                              ? "bg-[var(--button-bg-color)] rounded-lg  text-red-600 font-semibold flex items-center gap-x-1"
                              : "text-red-600 rounded-lg  font-semibold flex items-center gap-1",
                            "block px-4 py-2 text-base"
                          )}
                        >
                          <MdDelete className="mr-2" /> Delete
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

  let columnsInvited: GridColDef<(typeof rowsInvite)[number]>[] = [
    {
      field: "email",
      headerName: "Email",
      cellClassName: "header-color1",
      headerClassName: "header-color",
      width: 350,
      renderCell: (params) => (
        <div className="mt-5">
          <h1 className="text-black text-base leading-6 font-medium">
            {params.value}
          </h1>
        </div>
      ),
    },
    {
      field: "created_at",
      headerName: "Date of Invitation",
      cellClassName: "header-color1",
      headerClassName: "header-color",

      width: 250,
      renderCell: (params) => (
        <div className="mt-5">
          <h1 className="text-black text-base leading-6 font-medium">
            {params.value}
          </h1>
        </div>
      ),
    },

    {
      field: "status",
      cellClassName: "header-color1",
      headerName: "Status",
      headerClassName: "header-color",
      width: 180,
      renderCell: () => (
        <div className="mt-5">
          <h1 className="text-[#17A2B8] text-base flex items-center leading-6 font-semibold">
            <MdEmail className="mr-2 text-lg" /> Invited
          </h1>
        </div>
      ),
    },

    {
      field: "actions",
      cellClassName: "header-color1",
      headerName: "Actions",
      headerClassName: "header-color",
      width: 100,
      flex: 0.4,
      renderCell: (params) => {
        return (
          <Menu as="div" className="fixed inline-block text-left mt-1.5 z-10">
            <div className="z-10">
              <MenuButton
                style={{
                  zIndex: "-1",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className=" justify-center gap-x-1.5   z-0 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                <div
                  // onClick={toggleButton}
                  className="w-5 h-5 flex border-2 border-gray-300  mt-1 z-0 items-center rotate-90 rounded-full p-5 justify-center"
                >
                  <MoreVert className="text-[#52637D] z-0" />
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
                className={`absolute top-3 right-11 ${
                  isloadingInvitaion ? "w-60" : "w-56"
                } h-[81px] z-100 rounded-xl  origin-bottom-right  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
              >
                <div className="font-medium">
                  <MenuItem>
                    {({ focus }) => (
                      <div>
                        <Link
                          to="#"
                          onClick={() => handleResendInvitaion(params)}
                          className={classNames(
                            focus
                              ? "bg-[var(--button-bg-color)]  rounded-t-lg text-black font-semibold flex items-center gap-1"
                              : "text-black   rounded-t-lg font-semibold flex items-center gap-1",
                            "block px-4 py-2 border-b text-base"
                          )}
                        >
                          <FaShare className="mr-2 flex-shrink-0" /> Resend
                          Invitation {isloadingInvitaion && <Loading />}
                        </Link>
                      </div>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <div>
                        <Link
                          to="#"
                          onClick={() => handleDeleteInvited(params)}
                          className={classNames(
                            focus
                              ? "bg-[var(--button-bg-color)] rounded-b-lg text-black font-semibold flex items-center gap-1"
                              : "text-black rounded-b-lg  font-semibold flex items-center gap-1",
                            "block px-4 py-2 border-b text-base"
                          )}
                        >
                          <RxCross2 className="mr-2 text-red-600 text-xl" />{" "}
                          Cancel Invite
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
    if (inviteUsers) {
      const newRows = inviteUsers?.map((item: any) => ({
        id: item.id,
        email: item.email,
        status: item.id,
        created_at: item.created_at.substring(item.created_at, 10),
      }));
      setRowsInvite(newRows);
    }

    if (activeUsers && activeUsers?.developers) {
      const newRows = activeUsers?.developers?.map((item: any) => ({
        id: item?.developer_id,
        name: item?.developer?.first_name + " " + item?.developer?.last_name,
        email: item?.developer?.email,
        dateAdded: item?.developer?.created_at.substring(
          item?.developer?.created_at,
          10
        ),
        status: item.id,
      }));
      setRowsActive(newRows);
    }
  }, [inviteUsers, activeUsers]);

  const [searchQueryActive, setSearchQueryActive] = useState("");
  const [searchQueryInvited, setSearchQueryInvited] = useState("");

  const filteredOnSearchAndFilerRowsActive = rowsActive?.filter((row: any) => {
    const matchesSearchQuery = row.email
      ?.toLowerCase()
      .includes(searchQueryActive.toLowerCase());
    const matchQueryForname = row.name
      ?.toLowerCase()
      .includes(searchQueryActive.toLowerCase());

    return matchesSearchQuery || matchQueryForname;
  });

  const filteredOnSearchAndFilerRowsInvited = rowsInvite?.filter((row: any) => {
    const matchesSearchQuery = row.email
      ?.toLowerCase()
      .includes(searchQueryInvited.toLowerCase());

    return matchesSearchQuery;
  });

  const reversefilteredOnSearchAndFilerRowsInvited = [
    ...filteredOnSearchAndFilerRowsInvited,
  ].reverse();

  const reversefilteredOnSearchAndFilerRowsActive = [
    ...filteredOnSearchAndFilerRowsActive,
  ].reverse();

  const [isOpenActiveDropDown, setIsOpenActiveDropDown] =
    useState<boolean>(true);
  const [isOpenInvitedDropDown, setIsOpenInvitedDropDown] =
    useState<boolean>(false);

  return (
    <div
      className={`${
        !open
          ? "w-[calc(100%-80px)] left-20 ml-20"
          : "w-[calc(100%-288px)] ml-72 left-72"
      } px-10 h-auto space-y-4 pt-5 pb-20 sidebar-scrollbar`}
    >
      <MetaData title="Dev Team" />

      <div className="space-y-5">
        <div className="flex items-center justify-start gap-x-2">
          <button
            onClick={() => setIsOpenActiveDropDown(!isOpenActiveDropDown)}
          >
            <IoIosArrowDown
              className={`${
                isOpenActiveDropDown ? "rotate-180  text-sky-500 " : ""
              } mt-1 text-2xl`}
            />
          </button>
          <p className="text-2xl font-bold ">
            Active Users{" "}
            {rowsActive.length > 0 && (
              <span className="font-normal text-xl">
                ( {filteredOnSearchAndFilerRowsActive.length + " users"})
              </span>
            )}
          </p>
        </div>
        <div
          className={`w-full ${
            isOpenActiveDropDown ? "h-full" : " h-0"
          } overflow-auto  space-y-5 sidebar-scrollbar`}
        >
          {rowsActive.length > 0 && (
            <div className="flex rounded-xl w-[30%] bg-white items-center justify-center gap-3 ps-2  border-2 border-gray-300">
              <input
                type="text"
                value={searchQueryActive}
                onChange={(e) => setSearchQueryActive(e.target.value)}
                placeholder="Search by name, email address"
                className="outline-none w-full text-gray-950 ps-2 bg-white focus:outline-1 py-2.5 text-lg"
              />
              <button className="me-2 hover:bg-gray-300 rounded-full p-3">
                <FaSearch className="text-gray-400" />
              </button>
            </div>
          )}

          <div className="bg-[#fff] h-auto z-10 w-full flex items-center justify-center  mb-5">
            {reversefilteredOnSearchAndFilerRowsActive?.length ? (
              <DataGrid
                rows={reversefilteredOnSearchAndFilerRowsActive}
                columns={columnsActive}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                // checkboxSelection
                rowHeight={67}
                sx={{
                  "& .MuiDataGrid-root": {
                    border: "1px solid #000000", // Add border to the whole DataGrid
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5", // Set header background color
                    color: "#333", // Set header text color
                    borderBottom: "1px solid #ddd", // Add border below the header
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #ddd", // Add border below each cell
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    paddingBottom: "70px",
                  },
                }}
                className="mb-10"
              />
            ) : loading ? (
              <Loading />
            ) : (
              <NoDataFound />
            )}
          </div>

          {showConfirmationForActive && (
            <Popup
              message={`Are you sure you want to delete this ${selectedActiveEmail}?`}
              onConfirm={handleDeleteActiveRow}
              onCancel={cancelDeleteActive}
            />
          )}

          {isOpenCreateDevTeam && (
            <InviteDevMemberModal
              isOpenCreateDevTeam={isOpenCreateDevTeam}
              setIsOpenCreateDevTeam={setIsOpenCreateDevTeam}
              fetchData={fetchData}
              setIsOpenActiveDropDown={setIsOpenActiveDropDown}
              setIsOpenInvitedDropDown={setIsOpenInvitedDropDown}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border border-gray-300 w-full"></div>
      <div className="space-y-5 pt-3">
        <div className="flex items-center justify-start gap-x-2 ">
          <button
            onClick={() => setIsOpenInvitedDropDown(!isOpenInvitedDropDown)}
          >
            <IoIosArrowDown
              className={`${
                isOpenInvitedDropDown ? "rotate-180  text-sky-500" : ""
              } mt-1 text-2xl`}
            />
          </button>
          <p className="text-2xl font-bold ">
            Invited Users{" "}
            {rowsInvite.length > 0 && (
              <span className="font-normal text-xl">
                ( {filteredOnSearchAndFilerRowsInvited.length + " users"})
              </span>
            )}
          </p>
        </div>
        <div
          className={`w-full ${
            isOpenInvitedDropDown ? "h-full" : "h-0"
          } overflow-auto space-y-5  sidebar-scrollbar`}
        >
          {rowsInvite.length > 0 && (
            <div className="flex rounded-xl w-[30%] bg-white items-center justify-center gap-3 ps-2  border-2 border-gray-300">
              <input
                type="text"
                value={searchQueryInvited}
                onChange={(e) => setSearchQueryInvited(e.target.value)}
                placeholder="Search by email address"
                className="outline-none w-full  ps-2 bg-white focus:outline-1 py-2.5 text-lg"
              />
              <button className="me-2 hover:bg-gray-300 rounded-full p-3">
                <FaSearch className="text-gray-400" />
              </button>
            </div>
          )}

          <div className="bg-[#fff] h-auto z-10 w-full flex items-center justify-center  mb-5">
            {reversefilteredOnSearchAndFilerRowsInvited?.length ? (
              <DataGrid
                rows={reversefilteredOnSearchAndFilerRowsInvited}
                columns={columnsInvited}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                // checkboxSelection
                rowHeight={67}
                sx={{
                  "& .MuiDataGrid-virtualScroller": {
                    paddingBottom: "70px",
                  },
                }}
              />
            ) : loading ? (
              <Loading />
            ) : (
              <NoDataFound />
            )}
          </div>
          {showConfirmation && (
            <Popup
              message={`Are you sure you want to delete this ${selectedInvitedEmail}?`}
              onConfirm={handleDeleteInvitedRow}
              onCancel={cancelDelete}
            />
          )}

          {isOpenCreateDevTeam && (
            <InviteDevMemberModal
              isOpenCreateDevTeam={isOpenCreateDevTeam}
              setIsOpenCreateDevTeam={setIsOpenCreateDevTeam}
              fetchData={fetchData}
              setIsOpenActiveDropDown={setIsOpenActiveDropDown}
              setIsOpenInvitedDropDown={setIsOpenInvitedDropDown}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DevTeam;
