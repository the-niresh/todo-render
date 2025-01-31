import SidePanel from "@/components/SidePanel";
import TodoBoardColumn from "@/components/TodoBoardColumn";
import { useContext, useEffect, useState } from "react";
import todoIcon from "../../public/direct-hit.png";
import doingIcon from "../../public/glowing-star.png";
import doneIcon from "../../public/check-mark-button.png";
import { AppContent } from "@/context/app.context";
import TodoForm from "@/components/TodoForm";
import CreateTodoForm from "@/components/CreateTodoForm";
import CreateTeamForm from "@/components/CreateTeamForm";

const TodoBoard = () => {
  const { todosBoard, getTodosBoard, backendURL } = useContext(AppContent);
  const [columnData, setColumnData] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const [activeForm, setActiveForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (formType) => setActiveForm(formType);
  const handleCloseModal = () => setActiveForm(null);

  useEffect(() => {
    getTodosBoard();
  }, [getTodosBoard]);

  useEffect(() => {
    setColumnData(Object.keys(todosBoard).map(status => ({ status, todos: todosBoard[status] })));
  }, [todosBoard]);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidePanel />
      <div className="py-24 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl p-3">Todo Board..!!</h1>
        <div className="flex space-x-4">
            <button
              onClick={() => handleOpenModal("todo")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Todo
            </button>
            <button
              onClick={() => handleOpenModal("team")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Team
            </button>
          </div>
        </div>
        <main className="flex justify-evenly">
          <TodoBoardColumn title="Todo" icon={todoIcon} todos={columnData[0]?.todos || []} onTodoClick={setSelectedTodo} />
          <TodoBoardColumn title="In-progress" icon={doingIcon} todos={columnData[1]?.todos || []} onTodoClick={setSelectedTodo} />
          <TodoBoardColumn title="Done" icon={doneIcon} todos={columnData[2]?.todos || []} onTodoClick={setSelectedTodo} />
        </main>
      </div>

      {/* TodoForm */}
      {selectedTodo && <TodoForm selectedTodo={selectedTodo} onClose={() => setSelectedTodo(null)} />}

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

export default TodoBoard;
