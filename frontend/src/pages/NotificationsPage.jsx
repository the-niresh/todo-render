import SidePanel from "@/components/SidePanel";
import { AppContent } from "@/context/app.context";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  const { getNotifications ,notifications } = useContext(AppContent);
  const [localNotifications, setLocalNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications on page load
  useEffect(() => {
    const fetchNotifications = async () => {
      const { success, notifications: fetchedNotifications } =
        await getNotifications();
      if (success) {
        setLocalNotifications(fetchedNotifications);
        const unread = fetchedNotifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } else {
        toast.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();
  }, [getNotifications]);

  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    setLocalNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
    // Update backend for the specific notification
    // await axios.patch(`${backendURL}/notifications/${notificationId}/read`);
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setLocalNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
    // update backend for all notifications
    // await axios.patch(`${backendURL}/notifications/mark-all-read`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SidePanel />

      <div className="TodoList py-24 w-full">
        <div className="p-6">
          <div className="flex flex-row gap-x-6 mb-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <span className="bg-[#0a3279] font-bold text-white rounded-lg px-3 my-auto">
              {/* {unreadCount} */}
              {notifications.length}
            </span>
            <button
              onClick={markAllAsRead}
              className="text-[#868690] m-auto mr-0 cursor-pointer duration-200 hover:text-[#43608c]"
            >
              Mark all as read
            </button>
          </div>

          {/* Show no notifications */}
          {notifications?.length === 0 && (
            <div className="text-center p-4 font-bold">
              No notifications 🤔
            </div>
          )}

          {/* Show notifications */}
          {notifications?.map((notification) => (
            <div
              className={`border-b border-gray-700 p-4 ${
                !notification.read ? "bg-gray-100" : ""
              }`}
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
            >
              <div className="flex gap-2 items-center">
                {/* Notification Type Icons */}
                {notification.type === "follow" && (
                  <FaUser className="w-7 h-7 text-primary" />
                )}
                {notification.type === "like" && (
                  <FaHeart className="w-7 h-7 text-red-500" />
                )}

                {/* Notification Content */}
                <div>
                  <Link to={`/profile/${notification.user?.username}`}>
                    <div className="flex items-center gap-2">
                      {/* User Avatar */}
                      {/* <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              notification.user?.profileImg ||
                              "/avatar-placeholder.png"
                            }
                            alt="User Avatar"
                          />
                        </div>
                      </div> */}
                      {/* Notification Text */}
                      <div className="flex flex-col">
                        {/* <span className="font-bold">
                          @{notification.user?.username || "Unknown User"}
                        </span> */}
                        <span>
                          {notification.type === "task_updated"
                            ? "Todo Updated"
                            : notification.type === "due_date_nearing"
                            ? "due date nearing"
                            : "interacted with your todo"}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Additional Data (e.g., Todo Title) */}
                  {notification.todo && (
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.todo.title}
                    </p>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
