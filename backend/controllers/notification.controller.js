import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
	const userId = req.user._id;
  
	try {
	  // Fetch notifications for the user and populate related fields
	  const notifications = await Notification.find({ user: userId })
		.sort({ createdAt: -1 }) // Sort by the latest notifications
		.populate({
		  path: "todo",
		  select: "title description status", // Include only the necessary fields from the todo
		})
		.populate({
		  path: "user",
		  select: "fullName email", // Include the user's full name and email
		});
  
	  // If no notifications are found
	  if (!notifications.length) {
		return res.status(200).json({
		  success: true,
		  message: "No notifications found",
		  notifications: [],
		});
	  }
  
	  // Mark all notifications as read
	  await Notification.updateMany({ user: userId }, { read: true });
  
	  // Send response
	  return res.status(200).json({
		success: true,
		// message: "Notifications retrieved successfully",
		notifications,
	  });
	} catch (error) {
	  console.error("Error in getNotifications function:", error.message);
  
	  // Return an internal server error response
	  return res.status(500).json({
		// success: false,
		error: "Internal Server Error",
		// details: error.message,
	  });
	}
  };
  

export const deleteNotifications = async (req, res) => {
	try {
		const todoId = req.params.id;

		await Notification.deleteMany({ to: todoId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};