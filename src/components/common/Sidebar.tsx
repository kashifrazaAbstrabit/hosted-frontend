import { useEffect, useState } from "react";
import { FaPlusCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Menus } from "../../utils/menu";
import CreateProject from "../../popup/CreateProjectModal";
import UserProfile from "../Users/UserProfile";
import { User } from "../../types/userTypes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../types/reduxTypes";
import { logout } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { GoSidebarCollapse } from "react-icons/go";

import { LightTooltip } from "../../utils/help";

interface HeaderBody {
  user: User | null;
  isAuthenticated: boolean;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const Sidebar = ({ user, isAuthenticated, open, setOpen }: HeaderBody) => {
  const [active, setIsActive] = useState<string>(
    localStorage.getItem("activeSidebar") || Menus[0]?.title || "Manage Project"
  );

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isOpenCreateProject, setIsOpenCreateProject] =
    useState<boolean>(false);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenu = Menus.find((item) => item.link === currentPath);
    if (activeMenu) {
      setIsActive(activeMenu.title);
      localStorage.setItem("activeSidebar", activeMenu.title);
    }
  }, []);

  const filteredMenus = Menus.filter(
    (menu) => !menu.role || menu.role === user?.user_type
  );

  return (
    <div className="">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } bg-[var(--primary-color)] z-40 fixed top-0 left-0 h-screen pt-7 ease-in-out transition-all duration-300 sidebar-scrollbar`}
      >
        <div className="h-screen  overflow-y-auto overflow-x-hidden  sidebar-scrollbar relative">
          <LightTooltip title={`${open ? "Collaps" : "Expand"}`}>
            <div
              className={`absolute  ${
                open ? "right-2" : "left-5 top-12"
              }  top-0 z-50`}
            >
              <GoSidebarCollapse
                onClick={() => setOpen(!open)}
                className={`cursor-pointer text-white font-extrabold text-3xl  ${
                  !open ? "rotate-180" : ""
                }`}
              />
            </div>
          </LightTooltip>

          <div className="sticky top-0 left-0 bg-[var(--primary-color)]">
            <LightTooltip title="Intellidev">
              <Link
                to="/"
                className="flex text-3xl items-center justify-start ms-5 gap-0 mb-14"
              >
                <h2 className="text-[var(--secondary-color)] font-extrabold">
                  {open ? " Intelli" : "I"}
                </h2>
                <h2 className="text-[var(--button-bg-color)] font-medium">
                  {open ? "Dev" : "D"}
                </h2>
              </Link>
            </LightTooltip>
          </div>

          <div className="h-screen overflow-auto mb-20 sidebar-scrollbar">
            {user?.user_type === "client" && (
              <LightTooltip title={" Create Project"}>
                <div className="ms-5 mt-2 mb-3">
                  <li
                    onClick={() => setIsOpenCreateProject(true)}
                    className={`flex w-2/3 bg-black items-center gap-x-2 h-10 justify-center mb-2 cursor-pointer text-[var(--button-bg-color)] border rounded-full border-[var(--button-bg-color)]`}
                  >
                    <span>
                      <FaPlusCircle className="text-xl" />
                    </span>
                    <span className={`${!open ? "hidden" : "block"} text-lg`}>
                      Create Project
                    </span>
                  </li>
                </div>
              </LightTooltip>
            )}

            <ul className="mt-5">
              {filteredMenus.map((Menu, index) => (
                <LightTooltip title={Menu.title} key={index}>
                  <li
                    key={index}
                    onClick={() => {
                      setIsActive(Menu.title);
                      localStorage.setItem("activeSidebar", Menu.title);
                      navigate(Menu.link, {
                        state: { title: Menu.title },
                      });
                    }}
                    className={`flex items-center $${
                      index === 2 && active === Menu.title
                        ? "border-y border-[var(--primary-light-color)]"
                        : ""
                    } ${
                      index === 1 ? "mb-20 " : ""
                    } gap-x-3 h-12 py-5 cursor-pointer ${
                      active === Menu.title
                        ? "border-l-4 border-[var(--button-bg-color)] ps-4"
                        : "border-b border-[var(--primary-light-color)] ps-5 hover:bg-[var(--primary-light-color)]"
                    }`}
                  >
                    <span>
                      <img
                        src={active === Menu.title ? Menu.activeImg : Menu.icon}
                        alt={Menu.title}
                        className="w-7 h-7"
                      />
                    </span>
                    <span
                      className={`${!open ? "hidden" : "block"} text-lg ${
                        active === Menu.title
                          ? "text-[var(--button-bg-color)]"
                          : "text-[var(--secondary-color)]"
                      }`}
                    >
                      {Menu.title}
                    </span>
                  </li>
                </LightTooltip>
              ))}
            </ul>
          </div>

          <div
            className={`fixed bottom-0 ${
              !open ? "w-20" : "w-72"
            }  bg-black px-5 py-5`}
          >
            <LightTooltip title="Profile">
              <div className="text-white text-center">
                {isAuthenticated && <UserProfile user={user} open={open} />}
              </div>
            </LightTooltip>
            <button className="w-full">
              <LightTooltip title="Logout">
                <li
                  onClick={handleLogout}
                  className="flex gap-x-2 items-center justify-center py-2 bg-gray-800 rounded-full text-white"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span className={`${!open ? "hidden" : "block"} text-lg`}>
                    Logout
                  </span>
                </li>
              </LightTooltip>
            </button>
          </div>
        </div>
      </div>

      {isOpenCreateProject && (
        <CreateProject
          isOpenCreateProject={isOpenCreateProject}
          setIsOpenCreateProject={setIsOpenCreateProject}
        />
      )}
    </div>
  );
};

export default Sidebar;
