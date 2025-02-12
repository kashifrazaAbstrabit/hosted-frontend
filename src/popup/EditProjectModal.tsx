import React, { useEffect, useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import xClose from "../assets/x-close.svg";
import AssignPeople, { NameBody } from "../pages/create-project/AssignPeople";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../types/reduxTypes";
import { fetchProjects, updateProject } from "../redux/projectSlice";
import Loading from "../components/common/Loading";
import { ProjectStatus } from "../utils/help";
import { MdDateRange } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditProjectModal = ({
  isEdit,
  setIsEdit,
  selectedEditProject,
}: {
  isEdit: boolean;
  setIsEdit: (isOpen: boolean) => void;
  selectedEditProject: any;
}) => {
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [assignedData, setAssignedData] = useState<NameBody[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());

  const [projectStatus, setProjectStatus] = useState("");
  const [assigned_people, setAssignedPeople] = useState<Number[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { activeUsers } = useSelector((state: RootState) => state.user);
  const AssignedData = activeUsers?.developers;

  //update project
  useEffect(() => {
    if (selectedEditProject) {
      setProjectName(selectedEditProject?.name);
      setProjectDescription(selectedEditProject?.description);
      setDate(selectedEditProject?.start_date.substring(0, 10));
      setProjectStatus(selectedEditProject?.status);
      if (
        selectedEditProject?.assigned_people &&
        selectedEditProject?.assigned_people?.length > 0
      ) {
        setAssignedData(
          selectedEditProject?.assigned_people.map((item: any) => {
            const employee = AssignedData?.find(
              (itm: any) => itm.developer_id === item.developer_id
            );

            if (employee) {
              return {
                first_name: employee?.developer?.first_name || "",
                last_name: employee?.developer?.last_name || "",
                id: employee.developer_id,
                color: employee?.developer?.color || "",
              };
            }
          })
        );
      }
    }
  }, [selectedEditProject]);

  const onClose = () => {
    setIsDropdownOpen(false);
  };

  const handleCloseCreateProject = () => {
    setIsEdit(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);

  const [loading, setLoading] = useState(false);

  const handleEditProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        name: projectName,
        description: projectDescription,
        start_date: date,
        status: projectStatus,
        assigned_people,
      };
      await dispatch(updateProject(selectedEditProject.id, data, setIsEdit));
      await dispatch(fetchProjects());
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAssignedPeople(assignedData.map((person) => person.id));
  }, [assignedData]);

  return (
    <div
      className={`fixed -top-4 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isEdit ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <form
        onSubmit={handleEditProject}
        className="bg-white max-w-xl mx-auto rounded-lg shadow-lg p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-xl font-semibold text-gray-800">Edit Project</h1>
          <img
            src={xClose}
            alt="Close"
            className="cursor-pointer w-5 h-5"
            onClick={handleCloseCreateProject}
          />
        </div>

        {/* Project Name */}
        <div className="space-y-2">
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-gray-600"
          >
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="w-full px-4 py-2 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
            placeholder="Enter Project Name"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="projectDescription"
            className="block text-sm font-medium text-gray-600"
          >
            Project Description
          </label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="w-full px-4 py-2 border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
            placeholder="Enter Project Description"
            rows={4}
          />
        </div>

        {/* Project Start Date */}
        <div className="space-y-2 w-full">
          <label
            htmlFor="startDate"
            className="block text-base font-medium text-gray-600"
          >
            Project Start Date
          </label>
          <div className="w-full max-w-max relative">
            <DatePicker
              selected={date}
              showDateSelect={isDateOpen}
              placeholderText="Enter Start Date"
              onChange={(date: Date | null) => {
                setDate(date);
                setIsDateOpen(false); // Close the picker after selection
              }}
              dateFormat="yyyy-MM-dd"
              className="w-[530px] px-5 py-2 text-base border outline-none rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
              popperClassName="custom-datepicker"
              showPopperArrow={false}
              popperPlacement="bottom-start" // Controls where the popup appears
              open={isDateOpen} // Control visibility with state
              onClickOutside={() => setIsDateOpen(false)} // Close when clicking outside
            />
            <MdDateRange
              onClick={() => setIsDateOpen(true)}
              className="absolute cursor-pointer top-3 text-xl right-3 text-gray-400"
            />
          </div>
        </div>

        {/* Project Status */}
        <div className="space-y-2">
          <label
            htmlFor="projectStatus"
            className="block text-sm font-medium text-gray-600"
          >
            Select Project Status
          </label>
          <select
            id="projectStatus"
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
            className="w-full px-4 py-2 border outline-none  rounded-lg focus:ring focus:ring-[var(--button-bg-color)]"
          >
            <option value="" disabled>
              Select a status
            </option>
            {ProjectStatus.map((itm, index) => (
              <option key={index} value={itm.value}>
                {itm.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assign People */}
        <div className="relative">
          <div
            onClick={handleDropdownToggle}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <BsPersonFillAdd className="text-lg text-gray-600" />
            {assignedData.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {assignedData.map((person: any) => (
                  <li
                    key={person.id}
                    style={{
                      backgroundColor: person?.color,
                    }}
                    className="w-8 h-8  text-white flex items-center justify-center rounded-full"
                  >
                    {getInitials(person?.first_name + " " + person?.last_name)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 font-semibold">Assign</p>
            )}
          </div>
          {isDropdownOpen && (
            <AssignPeople
              isDropdownOpen={isDropdownOpen}
              assignedData={assignedData}
              setSetAssignedData={setAssignedData}
              onClose={onClose}
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={handleCloseCreateProject}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 flex gap-x-2  py-2 bg-[var(--button-bg-color)] text-black font-medium hover:bg-[var(--button-bg-color)] rounded-lg"
          >
            Save Changes {loading && <Loading />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectModal;
