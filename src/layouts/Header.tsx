import { Link } from "react-router-dom";

import Button from "../components/common/Button";

const Header = () => {
  return (
    <div
      className={`bg-[var(--primary-color)] sticky top-0 left-0 right-0 z-50`}
    >
      <div
        className={`flex items-center justify-between h-20 px-6 max-w-[1300px] mx-auto
        }`}
      >
        <Link
          to="/"
          className="flex text-3xl  items-center justify-center gap-0"
        >
          <h2 className="text-[var(--secondary-color)] font-extrabold">
            Intelli
          </h2>
          <h2 className="text-[var(--button-bg-color)] font-medium">Dev</h2>
        </Link>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/login"
            className="border font-medium px-5 py-2 rounded-lg border-[var(--button-bg-color)] text-[var(--secondary-color)]"
          >
            Log In
          </Link>
          <Button
            text={"Sign Up"}
            value={100}
            link={"/signup/role-selection"}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
