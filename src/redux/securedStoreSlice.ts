import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SecureStoreState } from "../types/reduxTypes";
import customAxios from "../api/axios";
import {
  SecrueDetail,
  SecureFileDetail,
  SecureFileStore,
  SecureFileStores,
  SecureStores,
} from "../types/projectTypes";

import {
  SecureDataFileInterface,
  SecureDataInterface,
} from "../types/secureTypes";
import { toast } from "react-toastify";
import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

// Initial State
const initialState: SecureStoreState = {
  securedStore: [],
  securedFileStore: [],
  securedSotreDetail: {},
  secruedSotreFileDetail: {},
  secureStoreFile: {},
  loading: false,
  isDeletedForCredential: false,
  isDeletedForFile: false,
  loadingCreate: false,
  loadingCreateFile: false,
  loadingEdit: false,
  loadingEditFile: false,
  message: "",
  error: null,
  successCredential: false,
  successFile: false,
  successEditCredential: false,
  successEditFile: false,
  successUpload: false,
  loadingCredential: false,
  loadingFile: false,
};

const securedStoreSlice = createSlice({
  name: "secureStore",
  initialState,
  reducers: {
    createsecureStoreStart(state) {
      state.loadingCreate = true;
      state.successCredential = false;
    },
    createsecureStoreSuccess(state) {
      state.loadingCreate = false;
      state.successCredential = true;
      // state.securedStore = action.payload;
    },
    createsecureStoreFailure(state, action: PayloadAction<string | undefined>) {
      state.loadingCreate = false;
      state.successCredential = false;

      state.error = action.payload || "Failed to load user";
    },

    resetSuccessCredential(state) {
      state.successCredential = false;
    },

    createsecureFileStoreStart(state) {
      state.loadingCreateFile = true;
    },
    createsecureFileStoreSuccess(state) {
      state.loadingCreateFile = false;
      state.successFile = true;
    },
    createsecureFileStoreFailure(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.loadingCreateFile = false;
      state.error = action.payload || "Failed to load user";
    },

    resetSuccessFile(state) {
      state.successFile = false;
    },

    updatesecureStoreStart(state) {
      state.loadingEdit = true;
    },
    updatesecureStoreSuccess(state) {
      state.loadingEdit = false;
      state.successEditCredential = true;
      // state.securedStore = action.payload;
    },
    updatesecureStoreFailure(state, action: PayloadAction<string | undefined>) {
      state.loadingEdit = false;
      state.error = action.payload || "Failed to load user";
    },

    updatesecureFileStoreStart(state) {
      state.loadingEditFile = true;
    },
    updatesecureFileStoreSuccess(state) {
      state.loadingEditFile = false;
      state.successEditFile = true;
    },
    updatesecureFileStoreFailure(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.loadingEditFile = false;
      state.error = action.payload || "Failed to load user";
    },

    uploadsecureStoreStart(state) {
      state.loading = true;
    },
    uploadsecureStoreSuccess(state, action: PayloadAction<SecureFileStore>) {
      state.loading = false;
      state.secureStoreFile = action.payload;
      state.successUpload = true;
    },

    uploadsecureStoreFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to load user";
      state.secureStoreFile = {};
    },
    finalUploadsecureStoreStart(state) {
      state.loading = true;
    },
    finalUploadsecureStoreSuccess(
      state,
      action: PayloadAction<SecureStores[]>
    ) {
      state.loading = false;
      state.securedStore = action.payload;
    },
    finalUploadsecureStoreFailure(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.loading = false;
      state.error = action.payload || "Failed to load user";
    },

    fetchsecureStoreStart(state) {
      state.loadingCredential = true;
    },
    fetchsecureStoreSuccess(state, action: PayloadAction<SecureStores[]>) {
      state.loadingCredential = false;
      state.securedStore = action.payload;
    },
    fetchsecureStoreFailure(state, action: PayloadAction<string | undefined>) {
      state.loadingCredential = false;
      state.error = action.payload || "Failed to load user";
    },

    fetchsecureFileStoreStart(state) {
      state.loadingFile = true;
    },
    fetchsecureFileStoreSuccess(
      state,
      action: PayloadAction<SecureFileStores[]>
    ) {
      state.loadingFile = false;
      state.securedFileStore = action.payload;
    },
    fetchsecureFileStoreFailure(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.loadingFile = false;
      state.error = action.payload || "Failed to load user";
    },

    fetchProjectSecurdeDetailStart(state) {
      state.loading = true;
    },
    fetchProjectSecurdeDetailSuccess(
      state,
      action: PayloadAction<SecrueDetail>
    ) {
      state.loading = false;
      state.securedSotreDetail = action.payload;
    },
    fetchProjectSecurdeDetailFailure(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.loading = false;
      state.error = action.payload || "Failed to load user";
      state.securedSotreDetail = {};
    },

    fetchProjectSecurdeFileDetailStart(state) {
      state.loading = true;
    },
    fetchProjectSecurdeFileDetailSuccess(
      state,
      action: PayloadAction<SecureFileDetail>
    ) {
      state.loading = false;
      state.secruedSotreFileDetail = action.payload;
    },
    fetchProjectSecurdeFileDetailFailure(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.loading = false;
      state.error = action.payload || "Failed to load user";
      state.secruedSotreFileDetail = {};
    },

    deletesecureStoreStart(state) {
      state.isDeletedForCredential = true;
    },
    deletesecureStoreSuccess(state, action: PayloadAction<string>) {
      state.isDeletedForCredential = false;
      state.message = action.payload;
    },
    deletesecureStoreFailure(state, action: PayloadAction<string | undefined>) {
      state.isDeletedForCredential = false;
      state.error = action.payload || "Failed to load user";
    },

    deletesecureStoreFileStart(state) {
      state.isDeletedForFile = true;
    },
    deletesecureStoreFileSuccess(state, action: PayloadAction<string>) {
      state.isDeletedForFile = false;
      state.message = action.payload;
    },
    deletesecureStoreFileFailure(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.isDeletedForFile = false;
      state.error = action.payload || "Failed to load user";
    },

    clearErrors(state) {
      state.error = null;
    },
  },
});

