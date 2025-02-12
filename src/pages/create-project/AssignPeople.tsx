import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../types/reduxTypes";
import { getActiveUsers } from "../../redux/userSlice";

export interface NameBody {
  id: number;
  name: string;
}

const AssignPeople = ({
  isDropdownOpen,
  assignedData,
  setSetAssignedData,
  onClose,
}: {
  isDropdownOpen: boolean;
  assignedData: NameBody[];
  setSetAssignedData: React.Dispatch<React.SetStateAction<NameBody[]>>;
  onClose: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { activeUsers } = useSelector((state: RootState) => state.user);
  const AssignedData = activeUsers?.developers;
  const [availableData, setAvailableData] = useState<NameBody[]>(AssignedData);

  const [, setFilterData] = useState<NameBody[]>(AssignedData);
  const dispatch = useDispatch<AppDispatch>();

  const getFirstLetterFirstWord = (name: string) => {
    return name?.split(" ")[0]?.charAt(0).toUpperCase();
  };

  const getFirstLetterSecondWord = (name: string) => {
    return name?.split(" ")[1]?.charAt(0).toUpperCase();
  };

  const fetchActiveUser = async () => {
    await dispatch(getActiveUsers());
  };
  useEffect(() => {
    fetchActiveUser();
  }, [dispatch]);

  useEffect(() => {
    setAvailableData(
      AssignedData?.filter(
        (user: any) =>
          !assignedData.some((assigned) => assigned.id === user.developer_id)
      ) || []
    );
    setFilterData(AssignedData || []);
  }, [assignedData, AssignedData]);

  //searching based on name and email
  const handleSearch = (query: string) => {
    const newdata = availableData.map((item: any) => item.developer);

    const lowerCaseQuery = query.toLowerCase();
    const combinedData = [...assignedData, ...newdata];

    const filteredResults = combinedData.filter((item: any) => {
      const name = item?.first_name + " " + item?.last_name;
      const email = item?.email;
      return (
        name.toLowerCase().includes(lowerCaseQuery) ||
        email.toLowerCase().includes(lowerCaseQuery)
      );
    });

    const filteredAssigned = filteredResults.filter((user: any) =>
      assignedData.some((assigned) => assigned.id === user.id)
    );

    const filteredAvailable = filteredResults.filter((user: any) =>
      newdata.some((available: any) => available.id === user.id)
    );

    setFilterData(filteredAvailable);
    setSetAssignedData(filteredAssigned);
  };

  const handleSelectPeople = (item: NameBody) => {
    if (!assignedData.some((assigned) => assigned.id === item.id)) {
      setSetAssignedData((prev) => [...prev, item]);
      setAvailableData((prev) =>
        prev.filter((user: any) => user.developer_id !== item.id)
      );
    }
  };

  const hanldeRemoveAssigned = (id: number) => {
    setSetAssignedData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isDropdownOpen ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <div className="shadow-lg border-t-2 bg-white sidebar-scrollbar1 w-80 h-[60vh] overflow-auto rounded-lg z-50">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Assign People</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition duration-200"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-5">
          {/* Search Input */}
          <div className="sticky left-0 right-0 top-0 bg-white z-10">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="bg-gray-100 py-2 w-full ps-2 outline-none border-b-4 border-purple-500"
              placeholder="Type name or email address"
            />
          </div>

          {/* Assigned People */}
          {assignedData && assignedData.length > 0 && (
            <div className="mt-4">
              <p className="font-medium">Assigned</p>
              <ul className="list-none  mt-3">
                {assignedData?.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex hover:bg-gray-100 items-center justify-between py-2 cursor-pointer px-2.5"
                  >
                    <div className="flex items-center gap-x-2">
                      <div
                        style={{
                          backgroundColor: item?.color,
                        }}
                        className="w-7 h-7 text-white flex  justify-center items-center text-sm rounded-full font-medium"
                      >
                        {(getFirstLetterFirstWord(
                          item?.first_name + " " + item?.last_name
                        )
                          ? getFirstLetterFirstWord(
                              item?.first_name + " " + item?.last_name
                            )
                          : "") +
                          (getFirstLetterSecondWord(
                            item?.first_name + " " + item?.last_name
                          )
                            ? getFirstLetterSecondWord(
                                item?.first_name + " " + item?.last_name
                              )
                            : "")}
                      </div>
                      <span>{item?.first_name + " " + item?.last_name}</span>
                    </div>
                    <div
                      onClick={() => hanldeRemoveAssigned(item.id)}
                      className="text-sm cursor-pointer"
                    >
                      X
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          <div className="mt-4">
            {availableData && availableData?.length > 0 && (
              <p className="font-medium">Suggestions</p>
            )}
            <ul className="list-none  mt-3">
              {availableData?.map((item: any) => (
                <li
                  onClick={() => handleSelectPeople(item?.developer)}
                  key={item.developer_id}
                  className="flex hover:bg-gray-100 py-2 cursor-pointer items-center gap-x-2 px-2.5"
                >
                  <div
                    style={{
                      backgroundColor: item?.developer?.color,
                    }}
                    className="w-7 h-7 text-white flex  p-2 justify-center items-center text-sm rounded-full font-medium"
                  >
                    {(getFirstLetterFirstWord(
                      item?.developer?.first_name +
                        " " +
                        item?.developer?.last_name
                    )
                      ? getFirstLetterFirstWord(
                          item?.developer?.first_name +
                            " " +
                            item?.developer?.last_name
                        )
                      : "") +
                      (getFirstLetterSecondWord(
                        item?.developer?.first_name +
                          " " +
                          item?.developer?.last_name
                      )
                        ? getFirstLetterSecondWord(
                            item?.developer?.first_name +
                              " " +
                              item?.developer?.last_name
                          )
                        : "")}
                  </div>
                  <span>
                    {item?.developer?.first_name +
                      " " +
                      item?.developer?.last_name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignPeople;
