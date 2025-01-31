import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {  getUserTeams } from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.get("/get-teams", protectRoute, getUserTeams);
// TODO:
// router.get("/suggested", protectRoute, getSuggestedUsers);
// router.post("/follow/:id", protectRoute, followUnfollowUser);
// router.post("/update", protectRoute, updateUser);

export default userRoutes;