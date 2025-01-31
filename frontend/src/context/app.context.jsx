import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [todoslist, setTodosList] = useState([]);
  const [todosBoard, setTodosBoard] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Initialize socket connection
  const socket = io(backendURL, {
    key: import.meta.env.NODE_ENV === "production" ? import.meta.env.SSL_KEY : '',
    cert: import.meta.env.NODE_ENV === "production" ? import.meta.env.SSL_CERT : '',
    path: "/socket",
    reconnection: true,
    transports:['websocket','polling'],
    reconnectionAttempts: 5,
    withCredentials: true,
  });

  // Reusable API request function
  const fetchData = async (url, successCallback, errorMessage) => {
    try {
      const { data } = await axios.get(url, { withCredentials: true });
      if (data.success) {
        console.log("+++", data);
        successCallback(data);
      } else {
        toast.error(data.message || errorMessage);
      }
    } catch (error) {
      toast.error(error.message || errorMessage);
    }
  };

  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.post(`${backendURL}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch authentication state");
    }
  }, [backendURL]);

  const getUserData = useCallback(async () => {
    fetchData(
      `${backendURL}/api/auth/me`,
      (data) => setUserData(data),
      "Failed to fetch user data"
    );
  }, [backendURL]);

  const getTodosList = useCallback(async () => {
    fetchData(
      `${backendURL}/api/todo/list/getAll`,
      (data) => setTodosList(data.todo),
      "Failed to fetch Todo List"
    );
  }, [backendURL]);

  const getTodosBoard = useCallback(async () => {
    fetchData(
      `${backendURL}/api/todo/board/getAll`,
      (data) => setTodosBoard(data.todosByStatus),
      "Failed to fetch Todo Board"
    );
  }, [backendURL]);

  const getNotifications = useCallback(async () => {
    fetchData(
      `${backendURL}/api/notifications`,
      (data) => setNotifications(data.notifications),
      "Failed to fetch Notifications"
    );
  }, [backendURL]);

  // Handle real-time updates from the server
  useEffect(() => {
    socket.on("todosUpdated", (updatedTodos) => {
      setTodosBoard(updatedTodos);
      toast.success("Todos updated in real-time");
    });

    return () => {
      socket.disconnect();
    };
  });

  // Automatically fetch authentication state on mount
  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  const value = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    todoslist,
    setTodosList,
    getTodosList,
    todosBoard,
    getTodosBoard,
    setTodosBoard,
    notifications,
    setNotifications,
    getNotifications,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
