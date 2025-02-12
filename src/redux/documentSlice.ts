import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentState } from "../types/reduxTypes";
import customAxios from "../api/axios";
import { Documents, ProjectKnowleges } from "../types/projectTypes";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

// Initial State
const initialState: DocumentState = {
  documents: [],
  projectKnowlegeDocuments: [],
  projectKnowlegeDocument: {
    uploadUrl: "",
    fineName: "",
    finalUrl: "",
  },
  loading: false,
  isDeleted: false,
  loadingCreate: false,
  message: "",
  error: "",
  errorMessageCreate: "",
  successUpload: false,
  successFinalUpload: false,
  loadingDocument: false,
  loadingProjectKnowledgeDocument: false,
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    createDocumentStart(state) {
      state.loadingCreate = true;
    },
    createDocumentSuccess(state, action: PayloadAction<Documents[]>) {
      state.loadingCreate = false;
      state.documents = action.payload;
    },
    createDocumentFailure(state, action: PayloadAction<string | undefined>) {
      state.loadingCreate = false;
      state.errorMessageCreate = action.payload || "Failed to load user";
    },

    fetchdocumentStart(state) {
      state.loadingDocument = true;
    },
    fetchdocumentSuccess(state, action: PayloadAction<Documents[]>) {
      state.loadingDocument = false;
      state.documents = action.payload;
    },
    fetchdocumentFailure(state, action: PayloadAction<string | undefined>) {
      state.loadingDocument = false;
      state.error = action.payload || "Failed to load user";
    },

    fetchProjectKnowlegedocumentStart(state) {
      state.loadingProjectKnowledgeDocument = true;
    },
    fetchProjectKnowlegedocumentSuccess(
      state,
      action: PayloadAction<ProjectKnowleges[]>
    ) {
      state.loadingProjectKnowledgeDocument = false;
      state.projectKnowlegeDocuments = action.payload;
    },
    fetchProjectKnowlegedocumentFailure(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.loadingProjectKnowledgeDocument = false;
      state.error = action.payload || "Failed to load user";
      state.projectKnowlegeDocuments = [];
    },

    deleteDocumentStart(state) {
      state.isDeleted = true;
    },
    deleteDocumentSuccess(state, action: PayloadAction<string>) {
      state.isDeleted = false;
      state.message = action.payload;
    },
    deleteDocumentFailure(state, action: PayloadAction<string | undefined>) {
      state.isDeleted = false;
      state.error = action.payload || "Failed to load user";
    },

    deleteResourceStart(state) {
      state.isDeleted = true;
    },
    deleteResourceSuccess(state, action: PayloadAction<string>) {
      state.isDeleted = false;
      state.message = action.payload;
    },
    deleteResourceFailure(state, action: PayloadAction<string | undefined>) {
      state.isDeleted = false;
      state.error = action.payload || "Failed to load user";
    },

    updateDocumentStart(state) {
      state.loading = true;
    },
    updateDocumentSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.message = action.payload;
    },
    updateDocumentFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to load user";
    },

    // Clear Errors and Reset Update
    clearErrors(state) {
      state.error = null;
    },
  },
});

export const {
  createDocumentStart,
  createDocumentSuccess,
  createDocumentFailure,
  fetchdocumentStart,
  fetchdocumentSuccess,
  fetchdocumentFailure,
  deleteDocumentStart,
  deleteDocumentSuccess,
  deleteDocumentFailure,

  fetchProjectKnowlegedocumentStart,
  fetchProjectKnowlegedocumentSuccess,
  fetchProjectKnowlegedocumentFailure,
  deleteResourceStart,
  deleteResourceSuccess,
  deleteResourceFailure,
} = documentSlice.actions;

// Load User
export const createDocument =
  (
    documentData: {
      title: string;
      projectId: number;
    },
    setIsOpenCreateDocument: { (isOpen: boolean): void; (arg0: boolean): void },
    navigate: any
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(createDocumentStart());
      const response = await customAxios.post(
        `${baseUrl}/api/v1/documents/google/docs/file`,
        documentData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsOpenCreateDocument(false);
      }
      dispatch(createDocumentSuccess(response.data.projects));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to create documets";
      if (error.response?.data?.error?.type === "GOOGLE_DRIVE_NOT_LINKED") {
        toast.error(errorMessage);
        navigate("/settings");
      }
      dispatch(createDocumentFailure(errorMessage));
    }
  };

export const fetchDocument = (projectId: number) => async (dispatch: any) => {
  try {
    dispatch(fetchdocumentStart());
    const response = await customAxios.post(
      `${baseUrl}/api/v1/documents/google/docs/files`,
      { projectId: projectId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch(fetchdocumentSuccess(response.data.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to load user";
    dispatch(fetchdocumentFailure(errorMessage));
  }
};

export const fetchProjectKnowledgeDocument =
  (projectId: number) => async (dispatch: any) => {
    try {
      dispatch(fetchProjectKnowlegedocumentStart());
      const response = await customAxios.post(
        `${baseUrl}/api/v1/documents/azure/list`,
        { projectId: projectId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(fetchProjectKnowlegedocumentSuccess(response.data.data));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load user";
      dispatch(fetchProjectKnowlegedocumentFailure(errorMessage));
    }
  };

export const deleteDocument = (fileId: string) => async (dispatch: any) => {
  try {
    dispatch(deleteDocumentStart());

    const response = await customAxios.delete(
      `${baseUrl}/api/v1/documents/google/docs/file`,
      {
        data: { fileId }, // ✅ Corrected: fileId should be inside `data`
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      toast.success("File Deleted successfully");
    }

    dispatch(deleteDocumentSuccess(response.data.message));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete document";
    dispatch(deleteDocumentFailure(errorMessage));
  }
};

export const deleteResource =
  (fileName: string, projectId: number) => async (dispatch: any) => {
    try {
      dispatch(deleteResourceStart());

      const response = await customAxios.delete(
        `${baseUrl}/api/v1/documents/azure/delete`,
        {
          data: { projectId, fileName },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Resource Deleted successfully");
      }

      dispatch(deleteResourceSuccess(response.data.message));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete document";
      dispatch(deleteResourceFailure(errorMessage));
    }
  };

// export const updateDocument =
//   (id: number, updateData: any, setIsEdit: any) => async (dispatch: any) => {
//     try {
//       dispatch(updateProjectStart());
//       const response = await customAxios.put(
//         `${baseUrl}/api/v1/client/project/${id}`,
//         updateData,
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       if (response.status === 200) {
//         toast.success("Project Updated successfully");
//         setIsEdit(false);
//       }
//       dispatch(updateProjectSuccess(response.data.message));
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || "Failed to load user";
//       dispatch(updateProjectFailure(errorMessage));
//     }
//   };

// export const singleProjectForClient = (id: number) => async (dispatch: any) => {
//   try {
//     dispatch(singleProjectStart());
//     const response = await customAxios.get(
//       `${baseUrl}/api/v1/client/project/${id}`,
//       {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       }
//     );
//     if (response.status === 200) {
//       // toast.success("Project retrieve successfully");
//     }
//     dispatch(singleProjectSuccess(response.data.project));
//   } catch (error: any) {
//     const errorMessage = error.response?.data?.message || "Failed to load user";
//     dispatch(singleProjectFailure(errorMessage));
//   }
// };

export const { reducer } = documentSlice;
export default documentSlice;
