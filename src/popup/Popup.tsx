import { RiDeleteBin6Line } from "react-icons/ri";

const Popup = ({
  message,
  onCancel,
  onConfirm,
  loading = false,
}: {
  message: any;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) => {
  return (
    <div className="fixed -top-4 border-4 border-red-600 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white flex flex-col items-center border-4 w-[450px] border-red-300 p-8 rounded-md shadow-md">
        <div className="bg-red-200 p-4 rounded-full mb-5">
          <RiDeleteBin6Line className="text-5xl text-red-700 font-bold" />
        </div>

        <p className="text-black text-lg font-medium text-center">{message}</p>

        <div className="flex justify-center gap-6 mt-7">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="bg-red-500 disabled:bg-red-300 text-white px-5 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
