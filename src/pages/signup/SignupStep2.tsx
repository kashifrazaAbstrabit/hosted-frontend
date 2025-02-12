import React, { useEffect, useState } from "react";
import { FaGithub, FaUser, FaEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { getNames } from "country-list";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import signupbg from "../../assets/signupbg.svg";
import { isValiEmail, validateForRegister } from "../../utils/emailValidation";
import { toast } from "react-toastify";

import { register } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../types/reduxTypes";
import MetaData from "../../components/common/MetaData";
import Loading from "../../components/common/Loading";
import { DataBody, UserRegister } from "../../types/signup";

const SignupStep2 = () => {
  const countries = getNames();
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedRole = queryParams.get("selectedRole") || ("client" as string);
  const invitationToken = queryParams.get("token");
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState<UserRegister>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    country: "",
    isAgreeToTermsAndPrivacy: false,
  });

  //For handling Input field
  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    const fieldError: { [key: string]: string } = {};
    if (name === "email") {
      if (!value) {
        fieldError.email = "Email is required";
      } else if (isValiEmail(value)) {
        fieldError.email = "Enter a valid email address";
      }
    } else if (name === "first_name" && !value) {
      fieldError.first_name = "First Name is required";
    } else if (name === "last_name" && !value) {
      fieldError.last_name = "Last Name is required";
    } else if (name === "password" && !value) {
      fieldError.password = "Password is required";
    } else if (name === "country" && !value) {
      fieldError.country = "Country is required";
    } else if (name === "isAgreeToTermsAndPrivacy" && !value) {
      fieldError.country = "You must agree to the terms and privacy policy";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError[name] ? fieldError[name] : "",
    }));
  };
  const [loading, setLoading] = useState(false);

  //For handling Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: DataBody = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      country: formData.country,
      user_type: selectedRole || "client",
      auth_type: "email",
      invitationToken: invitationToken ?? undefined,
    };

    const validationErrors = validateForRegister(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        await dispatch(
          register(data, setErrorMessage, setSuccessErrorMessage, selectedRole)
        );
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/manage-project");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        country: "",
        isAgreeToTermsAndPrivacy: false,
      });
    }
  }, [isAuthenticated, navigate]);

  const hanldeSignupWithGoogle = () => {
    window.location.href = `${baseUrl}/api/v1/auth/signup-with-google?user_type=${selectedRole}&invite_token=${invitationToken}`;
    localStorage.setItem("selectedRole", JSON.stringify(selectedRole));
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password");
    localStorage.removeItem("activeSidebar");
    localStorage.removeItem("lastVisitedPath");
    localStorage.removeItem("selectedProject");
  };

  const hanldeSiguporInWithGithub = () => {
    window.location.href = `${baseUrl}/api/v1/auth/signup-with-github?invite_token=${invitationToken}`;
    localStorage.setItem("selectedRole", JSON.stringify(selectedRole));
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password");
    localStorage.removeItem("activeSidebar");
    localStorage.removeItem("lastVisitedPath");
    localStorage.removeItem("selectedProject");
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error) {
      setErrorMessage(error);
      navigate(
        `/signup/?selectedRole=${JSON.parse(
          localStorage.getItem("selectedRole") || '"'
        )}`
      );
    }

    if (successMessage) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        country: "",
        isAgreeToTermsAndPrivacy: false,
      });
    }
  }, [location.search, successMessage]);

  return (
    <div className="top-20 h-[calc(100vh-80px)] ">
      <MetaData title="Sign Up" />

      {/* Left Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto max-w-[1300px]">
        <div
          style={{
            backgroundImage: `url(https://abswebsiteassets.blob.core.windows.net/websiteimages/signupbg.png)`,
          }}
          className="h-[calc(100vh-80px)] bg-gray-100 bg-center bg-cover flex items-center justify-center"
        >
          <img src={signupbg} alt="signupbg" className="px-6" />
        </div>

        {/* Right Section */}
        <div className=" flex items-center justify-center shadow-md">
          <div className="w-3/4">
            <h1 className="text-3xl font-bold mb-5">Get Started</h1>
            <p className="mb-7 text-base font-medium">
              Create your IntelliDev account
            </p>

            {/* Social Buttons */}
            <div className="md:flex-row flex flex-col gap-4 mb-5">
              <button
                onClick={hanldeSignupWithGoogle}
                className={`flex items-center gap-3 bg-[#1A73E8] text-white ps-1 pe-2 py-1 rounded-full font-semibold ${
                  selectedRole === "client" ? "md:w-1/2 w-full" : "w-full"
                }`}
              >
                <div className="bg-[var(--secondary-color)]  rounded-full p-2">
                  <FcGoogle className="text-2xl" />
                </div>
                Sign up with Google
              </button>

              {selectedRole === "developer" && (
                <button
                  onClick={hanldeSiguporInWithGithub}
                  className="flex items-center gap-3 bg-black text-white ps-1 md:py-1 py-3.5 rounded-full  font-semibold  w-full"
                >
                  <FaGithub className="text-4xl p-0.5" />
                  Sign up with GitHub
                </button>
              )}
            </div>

            <p className="text-center font-bold mb-7">Or</p>

            {errorMessage && (
              <p className="text-white text-center py-1.5 bg-red-700 font-medium text-base my-3">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="text-white text-center py-1.5 bg-green-700 font-medium text-base my-3">
                {successMessage}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              {/* Input Fields */}
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={handleChangeInput}
                    name="first_name"
                    autoFocus
                    placeholder="First Name"
                    className={`w-full  ${
                      errors.first_name
                        ? "border-[var(--dengrous-color)] border"
                        : " border border-gray-300"
                    }  px-4 py-2 rounded-md focus:outline-none`}
                  />
                  <FaUser className="absolute top-3 right-3 text-gray-400" />
                  {errors.first_name && (
                    <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                      {errors.first_name}
                    </p>
                  )}
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={handleChangeInput}
                    name="last_name"
                    placeholder="Last Name"
                    className={`w-full  ${
                      errors.last_name
                        ? "border-[var(--dengrous-color)] border"
                        : "border border-gray-300"
                    }  px-4 py-2 rounded-md focus:outline-none`}
                  />
                  <FaUser className="absolute top-3 right-3 text-gray-400" />
                  {errors.last_name && (
                    <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative mb-4">
                <input
                  type="email"
                  value={formData.email}
                  name="email"
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

              <div className="relative mb-6">
                <select
                  value={formData.country}
                  name="country"
                  onChange={handleChangeInput}
                  className={`w-full  ${
                    errors.country
                      ? "border-[var(--dengrous-color)] border"
                      : " border border-gray-300"
                  }  px-4  py-2 rounded-md focus:outline-none`}
                >
                  <option disabled value="">
                    Select Country
                  </option>
                  {countries.map((c, index) => (
                    <option key={index} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                    {errors.country}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div
                className={`flex items-center gap-3  ${
                  !errors.isAgreeToTermsAndPrivacy ? "mb-5" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.isAgreeToTermsAndPrivacy}
                  name="isAgreeToTermsAndPrivacy"
                  onChange={handleChangeInput}
                  className="w-5 h-5"
                />
                <p>
                  I agree to the{" "}
                  <Link to="#" className="underline underline-offset-2">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="underline underline-offset-2">
                    privacy policy
                  </Link>
                </p>
              </div>
              {errors.isAgreeToTermsAndPrivacy && (
                <p className="text-[var(--dengrous-color)] mb-3 text-base">
                  {errors.isAgreeToTermsAndPrivacy}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[var(--button-bg-color)] flex items-center justify-center gpa-2 w-full  py-2 rounded-md mb-5"
              >
                Get Started {loading && <Loading />}
              </button>
            </form>

            <p className="text-center">
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
    </div>
  );
};

export default SignupStep2;
