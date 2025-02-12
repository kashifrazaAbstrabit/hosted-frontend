import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { reducer as userReducer } from "./userSlice";
import { reducer as inviteUserSlice } from "./inviteUserSlice";
import { reducer as projectSlice } from "./projectSlice";
import { reducer as documentSlice } from "./documentSlice";
import { reducer as securedStoreSlice } from "./securedStoreSlice";
import storage from "redux-persist/lib/storage"; // Use localStorage

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist user-related state
};

const rootReducer = combineReducers({
  user: userReducer,
  inviteUser: inviteUserSlice,
  projects: projectSlice,
  documents: documentSlice,
  securedStore: securedStoreSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default persistReducer(persistConfig, rootReducer);
