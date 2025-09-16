import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true , unique: true },
   
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    repoLink: { type: String, required: true , unique: true },
    domain: { type: String, required: true },

    demoLink: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    tools: { type: [String], default: [] },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    thumbnail: { type: String, default: "https://placehold.co/600x400?text=Project" },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
