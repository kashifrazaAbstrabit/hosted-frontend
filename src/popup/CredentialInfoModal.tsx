

const CredentialInfoModal = ({
  isOpenCredentialInfo,
  setIsOpenCredentialInfo,
  selectedProject,
  setIsEditForCredential,
  setShowConfirmationForCredential,
  setSelectedCredentialrowId,
  setSelectedCredentialItem,
}: {
  isOpenCredentialInfo: boolean;
  setIsOpenCredentialInfo: (value: boolean) => void;
  selectedProject: any;
  setIsEditForCredential: (val: boolean) => void;

  setShowConfirmationForCredential: (val: boolean) => void;
  setSelectedCredentialrowId: (val: number) => void;
  setSelectedCredentialItem: (val: string) => void;
}) => {
  const onClose = () => {
    setIsOpenCredentialInfo(false);
   
  };


  return (
    <div
      className={`fixed inset-0 flex -top-5 items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpenCredentialInfo ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <div className="bg-white w-[800px] mx-auto rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Credential Information</h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-xl hover:text-gray-700"
          >
            X
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-base  text-gray-700 font-bold">
              URL
            </label>
            <a
              href={selectedProject?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm text-blue-500 hover:underline"
            >
              {selectedProject?.url}
            </a>
          </div>

          <div>
            <label className="block text-base  text-gray-700 font-bold">
              Username
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {selectedProject?.username}
            </p>
          </div>

          <div>
            <label className="block text-base  text-gray-700 font-bold">
              Item Name
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {selectedProject?.itemName}
            </p>
          </div>

          <div>
            <label className="block text-base  text-gray-700 font-bold">
              Password
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {selectedProject?.password}
            </p>
          </div>

          <div>
            <label className="block text-base  text-gray-700 font-bold">
              Notes
            </label>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
              {selectedProject?.notes}
            </p>
          </div>

          <div>
            <label className="block text-base  text-gray-700 font-bold">
              Project ID
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {selectedProject?.projectId}
            </p>
          </div>

          <div>
            <label className="block text-base  text-gray-700 font-bold">
              Created At
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(selectedProject?.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <label className="block text-base  text-gray-700 font-bold">
              Updated At
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(selectedProject?.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-5 space-x-4">
          <button
            onClick={() => {
              setIsEditForCredential(true);
              setIsOpenCredentialInfo(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setShowConfirmationForCredential(true);
              setIsOpenCredentialInfo(false);
              setSelectedCredentialrowId(selectedProject?.id);
              setSelectedCredentialItem(selectedProject?.itemName);
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

export default CredentialInfoModal;
