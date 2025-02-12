import { useEffect } from "react";
import MetaData from "../components/common/MetaData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../types/reduxTypes";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/manage-project");
    }
  }, [isAuthenticated]);

  return (
    <div className=" flex  items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black relative">
      {/* Grid Overlay */}
      <MetaData title="Here Section" />
      <div className="top-20 h-[calc(100vh-80px)] mt-36">
        <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-10">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="border border-gray-700" />
          ))}
        </div>

        {/* Main Content */}
        <div className="text-center relative z-10">
          <h1 className="text-6xl font-bold text-[var(--button-bg-color)] leading-tight">
            Connect Everything. <br /> Build anything
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Netlify is the essential platform for the delivery of exceptional
            and <br />
            dynamic web experiences, without limitations.
          </p>
          <button className="mt-8 border text-base border-[var(--button-bg-color)] text-[var(--button-bg-color)] px-6 py-3 bg-[var(--primary-color)] rounded-lg  transition duration-300">
            Request Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
