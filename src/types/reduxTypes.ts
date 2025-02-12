import store from "../store";
import { InviteUsers } from "./devTypes";
import {
  Documents,
  Project,
  ProjectKnowlege,
  ProjectKnowleges,
  Projects,
  SecrueDetail,
  SecureFileDetail,
  SecureFileStore,
  SecureFileStores,
  SecureStores,
} from "./projectTypes";
import { User } from "./userTypes";

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;

  loading: boolean;
  refreshingToken: boolean;
  isUpdated: boolean;
  success: boolean;
  activeUsers: User | null;
  error: {
    message: string | null;
  };
  message: string | null;
  accessToken: string;
}

export interface InviteState {
  inviteUsers: InviteUsers[]; // Array of developers, not a single developer
  isAuthenticated: boolean;
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
}

export interface ProjectState {
  projects: Projects[];
  loading: boolean;
  message: string | null;
  error: string | null;
  project: Project | null;
}

export interface DocumentState {
  documents: Documents[];
  projectKnowlegeDocuments: ProjectKnowleges[];
  projectKnowlegeDocument: ProjectKnowlege;
  loading: boolean;
  loadingCreate: boolean;
  isDeleted: boolean;
  message: string | null;
  errorMessageCreate: string | null;
  error: string | null;
  successUpload: boolean;
  successFinalUpload: boolean;
  loadingDocument: boolean;
  loadingProjectKnowledgeDocument: boolean;
}

export interface SecureStoreState {
  securedStore: SecureStores[];
  securedFileStore: SecureFileStores[];
  secureStoreFile: SecureFileStore;
  securedSotreDetail: SecrueDetail;
  secruedSotreFileDetail: SecureFileDetail;
  loading: boolean;
  loadingCreateFile: boolean;
  loadingCreate: boolean;
  loadingEdit: boolean;
  loadingEditFile: boolean;
  isDeletedForCredential: boolean;
  isDeletedForFile: boolean;
  message: string | null;
  error: string | null;
  successCredential: boolean;
  successFile: boolean;
  successEditCredential: boolean;
  successEditFile: boolean;
  successUpload: boolean;
  loadingCredential: boolean;
  loadingFile: boolean;
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
