import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import loginbg from "../assets/loginbg.svg";
import { isValiEmail, validateForLogin } from "../utils/emailValidation";

import { useDispatch, useSelector } from "react-redux";
import MetaData from "../components/common/MetaData";
import Loading from "../components/common/Loading";

import { AppDispatch, RootState } from "../types/reduxTypes";
import { UserLogin } from "../types/signin";
import { login } from "../redux/userSlice";

const SignIn = () => {
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const [role, _] = useState(
    JSON.parse(localStorage.getItem("selectedRole") || '""')
  );

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<UserLogin>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const saveEmail = localStorage.getItem("email");
    const savePassword = localStorage.getItem("password");
    if (saveEmail) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: saveEmail,
        password: savePassword || "",
      }));
      setRememberMe(true);
    }
  }, []);

  //For handling Input field
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const fieldError: { [key: string]: string } = {};
    if (name === "email") {
      if (!value) {
        fieldError.email = "Email is required";
      } else if (isValiEmail(value)) {
        fieldError.email = "Enter a valid email address";
      }
    } else if (name === "password" && !value) {
      fieldError.password = "Password is required";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError[name] ? fieldError[name] : "",
    }));
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  //For handling Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForLogin(formData);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await dispatch(
          login(
            formData.email,
            formData.password,
            setErrorMessage,
            navigate,
            from,
            rememberMe
          )
        );
      } catch (error: any) {
      
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setErrors(validationErrors);
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const lastVisitedPath =
        localStorage.getItem("lastVisitedPath") || "/manage-project";
      navigate(lastVisitedPath);
    }
  }, [isAuthenticated, navigate]);
  const hanldeSignInWithGoogle = () => {
    window.open(`${baseUrl}/api/v1/auth/login-with-google`);
  };

  const hanldeSigInWithGithub = () => {
    window.open(`${baseUrl}/api/v1/auth/login-with-github`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error) {
      setErrorMessage(error);
    }
  }, [location.search]);

  return (
    <div className="top-20 h-[calc(100vh-80px)]">
      <MetaData title="Login" />
      {/* Left Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto max-w-[1300px]">
        <div
          style={{
            backgroundImage: `url(https://abswebsiteassets.blob.core.windows.net/websiteimages/signupbg.png)`,
          }}
          className="h-[calc(100vh-80px)] bg-gray-100 bg-center bg-cover flex items-center justify-center"
        >
          <img src={loginbg} alt="loginbg" className="px-6" />
        </div>

        {/* Right Section */}
        <div className=" flex items-center justify-center shadow-md">
          <div className="w-3/4">
            <h1 className="text-3xl font-bold mb-5">Welcome Back</h1>
            <p
              className={`${
                errorMessage ? "" : role ? "mb-7" : ""
              }   text-base font-medium`}
            >
              Login into IntelliDev account with your credentials
            </p>

            <div className={`flex gap-4 ${errorMessage ? "my-5" : "mb-5"}`}>
              {role.length > 0 && (
                <button
                  onClick={hanldeSignInWithGoogle}
                  className={`flex items-center gap-3 bg-[#1A73E8] text-white ps-1 pe-2 py-1 rounded-full font-semibold ${
                    role === "client" ? "md:w-1/2 w-full" : "w-full"
                  }`}
                >
                  <div className="bg-[var(--secondary-color)]  rounded-full p-2">
                    <FcGoogle className="text-2xl" />
                  </div>
                  Sign In with Google
                </button>
              )}

              {role === "developer" && (
                <button
                  onClick={hanldeSigInWithGithub}
                  className="flex items-center gap-3 bg-black text-white px-4 py-1 rounded-full  font-semibold  w-full"
                >
                  <FaGithub className="text-2xl" />
                  Sign In with GitHub
                </button>
              )}
            </div>

            {role && <p className="text-center font-bold mb-7">Or</p>}

            {errorMessage && (
              <p className="text-white text-center py-1.5 bg-red-500 font-medium text-base my-3">
                {errorMessage}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              {/* Input Fields */}

              <div className="relative mb-4">
                <input
                  type="email"
                  value={formData.email}
                  name="email"
                  autoFocus
                  onChange={handleChangeInput}
                  placeholder="Email"
                  className={`w-full  ${
                    errors.email
                      ? "border-[var(--dengrous-color)] border"
                      : " border border-gray-300"
                  }  px-4 py-2 rounded-md focus:outline-none`}
                />
                <FaEnvelope className="absolute top-3 right-3 text-gray-400" />
                {errors.email && (
                  <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={handleChangeInput}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  className={`w-full  ${
                    errors.password
                      ? "border-[var(--dengrous-color)] border"
                      : " border border-gray-300"
                  }  px-4 py-2 rounded-md focus:outline-none`}
                />
                {showPassword ? (
                  <FaEye
                    onClick={() => setshowPassword(!showPassword)}
                    className="absolute top-3 right-3 text-gray-400"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => setshowPassword(!showPassword)}
                    className="absolute top-3 right-3 text-gray-400"
                  />
                )}
                {errors.password && (
                  <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between  mb-6">
                <div className="flex items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                  <span className="text-sm  font-normal">Remember me</span>
                </div>
                <Link
                  to="/forgot/password"
                  className="underline underline-offset-2"
                >
                  Forgot Password?
                </Link>{" "}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--button-bg-color)] flex items-center gap-2 justify-center w-full py-2 rounded-md mb-5 font-medium"
              >
                Log In {loading && <Loading />}
              </button>
            </form>

            <p className="text-center">
              Don’t have and account?{" "}
              <Link
                to="/signup/role-selection"
                className="font-bold underline underline-offset-2"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
