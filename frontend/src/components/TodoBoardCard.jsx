const TodoBoardCard = ({ title, owner, due, tags, onTodoClick }) => {
  return (
    <article className="w-full min-h-28 border border-gray-300 bg-white rounded-xl p-4 my-4 shadow-sm cursor-pointer" onClick={onTodoClick}>
      <p className="text-lg font-semibold mb-2">{title}</p>
      <p className="text-sm text-gray-600">👤 Owner: {owner || "Unknown"}</p>
      <p className="text-sm text-gray-600">📅 Due Date: {due}</p>
    </article>
  );
};

export default TodoBoardCard;
