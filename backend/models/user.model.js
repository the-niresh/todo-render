import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  teams: [
    {
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      teamName: { type: String, ref: "Team" },
      isAdmin: { type: Boolean },
    },
  ],
  verifyOTP: { type: String, default: "" },
  verifyOTPExpiresAt: { type: Number, default: 0 },
  isUserVerified: { type: Boolean, default: false },
  resetOTP: { type: String, default: "" },
  resetOTPExpiryTime: { type: Number, default: 0 },
});

const User = mongoose.models.user || mongoose.model("User", userSchema);

export default User;
