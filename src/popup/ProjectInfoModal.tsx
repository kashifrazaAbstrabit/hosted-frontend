import { getStatusName } from "../utils/help";

const ProjectInfoModal = ({
  isOpenProjectInfo,
  setIsOpenProjectInfo,
  selectedProject,
  AssignedData,
  setIsEdit,
  setShowConfirmation,
  setSelectedRowId,
  setSelectedProjectName,
}: {
  isOpenProjectInfo: boolean;
  setIsOpenProjectInfo: (value: boolean) => void;
  selectedProject: any;
  AssignedData: Array<any>;
  setIsEdit: (val: boolean) => void;
  setShowConfirmation: (val: boolean) => void;
  setSelectedRowId: (val: number) => void;
  setSelectedProjectName: (val: string) => void;
}) => {
  const onClose = () => {
    setIsOpenProjectInfo(false);
  };



  return (
    <div
      className={`fixed -top-4 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpenProjectInfo ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <div className="bg-white  w-[800px] mx-auto rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold mb-2">{selectedProject?.name}</h2>
          <button
            onClick={onClose}
            className=" text-gray-500 text-xl  hover:text-gray-700"
          >
            X
          </button>
        </div>
        <p className="text-base text-gray-600 mb-4">
          {selectedProject?.description}
        </p>
        <p>
          <strong>Status:</strong> {getStatusName(selectedProject?.status)}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {selectedProject?.start_date.substring(0, 10)}
        </p>
        <p className="mt-4">
          <strong>Assigned People:</strong>
        </p>
        <ul className="flex flex-wrap space-x-2 ">
          {selectedProject?.assigned_people.map(
            (person: any, index: number) => {
              const employee = AssignedData?.find(
                (item: any) => item.developer_id === person.developer_id
              );
              let name;
              if (employee) {
                name =
                  employee?.developer?.first_name +
                  " " +
                  employee?.developer?.last_name;
              }
              return (
                <li
                  key={index}
                  className="text-gray-700 border border-gray-500 p-2 rounded-xl"
                >
                  <div>{name}</div>
                </li>
              );
            }
          )}
        </ul>
        <div className="flex justify-end mt-5">
          <button
            onClick={() => {
              setIsEdit(true);
              setIsOpenProjectInfo(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-3"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setShowConfirmation(true);
              setIsOpenProjectInfo(false);
              setSelectedRowId(selectedProject.id);
              setSelectedProjectName(selectedProject.name);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoModal;
