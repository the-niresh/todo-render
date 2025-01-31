import { useNavigate } from "react-router-dom";
import SidePanel from "../components/SidePanel";
import { useState, useContext } from "react";
import { AppContent } from "@/context/app.context";
import toast from "react-hot-toast";
import CreateTodoForm from "../components/CreateTodoForm";
import CreateTeamForm from "../components/CreateTeamForm";

const DashBoardPage = () => {
  const navigate = useNavigate();
  const { backendURL } = useContext(AppContent);

  const [activeForm, setActiveForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleOpenModal = () => setIsModalOpen(true);
  // const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenModal = (formType) => setActiveForm(formType);
  const handleCloseModal = () => setActiveForm(null);

  return (
    <div className="flex h-screen overflow-hidden relative">
      <SidePanel />
      {/* Main Content */}
      <div
        className={`${
          isModalOpen ? "blur-sm" : ""
        } flex flex-col items-center mt-20 px-96 p-32 text-center text-gray-800`}
      >
        <img
          src="/header_img.png"
          alt="header_img"
          className="w-36 h-36 rounder-full mb-6"
        />
        <h1 className="text-xl font-bold">Todo App</h1>
        <button
          onClick={() => handleOpenModal("todo")}
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Todo
        </button>
        <button
          onClick={() => handleOpenModal("team")}
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Team
        </button>
      </div>

      {/* create TODO */}
      {activeForm === "todo" && (
        <CreateTodoForm
          handleCloseModal={handleCloseModal}
          backendURL={backendURL}
        />
      )}

      {/* create TEAM */}
      {activeForm === "team" && (
        <CreateTeamForm
          handleCloseModal={handleCloseModal}
          backendURL={backendURL}
        />
      )}
    </div>
  );
};

export default DashBoardPage;
