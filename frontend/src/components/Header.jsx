import { useContext } from "react";
import { AppContent } from "../context/app.context";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {userData, backendURL} = useContext(AppContent);
  
  return (
    <div className="flex flex-col items-center mt-20 px-4 p-32 text-center text-gray-800">
      <img
        src="/header_img.png"
        alt="header_img"
        className="w-36 h-36 rounder-full mb-6"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.user.fullName : "Developer"}.!!
        <img
          src="hand_wave.png"
          alt="hand_wave"
          className="w-8 aspect-square"
        />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to Todo-Pro..!!
      </h2>
      <p className="mb-8 max-w-md">
        Organize your Todo-lists collaboratively like a Pro..!!
      </p>
      <button
        className="border border-gray-500 rounded-full px-8 pu-2.5 hover:bg-gray-100 transition-all"
        onClick={
          userData
            ? userData.user.isUserVerified
              ? () => navigate("/dashboard")
              : () => navigate("/email-verify")
            : () => navigate("/login")
        }
      >
        {userData
          ? userData.user.isUserVerified
            ? "Dashboard..!!"
            : "Verify Email"
          : "Get Started..!!"}
      </button>
    </div>
  );
}

export default Header