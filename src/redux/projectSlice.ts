import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectState } from "../types/reduxTypes";
import customAxios from "../api/axios";
import { toast } from "react-toastify";
import { Project, Projects } from "../types/projectTypes";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

// Initial State
const initialState: ProjectState = {
  projects: [],
  loading: false,
  message: "",
  error: null,
  project: {
    name: "",
    description: "",
    start_date: "",
    status: "",
    assigned_people: [],
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    createProjectStart(state) {
      state.loading = true;
    },
    createProjectSuccess(state, action: PayloadAction<Projects[]>) {
      state.loading = false;
      state.projects = action.payload;
    },
    createProjectFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to load user";
    },

    fetchProjectsStart(state) {
      state.loading = true;
    },
    fetchProjectsSuccess(state, action: PayloadAction<Projects[]>) {
      state.loading = false;
      state.projects = action.payload;
    },
    fetchProjectsFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to load user";
    },

    deleteProjectStart(state) {
      state.loading = true;
    },
    deleteProjectSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.message = action.payload;
    },
    deleteProjectFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to load user";
    },

    updateProjectStart(state) {
      state.loading = true;
    },
    updateProjectSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.message = action.payload;
    },
    updateProjectFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to load user";
    },

    // Load User Actions
    singleProjectStart(state) {
      state.loading = true;
    },
    singleProjectSuccess(state, action: PayloadAction<Project>) {
      state.loading = false;
      state.project = action.payload;
    },
    singleProjectFailure(state, action: PayloadAction<string | undefined>) {
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
  createProjectStart,
  singleProjectStart,
  singleProjectSuccess,
  singleProjectFailure,
  createProjectSuccess,
  createProjectFailure,
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  deleteProjectStart,
  deleteProjectSuccess,
  deleteProjectFailure,
  updateProjectStart,
  updateProjectFailure,
  updateProjectSuccess,
} = projectSlice.actions;

// Load User
export const createProject =
  (
    projectData: any,
    setIsOpenCreateProject: { (isOpen: boolean): void; (arg0: boolean): void }
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(createProjectStart());
      const response = await customAxios.post(
        `${baseUrl}/api/v1/create/projects`,
        projectData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        toast.success("Project created successfully");
        setIsOpenCreateProject(false);
        fetchProjects();
      }
      dispatch(createProjectSuccess(response.data.projects));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load user";
      dispatch(createProjectFailure(errorMessage));
    }
  };

export const fetchProjects = () => async (dispatch: any) => {
  try {
    dispatch(fetchProjectsStart());
    const response = await customAxios.get(
      `${baseUrl}/api/v1/clients/projects`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    dispatch(fetchProjectsSuccess(response.data.projects));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to load user";
    dispatch(fetchProjectsFailure(errorMessage));
  }
};

export const deleteProject = (id: number) => async (dispatch: any) => {
  try {
    dispatch(deleteProjectStart());
    const response = await customAxios.delete(
      `${baseUrl}/api/v1/client/project/${id}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      toast.success("Project Deleted successfully");
    }
    dispatch(deleteProjectSuccess(response.data.message));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to load user";
    dispatch(deleteProjectFailure(errorMessage));
  }
};

export const updateProject =
  (id: number, updateData: any, setIsEdit: any) => async (dispatch: any) => {
    try {
      dispatch(updateProjectStart());
      const response = await customAxios.put(
        `${baseUrl}/api/v1/client/project/${id}`,
        updateData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Project Updated successfully");
        setIsEdit(false);
      }
      dispatch(updateProjectSuccess(response.data.message));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load user";
      dispatch(updateProjectFailure(errorMessage));
    }
  };

export const singleProjectForClient = (id: number) => async (dispatch: any) => {
  try {
    dispatch(singleProjectStart());
    const response = await customAxios.get(
      `${baseUrl}/api/v1/client/project/${id}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      // toast.success("Project retrieve successfully");
    }
    dispatch(singleProjectSuccess(response.data.project));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to load user";
    dispatch(singleProjectFailure(errorMessage));
  }
};

export const { reducer } = projectSlice;
export default projectSlice;