export const {
  createsecureStoreStart,
  createsecureStoreSuccess,
  createsecureStoreFailure,
  fetchsecureStoreStart,
  fetchsecureStoreSuccess,
  fetchsecureStoreFailure,
  createsecureFileStoreStart,
  createsecureFileStoreSuccess,
  createsecureFileStoreFailure,
  fetchsecureFileStoreStart,
  fetchsecureFileStoreSuccess,
  fetchsecureFileStoreFailure,

  uploadsecureStoreFailure,
  uploadsecureStoreSuccess,
  uploadsecureStoreStart,
  finalUploadsecureStoreStart,
  finalUploadsecureStoreSuccess,
  finalUploadsecureStoreFailure,
  updatesecureStoreStart,
  updatesecureStoreSuccess,
  updatesecureStoreFailure,
  updatesecureFileStoreStart,
  updatesecureFileStoreSuccess,
  updatesecureFileStoreFailure,
  deletesecureStoreStart,
  deletesecureStoreSuccess,
  deletesecureStoreFailure,
  deletesecureStoreFileStart,
  deletesecureStoreFileSuccess,
  deletesecureStoreFileFailure,
  fetchProjectSecurdeFileDetailFailure,
  fetchProjectSecurdeFileDetailSuccess,
  fetchProjectSecurdeFileDetailStart,
  fetchProjectSecurdeDetailFailure,
  fetchProjectSecurdeDetailSuccess,
  fetchProjectSecurdeDetailStart,
  resetSuccessCredential,
  resetSuccessFile,
} = securedStoreSlice.actions;

