import { useContext } from "react";
import { AppContent } from "@/context/app.context";
import axios from "axios";
import toast from "react-hot-toast";

const TodoForm = ({ selectedTodo, onClose }) => {
  const { backendURL } = useContext(AppContent);

  if (!selectedTodo) return null; // donot render if no todo is selected

  const onClickDelete = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.delete(`${backendURL}/api/todo/${selectedTodo.id}`);
      if (data.success) {
        toast.success("Todo deleted successfully!");
        onClose();
      } else {
        toast.error("Failed to delete Todo");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Todo Details</h2>
        <form>
          <div><label>Title: </label><input type="text" value={selectedTodo.title} readOnly /></div>
          <div><label>Status: </label><input type="text" value={selectedTodo.status} readOnly /></div>
          <div><label>Owner: </label><input type="text" value={selectedTodo.owner} readOnly /></div>
          <div><label>Due Date: </label><input type="text" value={selectedTodo.due} readOnly /></div>
          <div><label>Description: </label><input type="text" value={selectedTodo.description} readOnly /></div>
          <div><label>Created On: </label><input type="text" value={selectedTodo.createdAt} readOnly /></div>
          <div><label>Updated On: </label><input type="text" value={selectedTodo.updatedAt} readOnly /></div>
          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClickDelete} className="mr-2 px-4 py-2 bg-red-400 hover:bg-red-500 rounded-lg">Delete</button>
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
