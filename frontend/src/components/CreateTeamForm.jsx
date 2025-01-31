import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateTeamForm = ({ handleCloseModal, backendURL }) => {
  const [teamData, setTeamData] = useState({
    teamName: "",
    teamImg: "",
    users: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "users") {
      setTeamData((prev) => ({
        ...prev,
        [name]: value.split(","),
      }));
    } else {
      setTeamData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateTEAM = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      console.log("teamData",teamData)
      const { data } = await axios.post(backendURL + "/api/team/create", teamData);
      if (data.success) {
        toast.success("Team created successfully!");
        setTeamData({ teamName: "", teamImg: "", users: [] });
        handleCloseModal();
      }
    } catch (error) {
      toast.error("Failed to create Team");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Create Team</h2>
        <form onSubmit={handleCreateTEAM}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Team Name</label>
            <input
              type="text"
              name="teamName"
              required
              value={teamData.teamName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Team Image URL</label>
            <input
              type="text"
              name="teamImg"
              value={teamData.teamImg}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team image URL"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Add Users (separated usernames)</label>
            <input
              type="text"
              name="users"
              value={teamData.users.join(",")}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user emails"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCloseModal}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamForm;