export const createsecureStore =
  (secureStoreData: SecureDataInterface) => async (dispatch: any) => {
    try {
      dispatch(createsecureStoreStart());
      const response = await customAxios.post(
        `${baseUrl}/api/v1/secure-store/credentials`,
        secureStoreData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(createsecureStoreSuccess(response.data.projects));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.type || "Failed to load user";
      toast.error(errorMessage);
      dispatch(createsecureStoreFailure(errorMessage));
    }
  };

export const createsecureFileStore =
  (secureStoreData: SecureDataFileInterface) => async (dispatch: any) => {
    try {
      dispatch(createsecureFileStoreStart());
      const response = await customAxios.post(
        `${baseUrl}/api/v1/secure-store/file`,
        secureStoreData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(createsecureFileStoreSuccess(response.data.projects));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to load user";
      toast.error(errorMessage);
      dispatch(createsecureFileStoreFailure(errorMessage));
    }
  };

export const updatesecureStore =
  (secureStoreData: SecureDataInterface, id: number) =>
  async (dispatch: any) => {
    try {
      dispatch(updatesecureStoreStart());
      const response = await customAxios.put(
        `${baseUrl}/api/v1/secure-store/credentials`,
        { ...secureStoreData, id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(updatesecureStoreSuccess(response.data.projects));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.type || "Failed to load user";
      toast.error(errorMessage);
      dispatch(updatesecureStoreFailure(errorMessage));
    }
  };

export const updatesecureFileStore =
  (secureStoreData: SecureDataFileInterface, id: number) =>
  async (dispatch: any) => {
    try {
      dispatch(updatesecureFileStoreStart());
      const response = await customAxios.put(
        `${baseUrl}/api/v1/secure-store/file`,
        { ...secureStoreData, id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(updatesecureFileStoreSuccess(response.data.projects));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to load user";
      toast.error(errorMessage);
      dispatch(updatesecureFileStoreFailure(errorMessage));
    }
  };

export const uploasecureStoreFile =
  (
    data: { fileName: string; projectId: number },
    setUploadUrl: (val: string) => void
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(uploadsecureStoreStart());
      const response = await axios.post(
        `${baseUrl}/api/v1/secure-store/file/upload`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUploadUrl(response?.data?.data?.uploadUrl);
        // setIsOpenCreatesecureStore(false);
      }
      dispatch(uploadsecureStoreSuccess(response?.data?.data));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to load user";
      dispatch(uploadsecureStoreFailure(errorMessage));
    }
  };

export const finalUploasecureStore =
  (url: string, selectedFile: File) => async (dispatch: any) => {
    try {
      dispatch(finalUploadsecureStoreStart());

      // file as binary data
      const fileData = new Blob([selectedFile], { type: selectedFile.type });

      const headers = {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": selectedFile.type || "application/octet-stream",
      };

      const response = await axios.put(decodeURIComponent(url), fileData, {
        headers,
      });

      console.log(response, "finalUploadsecureStoreSuccess");

      dispatch(finalUploadsecureStoreSuccess(response.data.data));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || "Upload failed";
      toast.error(errorMessage);
      dispatch(finalUploadsecureStoreFailure(errorMessage));
    }
  };

export const fetchsecureStore =
  (projectId: number) => async (dispatch: any) => {
    try {
      dispatch(fetchsecureStoreStart());
      const response = await customAxios.post(
        `${baseUrl}/api/v1/secure-store`,
        { projectId: projectId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(fetchsecureStoreSuccess(response?.data?.data?.credentials));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to load user";
      dispatch(fetchsecureStoreFailure(errorMessage));
    }
  };

export const fetchsecureFileStore =
  (projectId: number) => async (dispatch: any) => {
    try {
      dispatch(fetchsecureFileStoreStart());
      const response = await customAxios.post(
        `${baseUrl}/api/v1/secure-store`,
        { projectId: projectId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(fetchsecureFileStoreSuccess(response?.data?.data?.files));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to load user";
      dispatch(fetchsecureFileStoreFailure(errorMessage));
    }
  };

export const deleteSecureCredetial = (id: number) => async (dispatch: any) => {
  try {
    dispatch(deletesecureStoreStart());

    const response = await customAxios.delete(
      `${baseUrl}/api/v1/secure-store/credentials`,
      {
        data: { id }, // ✅ Corrected: fileId should be inside `data`
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      toast.success("Credential Deleted successfully");
    }

    dispatch(deletesecureStoreSuccess(response.data.message));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message || "Failed to delete document";
    dispatch(deletesecureStoreFailure(errorMessage));
  }
};

export const deleteSecureFile = (id: number) => async (dispatch: any) => {
  try {
    dispatch(deletesecureStoreFileStart());

    const response = await customAxios.delete(
      `${baseUrl}/api/v1/secure-store/file`,
      {
        data: { id }, // ✅ Corrected: fileId should be inside `data`
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      toast.success("File Deleted successfully");
    }

    dispatch(deletesecureStoreFileSuccess(response.data.message));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message || "Failed to delete document";
    dispatch(deletesecureStoreFileFailure(errorMessage));
  }
};

export const singleSecureStore = (id: number) => async (dispatch: any) => {
  try {
    dispatch(fetchProjectSecurdeDetailStart());
    const response = await customAxios.get(
      `${baseUrl}/api/v1/secure-store/credentials?id=${id}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch(fetchProjectSecurdeDetailSuccess(response.data.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to load user";
    dispatch(fetchProjectSecurdeDetailFailure(errorMessage));
  }
};

export const singleSecureFileStore = (id: number) => async (dispatch: any) => {
  try {
    dispatch(fetchProjectSecurdeFileDetailStart());
    const response = await customAxios.get(
      `${baseUrl}/api/v1/secure-store/file?id=${id}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      // toast.success("Project retrieve successfully");
    }
    dispatch(fetchProjectSecurdeFileDetailSuccess(response.data.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to load user";
    dispatch(fetchProjectSecurdeFileDetailFailure(errorMessage));
  }
};

export const { reducer } = securedStoreSlice;
export default securedStoreSlice;
