import TodoBoardCard from "./TodoBoardCard";

const TodoBoardColumn = ({ title, icon, todos, onTodoClick }) => {
  return (
    <section className="w-1/3 m-5">
      <h2 className="flex items-center">
        <img className="w-8 mr-1" src={icon} alt="" /> {title}
      </h2>

      {/* Map over todos and pass selected todo to onTodoClick */}
      {todos.length > 0 ? (
        todos.map((todo) => (
          <TodoBoardCard
            key={todo._id}
            title={todo.title}
            owner={todo.owner}
            due={todo.due || "No due date"}
            onTodoClick={() => onTodoClick(todo)} // Pass the entire todo object
          />
        ))
      ) : (
        <p className="text-gray-500 text-center">No todos here</p>
      )}
    </section>
  );
};

export default TodoBoardColumn;
