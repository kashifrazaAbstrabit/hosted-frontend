import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InviteState } from "../types/reduxTypes";
import customAxios from "../api/axios";
import { toast } from "react-toastify";
import { InviteUsers } from "../types/devTypes";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

// Initial State
const initialState: InviteState = {
  inviteUsers: [],
  isAuthenticated: false,
  loading: false,
  success: false,
  error: null,
  message: null,
};

const inviteUserSlice = createSlice({
  name: "inviteUsers",
  initialState,
  reducers: {
    // sent invitation
    inviteDevStart(state) {
      state.loading = true;
      state.success = false;
    },
    inviteDevSuccess(state, action: PayloadAction<InviteUsers[]>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.inviteUsers = action.payload;
      state.success = true;
    },
    inviteDevFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload || "Failed to load user";
      state.success = false;
    },

    //resend invitation
    resendInvitationStart(state) {
      state.loading = true;
      state.message = null;
    },
    resendInvitationSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.message = action.payload;
    },
    resendInvitationFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to resend invitation";
    },

    // Fetch All Dev Members Actions
    fetchDevMembersStart(state) {
      state.loading = true;
    },
    fetchDevMembersSuccess(state, action: PayloadAction<InviteUsers[]>) {
      state.loading = false;
      state.inviteUsers = action.payload;
      state.isAuthenticated = true;
    },
    fetchDevMembersFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to fetch developers.";
    },

    // Delete Dev Member Actions
    deleteDevMemberStart(state) {
      state.loading = true;
    },
    deleteDevMemberSuccess(state, action: PayloadAction<number>) {
      state.loading = false;
      state.inviteUsers = state.inviteUsers.filter(
        (dev) => dev.id !== action.payload
      );
    },
    deleteDevMemberFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to delete developer.";
    },
    clearErrors(state) {
      state.error = null;
    },
  },
});

export const {
  inviteDevStart,
  inviteDevSuccess,
  inviteDevFailure,
  resendInvitationStart,
  resendInvitationFailure,
  resendInvitationSuccess,
  fetchDevMembersStart,
  fetchDevMembersSuccess,
  fetchDevMembersFailure,
  deleteDevMemberStart,
  deleteDevMemberSuccess,
  deleteDevMemberFailure,
  clearErrors,
} = inviteUserSlice.actions;

// Load User
export const inviteDevMember = (emails: string[]) => async (dispatch: any) => {
  try {
    dispatch(inviteDevStart());
    const response = await customAxios.post(
      `${baseUrl}/api/v1/developers/invite`,
      { emails },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    dispatch(inviteDevSuccess(response.data.developers));
    toast.success("Invite sent Successfully");
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to load user";
    dispatch(inviteDevFailure(errorMessage));
  }
};

export const resendInvitation = (email: string) => async (dispatch: any) => {
  try {
    dispatch(resendInvitationStart());
    const response = await customAxios.post(
      `${baseUrl}/api/v1/resend-invitation`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    dispatch(resendInvitationSuccess(response.data.message));
    toast.success("Invite sent Successfully");
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to load user";
    dispatch(resendInvitationStart(errorMessage));
  }
};

// Thunk to Fetch All Dev Members
export const fetchAllDevMembers = () => async (dispatch: any) => {
  try {
    dispatch(fetchDevMembersStart());
    const response = await customAxios.get(
      `${baseUrl}/api/v1/developers/invite`,
      {
        withCredentials: true,
      }
    );
    dispatch(fetchDevMembersSuccess(response.data.developers));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch developers.";
    dispatch(fetchDevMembersFailure(errorMessage));
  }
};

// Thunk to Delete a Dev Member
export const deleteDevMember = (id: number) => async (dispatch: any) => {
  try {
    dispatch(deleteDevMemberStart());
    await customAxios.delete(`${baseUrl}/api/v1/developers/invite/${id}`, {
      withCredentials: true,
    });
    dispatch(deleteDevMemberSuccess(id));
    toast.success("Developer deleted successfully!");
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete developer.";
    dispatch(deleteDevMemberFailure(errorMessage));
    toast.error(errorMessage);
  }
};

export const { reducer } = inviteUserSlice;
export default inviteUserSlice;
