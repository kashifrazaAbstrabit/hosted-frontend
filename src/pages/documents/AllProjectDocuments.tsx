import React, { Fragment, useState } from "react";
import { Trash2 } from "lucide-react";
import { SiGoogledocs } from "react-icons/si";
import Loading from "../../components/common/Loading";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { MdExpandLess } from "react-icons/md";
interface Document {
  id: number;
  webViewLink: string;
  name: string;
  isShared: boolean; // Add this field
}

interface AllDocumentsProps {
  documents: any;
  handleDelete: (obj: Document) => void;
  loading: any;
}

// Individual Row Renderer for react-window
const Row = ({ index, style, data }: ListChildComponentProps) => {
  const doc = data?.documents[index] as Document;
  const { handleDelete } = data as { handleDelete: (obj: Document) => void };

  return (
    <li
      key={doc?.id}
      style={style}
      className="flex justify-between mb-5 hover:bg-gray-100 rounded-lg items-center ps-4 bg-white p-1"
    >
      <a
        href={doc?.webViewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-600 flex text-base items-center text-black hover:underline cursor-pointer truncate max-w-[75%] font-medium"
      >
        <SiGoogledocs className="mr-2 text-lg text-blue-600" />{" "}
        {doc?.name + ".docs"}
      </a>

      <button
        onClick={() => handleDelete(doc)}
        className="text-red-500 hover:bg-gray-200 rounded-full p-2 transition flex items-center"
      >
        <Trash2 size={18} className="mr-1" />
      </button>
    </li>
  );
};

const AllProjectKnowledge: React.FC<AllDocumentsProps> = ({
  documents,
  handleDelete,
  loading,
}) => {
  const [isSharedExpanded, setIsSharedExpanded] = useState(true);
  const [isPrivateExpanded, setIsPrivateExpanded] = useState(true);

  // Filter documents based on isShared flag
  const sharedDocuments =
    document && documents?.filter((doc: any) => doc.shared);
  const privateDocuments =
    document && documents?.filter((doc: any) => !doc.shared);

  const getListHeight = (
    itemCount: number,
    itemSize: number,
    minHeight = 50
  ) => {
    return Math.max(itemCount * itemSize, minHeight);
  };

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-auto">
          {/* Shared Documents Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-medium"> Shared</h1>
              <button
                onClick={() => setIsSharedExpanded(!isSharedExpanded)}
                className="text-blue-600 hover:underline"
              >
                {isSharedExpanded ? (
                  <MdExpandLess className="text-3xl text-blue-600" />
                ) : (
                  <MdExpandLess className="rotate-180 text-3xl  text-black" />
                )}
              </button>
            </div>
            {isSharedExpanded && (
              <>
                {sharedDocuments?.length === 0 ? (
                  <p className="text-gray-500">
                    No shared documents available for selected project.
                  </p>
                ) : (
                  <List
                    height={getListHeight(sharedDocuments?.length, 50)}
                    itemCount={sharedDocuments?.length}
                    itemSize={50}
                    width={"100%"}
                    className="sidebar-scrollbar1"
                    itemData={{ documents: sharedDocuments, handleDelete }}
                  >
                    {Row}
                  </List>
                )}
              </>
            )}
          </div>

          <div className="border border-b-gray-200 border-x-0 border-t-0"></div>

          {/* Private Documents Section */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-medium"> Private</h1>
              <button
                onClick={() => setIsPrivateExpanded(!isPrivateExpanded)}
                className="text-blue-600 hover:underline"
              >
                {isPrivateExpanded ? (
                  <MdExpandLess className="text-3xl text-blue-600" />
                ) : (
                  <MdExpandLess className="rotate-180 text-3xl  text-black" />
                )}
              </button>
            </div>
            {isPrivateExpanded && (
              <>
                {privateDocuments?.length === 0 ? (
                  <p className="text-gray-500">
                    No private documents available for selected project.
                  </p>
                ) : (
                  <List
                    height={getListHeight(privateDocuments?.length, 50)}
                    itemCount={privateDocuments?.length}
                    itemSize={50}
                    width={"100%"}
                    className="sidebar-scrollbar1"
                    itemData={{ documents: privateDocuments, handleDelete }}
                  >
                    {Row}
                  </List>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AllProjectKnowledge;
