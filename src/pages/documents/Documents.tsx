import { useEffect, useState } from "react";
import AddSources from "../../popup/AddSources";
import CreateNewDocument from "../../popup/CreateNewDocument";
import MetaData from "../../components/common/MetaData";
import AddWebsiteUrl from "../../popup/AddWebsiteUrl";
import AddCopiedText from "../../popup/AddCopiedText";
import {
  deleteDocument,
  deleteResource,
  fetchDocument,
  fetchProjectKnowledgeDocument,
} from "../../redux/documentSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../types/reduxTypes";
import Popup from "../../popup/Popup";
import { FaPlus } from "react-icons/fa6";
import AllProjectDocuments from "./AllProjectDocuments";
import AllProjectKnowledge from "./AllProjectKnowledge";

const Documents = ({
  open,
  selectedProjectDetails,
}: {
  open: boolean;
  selectedProjectDetails: any;
}) => {
  const [isOpenAddSource, setIsOpenAddSource] = useState<boolean>(false);
  const [isOpenCreateDocument, setIsOpenCreateDocument] =
    useState<boolean>(false);
  const [isOpenWebsiteUrl, setIsOpenWebsiteUrl] = useState<boolean>(false);
  const [isOpenPastedText, setIsOpenPastedText] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const {
    documents,
    loadingDocument,
    loadingProjectKnowledgeDocument,
    isDeleted,
    projectKnowlegeDocuments,
  } = useSelector((state: RootState) => state.documents);

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showConfirmationForKnowdge, setShowConfirmationForKnowdge] =
    useState<boolean>(false);

  const [selectedRowId, setSelectedRowId] = useState<string | undefined>(
    undefined
  );
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const [selectedFileNameForKnowledge, setSelectedFileNameForKnowledge] =
    useState<string>("");

  const fetchAllDocs = async () => {
    try {
      dispatch(fetchDocument(selectedProjectDetails?.value));
    } catch (error) {}
  };
  useEffect(() => {
    fetchAllDocs();
  }, [dispatch, selectedProjectDetails?.value]);

  //fetch all prjects knowledge
  const fetchAllProjectKnowlegeDocs = async () => {
    try {
      await dispatch(
        fetchProjectKnowledgeDocument(selectedProjectDetails?.value)
      );
    } catch (error) {}
  };
  useEffect(() => {
    fetchAllProjectKnowlegeDocs();
  }, [dispatch, selectedProjectDetails?.value]);

  //delete document
  const handleDelete = (obj: any) => {
    setShowConfirmation(true);
    setSelectedRowId(obj?.id);
    setSelectedFileName(obj?.name);
  };

  const handleDeleteRow = async () => {
    if (selectedRowId !== undefined) {
      await dispatch(deleteDocument(selectedRowId));
      await fetchAllDocs();
      setShowConfirmation(false);
    }
  };

  const handleDeleteKnowledge = (obj: any) => {
    setShowConfirmationForKnowdge(true);
    setSelectedFileNameForKnowledge(obj?.name);
  };

  const handleDeleteKnowledgeRow = async () => {
    if (selectedFileNameForKnowledge) {
      await dispatch(
        deleteResource(
          selectedFileNameForKnowledge,
          selectedProjectDetails?.value
        )
      );
      await fetchAllProjectKnowlegeDocs();
      setShowConfirmationForKnowdge(false);
    }
  };
  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const cancelDeleteForKnowledge = () => {
    setShowConfirmationForKnowdge(false);
  };

  return (
    <div
      className={`${
        !open
          ? "w-[calc(100%-80px)] left-20 ml-20"
          : "w-[calc(100%-288px)] ml-72 left-72"
      } px-10 h-auto space-y-4 pt-5 pb-20 sidebar-scrollbar`}
    >
      <MetaData title="Documents" />
      <div
        style={{
          backgroundImage: `url(https://abswebsiteassets.blob.core.windows.net/websiteimages/signupbg.png)`,
        }}
        className="grid gap-x-5  md:grid-cols-2 grid-cols-1 bg-center bg-cover "
      >
        <div className="shadow-md bg-white p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium">Project Knowledge</h1>
            {/* //icons  */}
          </div>
          <div className="border border-b border-x-0 border-t-0 w-full mt-3"></div>
          <button
            onClick={() => setIsOpenAddSource(true)}
            className="px-5 mt-6 w-full flex items-center justify-center py-2 bg-[var(--button-bg-color)] text-black font-medium hover:bg-[var(--button-bg-color)] rounded-lg"
          >
            <FaPlus className="mr-2" /> Add Source
          </button>

          <div className="mt-6">
            <div className="flex items-center justify-between border border-b-gray-200 border-x-0 border-t-0">
              {/* <h1 className="text-xl font-medium mb-3">Select All Sources</h1> */}
              {/* <input type="checkbox" className="w-5 h-5" /> */}
            </div>
            <div className="mt-3 h-[calc(100vh-380px)] overflow-auto">
              <AllProjectKnowledge
                documents={projectKnowlegeDocuments}
                handleDelete={handleDeleteKnowledge}
                loading={loadingProjectKnowledgeDocument}
              />
            </div>
          </div>
        </div>
        <div className="shadow-md bg-white p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium">Project Document</h1>
            {/* //icons  */}
          </div>
          <div className="border border-b border-x-0 border-t-0 w-full mt-3"></div>
          <button
            onClick={() => setIsOpenCreateDocument(true)}
            className="px-5 mt-6 w-full flex items-center justify-center py-2 bg-[var(--button-bg-color)] text-black font-medium hover:bg-[var(--button-bg-color)] rounded-lg"
          >
            <FaPlus className="mr-2" /> Create Document
          </button>

          <div className="mt-6">
            <div className="flex items-center justify-between ">
              {/* <h1 className="text-xl font-medium mb-3"> 📁 All Documents</h1> */}
              {/* <input type="checkbox" className="w-5 h-5" /> */}
            </div>
            <div className="mt-3 h-[calc(100vh-320px)] overflow-auto sidebar-scrollbar">
              <AllProjectDocuments
                documents={documents}
                handleDelete={handleDelete}
                loading={loadingDocument}
              />
            </div>
          </div>
        </div>
      </div>
      {isOpenAddSource && (
        <AddSources
          isOpenAddSource={isOpenAddSource}
          setIsOpenAddSource={setIsOpenAddSource}
          setIsOpenWebsiteUrl={setIsOpenWebsiteUrl}
          setIsOpenPastedText={setIsOpenPastedText}
          selectedProjectId={selectedProjectDetails?.value}
          fetchAllProjectKnowlegeDocs={fetchAllProjectKnowlegeDocs}
        />
      )}

      {isOpenCreateDocument && (
        <CreateNewDocument
          isOpenCreateDocument={isOpenCreateDocument}
          setIsOpenCreateDocument={setIsOpenCreateDocument}
          fetchAllDocs={fetchAllDocs}
          selectedProjectId={selectedProjectDetails?.value}
        />
      )}

      {isOpenWebsiteUrl && (
        <AddWebsiteUrl
          isOpenWebsiteUrl={isOpenWebsiteUrl}
          setIsOpenWebsiteUrl={setIsOpenWebsiteUrl}
        />
      )}
      {isOpenPastedText && (
        <AddCopiedText
          isOpenPastedText={isOpenPastedText}
          setIsOpenPastedText={setIsOpenPastedText}
        />
      )}

      {showConfirmation && (
        <Popup
          message={
            <>
              Are you sure you want to delete this{" "}
              <strong>"{selectedFileName}"</strong>?
            </>
          }
          onConfirm={handleDeleteRow}
          onCancel={cancelDelete}
          loading={isDeleted}
        />
      )}

      {showConfirmationForKnowdge && (
        <Popup
          message={
            <>
              Are you sure you want to delete this{" "}
              <strong>"{selectedFileNameForKnowledge}"</strong>?
            </>
          }
          onConfirm={handleDeleteKnowledgeRow}
          onCancel={cancelDeleteForKnowledge}
          loading={isDeleted}
        />
      )}
    </div>
  );
};

export default Documents;
