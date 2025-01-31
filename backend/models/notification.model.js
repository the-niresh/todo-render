import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		todo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Todo",
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		title: {
			type: String,
			ref: "Todo",
			required: true,
		},
		due: {
			type: Date,
			ref: "Todo"
		},
		type: {
			type: String,
			required: true,
			enum: ["task_updated", "due_date_nearing"],
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;