import { useState, useEffect } from "react";
import { MoreVert } from "@mui/icons-material";
import { MdEdit } from "react-icons/md";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

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

import Loading from "../../components/common/Loading";
import {
  deleteProject,
  fetchProjects,
  singleProjectForClient,
} from "../../redux/projectSlice";
import { getActiveUsers } from "../../redux/userSlice";
import ProjectInfoModal from "../../popup/ProjectInfoModal";
import { getStatusName, ProjectStatus } from "../../utils/help";
import Popup from "../../popup/Popup";
import EditProjectModal from "../../popup/EditProjectModal";
import MetaData from "../../components/common/MetaData";

interface Row {
  id: number;
  projectName: string;
  assignee: any;
  start_date: any;
  status: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const ManageProject = ({ open }: { open: boolean }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { activeUsers } = useSelector((state: RootState) => state.user);
  const AssignedData = activeUsers?.developers;
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<number | undefined>(
    undefined
  );
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");

  const [projectStatus, setProjectStatus] = useState<string>("");

  const { project, loading } = useSelector(
    (state: RootState) => state.projects
  );

  const fetchData = async () => {
    await dispatch(fetchProjects());
    await dispatch(getActiveUsers());
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  //delete project
  const handleDelete = (obj: any) => {
    setShowConfirmation(true);
    setSelectedRowId(obj.row?.id);
    setSelectedProjectName(obj?.row?.projectName);
  };

  const handleDeleteRow = async () => {
    if (selectedRowId !== undefined) {
      await dispatch(deleteProject(selectedRowId));
      fetchData();
      setShowConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  //searching filtering technique -------------------------------------------------------------------------------------------------->

  const [rows, setRows] = useState<Row[]>([]);

  const getColor = (val: string) => {
    switch (val) {
      case "under_discuss":
        return { color: "#0369A1", backgroundColor: "#E0F2FE" };
      case "suspended":
        return { color: "#B91C1C", backgroundColor: "#FEE2E2" };
      case "in_development":
        return { color: "#1E40AF", backgroundColor: "#DBEAFE" };

      case "maintenance":
        return { color: "#D97706", backgroundColor: "#FFF7ED" };
      case "completed":
        return { color: "#28A745", backgroundColor: "#bcf4e7" };
      default:
        return { color: "#0369A1", backgroundColor: "#E0F2FE" };
    }
  };

  const [isOpenProjectInfo, setIsOpenProjectInfo] = useState<boolean>(false);

  const handleRowClick = async (id: number) => {
    setIsOpenProjectInfo(true);
    await dispatch(singleProjectForClient(id));
  };

  //edit and delete project

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const handleEditProject = async (id: number) => {
    await dispatch(singleProjectForClient(id));
  };

  let columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "projectName",
      headerName: "Project Name",
      headerClassName: "header-color",
      cellClassName: "header-color1",
      width: 350,
      renderCell: (params) => (
        <div className="">
          <button
            onClick={() => handleRowClick(params?.row?.id)}
            className=" hover:underline ms-2 text-black text-base leading-6 font-medium"
          >
            {params.value}
          </button>
        </div>
      ),
    },
    {
      field: "assignee",
      headerName: "Assignee",
      headerClassName: "header-color",
      cellClassName: "header-color1",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="flex ms-3 mt-2">
            {Array.isArray(params.value)
              ? params.value.map((ids: any) => {
                  const employee = AssignedData?.find(
                    (item: any) => item.developer_id === ids.developer_id
                  );

                  if (employee) {
                    const nameParts =
                      employee?.developer?.first_name +
                        " " +
                        employee?.developer?.last_name?.split(" ") || [];
                    const firstLetterFirstWord =
                      nameParts[0]?.charAt(0)?.toUpperCase() || "";
                    const firstLetterSecondWord =
                      nameParts[1]?.charAt(0)?.toUpperCase() || "";
                    const backgroundColor =
                      employee?.developer?.color || "#000"; // Default to black

                    return (
                      <button
                        key={ids?.developer_id}
                        style={{ backgroundColor }}
                        className="w-10 mt-2 -ms-2.5 flex justify-center items-center text-sm h-10 rounded-full text-white font-medium"
                      >
                        {firstLetterFirstWord + firstLetterSecondWord}
                      </button>
                    );
                  }
                  return null;
                })
              : null}
          </div>
        );
      },
    },

    {
      field: "start_date",
      headerName: "Start Date",
      headerClassName: "header-color",
      cellClassName: "header-color1",
      width: 200,
      renderCell: (params) => (
        <div className="mt-5 ms-2">
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
      width: 350,
      renderCell: (params) => (
        <div className="mt-3 ms-2">
          <h1
            style={{
              color: getColor(params.value).color,
              backgroundColor: getColor(params.value).backgroundColor,
            }}
            className="py-2 w-48 px-7 rounded-lg text-base justify-center flex items-center leading-6 font-semibold"
          >
            {getStatusName(params.value)}
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
                            setIsEdit(!isEdit);
                            handleEditProject(params?.row?.id);
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
                          onClick={() => handleDelete(params)}
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

  const validProjects = Array.isArray(projects)
    ? projects.filter(
        (project) =>
          project &&
          typeof project === "object" &&
          "id" in project &&
          "name" in project
      )
    : [];

  useEffect(() => {
    if (validProjects && validProjects?.length > 0) {
      const newRows = validProjects?.map((item: any) => ({
        id: item.id,
        projectName: item.name,
        assignee: item.assigned_people,
        start_date: item.start_date.substring(item.start_date, 10),
        status: item.status,
        description: item.description,
      }));
      setRows(newRows);
    }
  }, [projects]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredOnSearchAndFilerRows = rows?.filter((row: any) => {
    const matchesSearchQuery = row.projectName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchFilterByStatus = row.status
      ?.toLowerCase()
      .includes(projectStatus.toLowerCase());

    return matchesSearchQuery && matchFilterByStatus;
  });

  const filterData = [...filteredOnSearchAndFilerRows].reverse();

  return (
    <div
      className={`${
        !open
          ? "w-[calc(100%-80px)] left-20 ml-20"
          : "w-[calc(100%-288px)] ml-72 left-72"
      } px-10 h-auto space-y-4 pb-20 sidebar-scrollbar`}
    >
      <MetaData title="Manage Projects" />
      <div className="w-full h-full space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between py-2">
          {projects && projects?.length > 0 && (
            <div className="flex rounded-xl w-[30%] bg-white items-center justify-center gap-3 ps-2  border-2 border-gray-300">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project name"
                className="outline-none w-full text-gray-950 ps-2 bg-white focus:outline-1 py-2.5 text-lg"
              />
              <button className="me-2 hover:bg-gray-300 rounded-full p-3">
                <FaSearch className="text-gray-400" />
              </button>
            </div>
          )}

          <div className="w-72 me-4">
            <select
              id="projectStatus"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              required
              className="w-full px-4 py-3 border outline-none  rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
            >
              <option value="" disabled>
                Filter by status
              </option>
              {ProjectStatus.map((itm, index) => (
                <option key={index} value={itm.value}>
                  {itm.label}
                </option>
              ))}
              <option value="">Reset</option>
            </select>
          </div>
        </div>

        <div className="bg-[#fff] h-full z-10 w-full flex items-center justify-center">
          {filterData?.length ? (
            <DataGrid
              rows={filterData}
              columns={columns}
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
          ) : loading ? (
            <Loading />
          ) : (
            <NoDataFound />
          )}
        </div>
      </div>

      {showConfirmation && (
        <Popup
          message={
            <>
              Are you sure you want to delete this{" "}
              <strong>"{selectedProjectName}"</strong>?
            </>
          }
          onConfirm={handleDeleteRow}
          onCancel={cancelDelete}
        />
      )}

      {isEdit && (
        <EditProjectModal
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          selectedEditProject={project}
        />
      )}

      {isOpenProjectInfo && (
        <ProjectInfoModal
          isOpenProjectInfo={isOpenProjectInfo}
          setIsOpenProjectInfo={setIsOpenProjectInfo}
          selectedProject={project}
          AssignedData={AssignedData}
          setIsEdit={setIsEdit}
          setShowConfirmation={setShowConfirmation}
          setSelectedRowId={setSelectedRowId}
          setSelectedProjectName={setSelectedProjectName}
        />
      )}
    </div>
  );
};

export default ManageProject;
