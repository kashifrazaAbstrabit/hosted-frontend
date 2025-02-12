import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import SignupRoleSelection from "./pages/signup/SignupRoleSelection";
import SignupStep2 from "./pages/signup/SignupStep2";
import SignIn from "./pages/SignIn";
import Sidebar from "./components/common/Sidebar";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Header from "./layouts/Header";
import { RootState, AppDispatch } from "./types/reduxTypes";
import ProtectedRoute from "./components/Route/ProtectedRoute";

import SettingsPage from "./pages/SettingsPage";
import ForgotPassword from "./components/Users/ForgotPassword";
import ResetPassword from "./components/Users/ResetPassword";
import Projects from "./pages/Projects";
import DevTeam from "./pages/dev-teams/DevTeam";
import EmailVerify from "./pages/VerifyEmail";
import NotFound from "./layouts/NotFound";
import HeroSection from "./pages/HeroSection";
import { setupInterceptors } from "./api/axios";
import SuccessToken from "./pages/SuccessToken";
import { loadUser } from "./redux/userSlice";
import HeaderMain from "./layouts/HeaderMain";
import ManageProject from "./pages/manage-project/ManageProject";
import { fetchProjects } from "./redux/projectSlice";
import SecuredStore from "./pages/secured-store/SecuredStore";
import Documents from "./pages/documents/Documents";
import Deployment from "./pages/deployment/Deployment";

import GoogleDriveCallback from "./pages/documents/GoogleDriveCallback";

const App = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [isOpenCreateDevTeam, setIsOpenCreateDevTeam] =
    useState<boolean>(false);

  const initialSelectedProject = localStorage.getItem("selectedProject");
  const parsedProject = initialSelectedProject
    ? JSON.parse(initialSelectedProject)
    : null;

  const [selectedProjectDetails, setSelectedProjectDetails] =
    useState(parsedProject);

  const [isCredentialOpen, setIsCredentialOpen] = useState<boolean>(false);
  const [isFileOpen, setIsFileOpen] = useState<boolean>(false);

  const getInitialRoute = () => {
    const lastVisitedPath = localStorage.getItem("lastVisitedPath");
    return lastVisitedPath || "/manage-project";
  };

  const [currentPage, setCurrentPage] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    setupInterceptors(dispatch);
    dispatch(loadUser());
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="">
      <BrowserRouter>
        {!isAuthenticated && <Header />}
        <TrackPage setCurrentPage={setCurrentPage} />
        {isAuthenticated && (
          <HeaderMain
            open={open}
            page={currentPage}
            setIsOpenCreateDevTeam={setIsOpenCreateDevTeam}
            user={user}
            setIsCredentialOpen={setIsCredentialOpen}
            setIsFileOpenPopup={setIsFileOpen}
            setSelectedProjectDetails={setSelectedProjectDetails}
          />
        )}

        {isAuthenticated && (
          <div className="w-72">
            <Sidebar
              user={user}
              isAuthenticated={isAuthenticated}
              open={open}
              setOpen={setOpen}
            />
          </div>
        )}

        <Routes>
          <Route path="/" element={<HeroSection />} />

          <Route path="/login" element={<SignIn />} />
          <Route
            path="/signup/role-selection"
            element={<SignupRoleSelection />}
          />
          <Route path="/signup" element={<SignupStep2 />} />
          <Route path="/forgot/password" element={<ForgotPassword />} />
          <Route path="/reset/password/:token" element={<ResetPassword />} />
          <Route path="/verify/email/:token" element={<EmailVerify />} />

          {/* // Protected Routes */}

          <Route
            path="/manage-project"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ManageProject open={open} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SettingsPage
                  user={user}
                  open={open}
                  selectedProjectDetails={selectedProjectDetails}
                />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/google-drive/callback"
            element={<GoogleDriveCallback />}
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Projects />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/dev-teams"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DevTeam
                  open={open}
                  isOpenCreateDevTeam={isOpenCreateDevTeam}
                  setIsOpenCreateDevTeam={setIsOpenCreateDevTeam}
                />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/secured-store"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SecuredStore
                  open={open}
                  isCredentialOpenPopup={isCredentialOpen}
                  setIsCredentialOpenPopup={setIsCredentialOpen}
                  isFileOpenPopup={isFileOpen}
                  setIsFileOpenPopup={setIsFileOpen}
                  selectedProjectDetails={selectedProjectDetails}
                />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Documents
                  open={open}
                  selectedProjectDetails={selectedProjectDetails}
                />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/deployment"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Deployment />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SuccessToken />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to={getInitialRoute()} replace />
              ) : (
                <NotFound />
              )
            }
          />
        </Routes>
        {/* <Footer /> */}
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
};

export default App;

const TrackPage = ({
  setCurrentPage,
}: {
  setCurrentPage: (val: string) => void;
}) => {
  const location = useLocation();
  setCurrentPage(location.pathname);
  return <div></div>;
};
