import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { addTeamMember, createNewTeam, deleteExistingTeam, makeThemAdmin, makeThemUser, removeTeamMember } from "../controllers/team.controller.js";

const teamRoutes = express.Router();

teamRoutes.post("/create", protectRoute, createNewTeam);
teamRoutes.post("/:teamId/add-member", protectRoute, addTeamMember);
// teamRoutes.post("/", protectRoute, makeThemAdmin);
// teamRoutes.post("/", protectRoute, makeThemUser);
// teamRoutes.delete("/:teamID/:userId", protectRoute, removeTeamMember);
// teamRoutes.delete("/:teamID", protectRoute, deleteExistingTeam);

export default teamRoutes;