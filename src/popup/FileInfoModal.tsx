

const FileInfoModal = ({
  isOpenFilenfo,
  setIsOpenfileInfo,
  selectedFile,
  setIsEditForFile,
  setShowConfirmationFile,
  setSelectedFilerowId,
  setSelectedFilealItem,
}: {
  isOpenFilenfo: boolean;
  setIsOpenfileInfo: (value: boolean) => void;
  selectedFile: any; // Add type definition for selectedFile
  setIsEditForFile: (value: boolean) => void;

  setShowConfirmationFile: (val: boolean) => void;
  setSelectedFilerowId: (val: number) => void;
  setSelectedFilealItem: (val: string) => void;
}) => {
  const onClose = () => {
    setIsOpenfileInfo(false);
  };


  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpenFilenfo ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <div className="bg-white w-[800px] mx-auto rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">File Information</h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-xl hover:text-gray-700"
          >
            X
          </button>
        </div>

        {selectedFile && (
          <div className="space-y-4">
            <div>
              <label className="block text-base font-bold text-gray-700">
                File URL
              </label>
              {selectedFile?.fileUrl ? (
                <a
                  href={selectedFile?.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-blue-500 hover:underline"
                >
                  {selectedFile?.fileUrl}
                </a>
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  No file URL available
                </p>
              )}
            </div>

            <div>
              <label className="block text-base font-bold text-gray-700">
                Item Name
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {selectedFile?.itemName}
              </p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-700">
                Notes
              </label>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {selectedFile?.notes}
              </p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-700">
                Project ID
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {selectedFile?.projectId}
              </p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-700">
                Created At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(selectedFile?.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-700">
                Updated At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(selectedFile?.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-5 space-x-4">
          <button
            onClick={() => {
              setIsEditForFile(true);
              setIsOpenfileInfo(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setShowConfirmationFile(true);
              setIsOpenfileInfo(false);
              setSelectedFilerowId(selectedFile?.id);
              setSelectedFilealItem(selectedFile?.itemName);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileInfoModal;
