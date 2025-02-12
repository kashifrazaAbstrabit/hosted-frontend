import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import React, { Fragment } from "react";
import { Trash2 } from "lucide-react";

import Loading from "../../components/common/Loading";
import { FaFileImage } from "react-icons/fa";
import imageDoc from "../../assets/doc.svg";
import imagexls from "../../assets/xls.svg";
import imagePdf from "../../assets/pdfimg.svg";

interface Document {
  id: number;
  url: string;
  name: string;
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

  const getFileType = (url: string) => {
    const extension = url?.split(".").pop()?.split("?")[0];
    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "image";
      case "pdf":
        return "pdf";
      case "doc":
      case "docx":
        return "document";
      case "xls":
      case "xlsx":
        return "spreadsheet";
      default:
        return "unknown";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return (
          <FaFileImage className="text-[#2596be] h-[32px] w-[34px] text-3xl rounded-[12px]" />
        );
      case "pdf":
        return <img src={imagePdf} />;
      case "document":
        return <img src={imageDoc} />;
      case "spreadsheet":
        return <img src={imagexls} />;
      default:
        return "";
    }
  };

  return (
    <li
      key={doc?.id}
      style={style}
      className="flex justify-between mb-5 hover:bg-gray-100 rounded-lg items-center ps-4 bg-white p-1"
    >
      <a
        href={doc?.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-600 flex text-base items-center text-black hover:underline cursor-pointer truncate max-w-[75%] font-medium"
      >
        <span className="w-6 mr-2 h-6"> {getIcon(getFileType(doc?.url))}</span>
        {doc?.name}
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
        <>
          {" "}
          <div className=" overflow-auto">
            {documents && documents?.length === 0 ? (
              <p className="text-gray-500">
                {" "}
                No documents available for selected project.
              </p>
            ) : (
              <List
                height={getListHeight(documents?.length, 50)}
                itemCount={documents?.length}
                itemSize={50}
                width={"100%"}
                className="sidebar-scrollbar1"
                itemData={{ documents: documents, handleDelete }}
              >
                {Row}
              </List>
            )}
          </div>
        </>
      )}
    </Fragment>
  );
};

export default AllProjectKnowledge;
