import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const createNewTeam = async (req, res) => {
  const { teamName, teamMembers } = req.body;
  let { teamImg } = req.body;
  const userId = req.user._id.toString();

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!teamName) {
      return res.status(400).json({ error: "Please provide a Team name" });
    }

    if (teamMembers && teamMembers.includes(user.username)) {
      return res
        .status(400)
        .json({ error: "Admin cannot add themselves as a team member" });
    }

    if (teamImg) {
      const uploadedResponse = await cloudinary.uploader.upload(teamImg);
      teamImg = uploadedResponse.secure_url;
    }

    let userDocs = [];
    if (teamMembers && teamMembers.length > 0) {
      userDocs = await User.find({ username: { $in: teamMembers } });

      if (userDocs.length !== teamMembers.length) {
        return res
          .status(404)
          .json({ message: "One or more team members not found" });
      }
    }

    const teamMemberIds = [user._id, ...userDocs.map((user) => user._id)];

    const newTeam = new Team({
      teamName,
      teamImg,
      createdBy: user._id,
      admins: user._id,
      teamMembers: teamMemberIds,
    });

    await newTeam.save();

    // adding teamIDs to each teamMember's teams[]
    await User.updateMany(
      { _id: { $in: teamMemberIds } }, // Update all team members and the creator
      { $addToSet: { teams: { team: newTeam._id, isAdmin: false } } } // Add the team with isAdmin false
    );

    await User.updateOne(
      { _id: user._id },
      { $set: { "teams.$[team].isAdmin": true } },
      { arrayFilters: [{ "team.team": newTeam._id }] }
    );

    const populatedTeam = await Team.findById(newTeam._id)
      .select("-_id")
      .populate({ path: "admins", select: "-_id fullName" })
      .populate({ path: "createdBy", select: "-_id fullName" })
      .populate({ path: "teamMembers", select: "-_id email username fullName"
      });

    res.status(201).json({ success: true, team: populatedTeam });
  } catch (error) {
    console.error("Error in createNewTeam:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const addTeamMember = async (req, res) => {
  const { teamMembers } = req.body;
  const { teamId } = req.params;
  const userId = req.user._id.toString();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAdmin = await Team.findOne({ _id: teamId, admins: userId });
    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied: Not an Admin" });
    }

    if (!teamMembers || teamMembers.length === 0) {
      return res.status(400).json({ message: "Please provide team members to add" });
    }

    if (teamMembers.includes(user.username)) {
      return res.status(400).json({
        message: "Admin cannot add themselves as a team member",
      });
    }

    const userDocs = await User.find({ username: { $in: teamMembers } });

    if (userDocs.length !== teamMembers.length) {
      return res
        .status(404)
        .json({ message: "One or more team members not found" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Find users who are not already part of the team
    const existingMembers = team.teamMembers.map((member) => member.toString());
    const newMembers = userDocs.map((user) => user._id.toString());
    const membersToAdd = newMembers.filter(
      (id) => !existingMembers.includes(id)
    );

    if (membersToAdd.length === 0) {
      return res
        .status(400)
        .json({ message: "All provided users are already part of the team." });
    }

    await User.updateMany(
      { _id: { $in: membersToAdd } },
      { $addToSet: { teams: { team: teamId, isAdmin: false } } }
    );

    team.teamMembers.push(...membersToAdd);
    await team.save();

    const populatedTeam = await Team.findById(teamId)
      .select("-_id")
      .populate({ path: "admins", select: "-_id fullName" })
      .populate({ path: "createdBy", select: "-_id fullName" })
      .populate({
        path: "teamMembers",
        select: "-_id email username fullName",
      });

    res.status(201).json({ success: true, team: populatedTeam });
  } catch (error) {
    console.error("Error in addTeamMember:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const makeThemAdmin = async (req, res) => {};
export const makeThemUser = async (req, res) => {};
export const removeTeamMember = async (req, res) => {};
export const deleteExistingTeam = async (req, res) => {};
