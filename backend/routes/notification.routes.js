import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", protectRoute, getNotifications);
notificationRoutes.delete("/", protectRoute, deleteNotifications);

export default notificationRoutes;