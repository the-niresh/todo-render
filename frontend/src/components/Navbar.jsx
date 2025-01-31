import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcTodoList } from "react-icons/fc";
import { useState, useEffect, useContext } from "react";
import { AppContent } from "../context/app.context";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

const Navbar = () => {

  const { userData, backendURL } = useContext(AppContent);
  console.log("userData", userData);
  
  const [selectedTeam, setSelectedTeam] = useState("Teams");
  const [isTeamAdmin, setIsTeamAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle team selection
  const handleTeamSelection = (teamName) => {
    setSelectedTeam(teamName);

    // check if the user is an admin of the selected team
    const selectedTeamObj = userData?.user?.teams?.find(
      (teamObj) => teamObj.team.teamName === teamName
    );

    if (selectedTeamObj) {
      setIsTeamAdmin(selectedTeamObj.team.admins.includes(userData.user._id));
    } else {
      setIsTeamAdmin(false); // by default == false
    }
  };

  // Logout function
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + "/api/auth/logout");
      if (data.success) {
        setSelectedTeam("Teams");
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  return (
    <header className="w-full flex justify-between p-4 border border-black sm:px-24 top-0 sm:p-6 absolute z-50">
      <div className="flex items-center gap-2">
        <Link to="/">
          <FcTodoList className="size-10" />
        </Link>
        <Link to="/">
          <h1 className="text-2xl font-bold">Todo-Pro..!!</h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark/light mode toggle */}
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            className="theme-controller"
            onChange={handleToggle}
            checked={theme === "light" ? false : true}
            value="synthwave"
          />
          <svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          <svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
        {userData ? (
          <div className="flex items-center gap-2">
            {/* team dropdown */}
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button" className="btn m-1">
                {selectedTeam}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                {userData?.user?.teams?.length > 0 ? (
                  userData.user.teams.map((teamObj, index) => (
                    <li
                      key={index}
                      onClick={() => handleTeamSelection(teamObj.team.teamName)}
                    >
                      <a>{teamObj.team.teamName}</a>
                    </li>
                  ))
                ) : (
                  <li onClick={() => handleTeamSelection("Personal")}>
                    <a>Personal</a>
                  </li>
                )}
              </ul>
            </div>
            <p className="text-l">
              {selectedTeam === "Teams" ? " " : isTeamAdmin ? "Admin" : "User"}
            </p>
            <div className="flex items-center justify-center" tabIndex={0} role="button"
            // onClick={navigate("/dashboard")}
            >
              <AiOutlineUsergroupAdd className="h-8 w-8" />
            </div>
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button">
                <img src="/avatar1.png" alt="user" className="h-8 w-8" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li onClick={logout}>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          // <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-4 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
            onClick={() => navigate("/login")}
          >
            Login..!!
          </button>
          // </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
