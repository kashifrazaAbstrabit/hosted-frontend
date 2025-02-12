const DiscardUnSaveChange = ({
  message,
  onCancel,
  onConfirm,
}: {
  message: any;
  onCancel: () => void;
  onConfirm: () => void;
}) => {

  return (
    <div className="fixed -top-5 border-4 border-red-600 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
      <div className="bg-white space-y-5 flex flex-col  border-4 w-[650px] border-red-300 p-8 rounded-md shadow-md">
        <h1 className="text-xl font-semibold text-left">
          Discard unsaved changes?
        </h1>

        <p className="text-black text-lg font-medium text-left">{message}</p>

        <div className="flex justify-end gap-x-6">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
          >
            Keep editing
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscardUnSaveChange;
