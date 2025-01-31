import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  PaginationModule,
  ValidationModule,
  createGrid,
  ClientSideRowModelModule,
} from "ag-grid-community";

import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";

import { useState, useEffect, useContext, backendURL } from "react";
import { AppContent } from "../context/app.context";
import SidePanel from "../components/SidePanel";
import TodoForm from "@/components/TodoForm";
import CreateTodoForm from "@/components/CreateTodoForm";
import CreateTeamForm from "@/components/CreateTeamForm";

ModuleRegistry.registerModules([
  PaginationModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  ValidationModule,
  ClientSideRowModelModule
]);

const TodoList = () => {
  const { getTodosList, todoslist } = useContext(AppContent);
  const [rowData, setRowData] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const [colDefs] = useState([
    { field: "title", headerName: "Title", sortable: true, filter: true },
    { field: "status", headerName: "Status", sortable: true, filter: true },
    { field: "due", headerName: "Due Date", sortable: true, filter: true },
    { field: "owner", headerName: "Owner", sortable: true, filter: true },
    { field: "createdAt", headerName: "Created on", sortable: true, filter: true },
    { field: "updatedAt", headerName: "Updated on", sortable: true, filter: true },
    { field: "description", headerName: "Description" },
  ]);

  useEffect(() => {
    getTodosList();
  }, [getTodosList]);

  useEffect(() => {
    setRowData(
      todoslist.map((todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt).toLocaleString(),
        updatedAt: new Date(todo.updatedAt).toLocaleString(),
      }))
    );
  }, [todoslist]);

  const [activeForm, setActiveForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (formType) => setActiveForm(formType);
  const handleCloseModal = () => setActiveForm(null);

  return (
    <div className="flex h-[90%] overflow-hidden">
      <SidePanel />
      <div className="py-24 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl p-3">TodoList..!!</h1>

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

        <div
          className="ag-theme-alpine p-2"
          style={{ height: "80%", width: "95%" }}
        >
          <AgGridReact
            domLayout="autoHeight"
            rowData={rowData}
            columnDefs={colDefs}
            animateRows={true}
            defaultColDef={{
              resizable: true,
              cellStyle: { padding: "20px" },
            }}
            rowStyle={{
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onRowClicked={(event) => setSelectedTodo(event.data)}
            pagination={true}
            paginationPageSize={20}
            suppressPaginationPanel={false}
          />
        </div>
      </div>

      {/* TodoForm */}
      {selectedTodo && (
        <TodoForm
          selectedTodo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
        />
      )}

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

export default TodoList;
