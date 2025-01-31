import SidePanel from "@/components/SidePanel";
import { AppContent } from "@/context/app.context";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData?.user?.fullName || "",
    email: userData?.user?.email || "",
    username: userData?.user?.username || "",
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <SidePanel />
      <div className="TodoList py-24 w-full">
        <div className="p-6">
          <div className="flex flex-row gap-x-6 mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>

          {!isEditing ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="mb-2 text-lg font-medium">Full Name: {userData?.user?.fullName}</p>
              <p className="mb-2 text-lg font-medium">Email: {userData?.user?.email}</p>
              <p className="mb-2 text-lg font-medium">Username: {userData?.user?.username}</p>
              <p className="mb-2 text-lg font-medium">Teams:</p>
              <ul className="list-disc pl-6">
                {userData?.user?.teams?.map((team, index) => (
                  <li key={index}>{team.team.teamName}</li>
                ))}
              </ul>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleEditToggle}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/reset-password")}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                >
                  Reset Password
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;