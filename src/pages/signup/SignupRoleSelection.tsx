import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import profile from "../../assets/profile.png";
import { useSelector } from "react-redux";

import { RootState } from "../../types/reduxTypes";
import MetaData from "../../components/common/MetaData";

const SignupRoleSelection = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [selectedRole, setSelectedRole] = useState<string>("client");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div
      className="bg-center bg-gray-100 h-[calc(100vh-80px)] top-20 bg-cover"
      style={{
        backgroundImage: `url(https://abswebsiteassets.blob.core.windows.net/websiteimages/signupbg.png)`,
      }}
    >
      <div className="flex flex-col items-center justify-center gap-7 pt-36">
        <MetaData title="Sign Up as Client or Developer" />

        <h1 className="text-3xl font-bold mb-5">
          Join as a Client or Developer
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            className={`p-6 gap-7 border w-full  rounded-lg  cursor-pointer space-y-7 ${
              selectedRole === "client"
                ? "border-green-500 shadow-lg"
                : "border-gray-300 shadow-md"
            }`}
            onClick={() => setSelectedRole("client")}
          >
            <div className="flex items-center justify-between w-full">
              <div className="bg-gray-200 p-2 rounded-full">
                <img
                  src={profile}
                  alt=""
                  className="w-5 h-5 flex items-center justify-center"
                />
              </div>
              <input
                type="radio"
                autoFocus
                className="w-7 h-7 custom-radio"
                checked={selectedRole === "client"}
                onChange={() => setSelectedRole("client")}
              />
            </div>
            <p className="text-xl text-start font-medium">
              I am a client, looking to manage <br /> projects
            </p>
          </div>
          <div
            className={`p-6 gap-7 border w-full  rounded-lg  cursor-pointer space-y-7 ${
              selectedRole === "developer"
                ? "border-green-500 shadow-lg"
                : "border-gray-300 shadow-md"
            }`}
            onClick={() => setSelectedRole("developer")}
          >
            <div className="flex items-center justify-between w-full">
              <div className="bg-gray-200 p-2 rounded-full">
                <img
                  src={profile}
                  alt=""
                  className="w-5 h-5 flex items-center justify-center"
                />
              </div>
              <input
                type="radio"
                autoFocus
                className="w-7 h-7 custom-radio"
                checked={selectedRole === "developer"}
                onChange={() => setSelectedRole("developer")}
              />
            </div>
            <p className="text-xl text-start font-medium">
              I am developer, looking to work <br /> on project
            </p>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <Button
            text={`Join as a ${
              selectedRole === "client" ? "Client" : "Developer"
            }`}
            value={200}
            link={`/signup/?selectedRole=${selectedRole}`}
          />

          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold underline underline-offset-2"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupRoleSelection;
