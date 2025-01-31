import User from "../models/user.model.js";
import Team from "../models/team.model.js";

export const getUserTeams = async (req, res) => {
  try {
    const userId = req.user._id;

    const teams = await Team.find({
      $or: [
        { teamMembers: userId },
        { admins: userId },
      ],
    }).select("teamName admins teamMembers");

    const userTeams = teams.map((team) => {
      const isAdmin = team.admins.some(
        (adminId) => adminId.toString() === userId.toString()
      );

      return {
        teamName: team.teamName,
        isAdmin,
      };
    });

    return res.status(200).json({ success: true, teams: userTeams });
  } catch (error) {
    console.error("Error in getUserTeams controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};