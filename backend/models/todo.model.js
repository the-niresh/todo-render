import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    status: { type: String,required: true, enum: ["Todo", "In_progress", "Done"]},
    due: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
