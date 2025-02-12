import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { UpdateUserBody } from "../types/signup";
import { User } from "../types/userTypes";
import { AppDispatch } from "../types/reduxTypes";
import MetaData from "../components/common/MetaData";
import {
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaUsers,
  FaIdBadge,
  FaInfoCircle,
} from "react-icons/fa";
import githu from "../assets/gith.svg";
import gdrive from "../assets/gdrive.svg";
import ChangePassword from "../components/Users/ChangePassword";
import { loadUser, updateProfile } from "../redux/userSlice";
import { MdEdit } from "react-icons/md";
import axios from "axios";

interface SettingPageBody {
  user: User | null;
  open: boolean;
  selectedProjectDetails: any;
}

const SettingsPage = ({ user, open }: SettingPageBody) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<UpdateUserBody>({
    first_name: "",
    last_name: "",
    job_title: "",
    department: "",
    email: "",
    role: "",
    username: "",
    bio: "",
  });

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const [isEditable, setIsEditable] = useState(false);

  const handleChangeInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      ...formData,
      user_type: user?.user_type,
      auth_type: user?.auth_type,
      password: user?.password_hash,
    };

    try {
      await dispatch(updateProfile(data));
      toast.success("User updated successfully");
      setIsEditable(false);
      dispatch(loadUser());
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDriveUpload = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/documents/google/drive/auth`
      );
      console.log(response);
      if (response.data.success) {
        window.location.href = response.data.data.authUrl;
      }
    } catch (error) {
      console.error("OAuth Error:", error);
    }
  };

  // Populate form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        job_title: user.job_title || "",
        department: user.department || "",
        email: user.email || "",
        role: user.user_type || "",
        username: user.username || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);

  return (
    <div
      className={`${
        !open
          ? "w-[calc(100%-80px)] left-20 ml-20"
          : "w-[calc(100%-288px)] ml-72 left-72"
      } px-10 h-auto space-y-4 pt-5 pb-20 sidebar-scrollbar`}
    >
      <MetaData title="User Profile" />

      <div>
        <h2 className="text-xl font-semibold text-black mb-2">
          General Details
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Update your photo and personal details here
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="col-span-2 rounded-lg shadow-lg">
          <div className="flex justify-between items-center bg-[#EEEEEE] p-5 rounded-lg">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <MdEdit
              className="text-2xl cursor-pointer"
              onClick={() => setIsEditable(!isEditable)}
            />
          </div>

          <form className="mt-7 p-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {[
                { label: "First Name", name: "first_name", icon: <FaUser /> },
                { label: "Last Name", name: "last_name", icon: <FaUser /> },
                {
                  label: "Job Title",
                  name: "job_title",
                  icon: <FaBriefcase />,
                },
                {
                  label: "Department/Team",
                  name: "department",
                  icon: <FaUsers />,
                },
                { label: "Email", name: "email", icon: <FaEnvelope /> },
                { label: "Role", name: "role", icon: <FaIdBadge /> },
                { label: "Username", name: "username", icon: <FaUser /> },
              ].map(({ label, name, icon }) => (
                <div key={name} className="relative mb-4">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="relative flex-1">
                    <input
                      type={name === "email" ? "email" : "text"}
                      value={formData[name as keyof UpdateUserBody]}
                      onChange={handleChangeInput}
                      name={name}
                      autoFocus={name === "first_name" && isEditable}
                      disabled={!isEditable}
                      placeholder={`Enter ${label}`}
                      className="w-full border-b border-gray-300 px-4 py-3 focus:outline-none"
                    />
                    <span className="absolute top-3 right-3 text-gray-400">
                      {icon}
                    </span>
                  </div>
                </div>
              ))}

              {/* Bio */}
              <div className="relative mb-4 col-span-1 md:col-span-2">
                <label className="block text-base font-medium text-gray-700">
                  Bio ( Write a short introduction )
                </label>
                <div className="relative flex-1">
                  <textarea
                    value={formData.bio}
                    onChange={handleChangeInput}
                    name="bio"
                    disabled={!isEditable}
                    rows={4}
                    placeholder="Enter Bio"
                    className="w-full border-b border-gray-300 px-4 py-3 focus:outline-none"
                  />
                  <FaInfoCircle className="absolute top-3 right-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Save Changes Button */}
            {isEditable && (
              <div className="flex justify-end mt-5 bg-gray-100 p-10 gap-x-3">
                <button
                  onClick={() => setIsEditable(false)}
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
        <div className="space-y-6">
          <div className="shadow-lg rounded-lg">
            <div className="flex justify-between items-center bg-[#EEEEEE] p-5 rounded-lg">
              <h2 className="text-2xl font-semibold">Your Photo</h2>
              <MdEdit
                className="text-2xl cursor-pointer"
                onClick={() => setIsEditable(!isEditable)}
              />
            </div>
            <div className="flex items-center justify-start gap-x-8 p-5 rounded-lg">
              <div>
                <img
                  src="https://loremflickr.com/200/200?random=1"
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
              </div>
              <div className="space-y-4 flex flex-col justify-start items-start">
                <p className="text-base font-medium">Edit Your photo</p>
                <div className="flex gap-x-3">
                  <button className=" text-red-500 rounded-lg ">Delete</button>
                  <button className=" text-blue-500 rounded-lg">Update</button>
                </div>
              </div>
            </div>
          </div>
          <div className="shadow-lg rounded-lg">
            <div className="flex justify-between items-center bg-[#EEEEEE] p-5 rounded-lg">
              <h2 className="text-2xl font-semibold"> Connected Accounts</h2>
            </div>

            <div className="space-y-4 p-5 ">
              <div className="flex justify-between items-center">
                <div className="flex items-center justify-center gap-x-4">
                  <img src={githu} alt="" />
                  <div>
                    <p className="text-black">GitHub</p>
                    <p className="text-base text-gray-500">
                      Connected as {user?.email}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#EEEEEE] text-black rounded-lg ">
                  Disconnect
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center justify-center gap-x-4">
                  <img src={gdrive} alt="" />
                  <div>
                    <p className="text-black">Google Drive</p>
                    <p className="text-base text-gray-500">
                      Connected as {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDriveUpload}
                  className="px-4 py-2 bg-blue-500 text-white  rounded-lg "
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isChangePasswordModal && (
        <ChangePassword
          isChangePasswordModal={isChangePasswordModal}
          setIsChangePasswordModal={setIsChangePasswordModal}
        />
      )}
    </div>
  );
};

export default SettingsPage;
