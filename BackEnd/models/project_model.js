import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true , unique: true },
   
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    repoLink: { type: String, required: true , unique: true },
    domain: { type: String, required: true },
    creatorname:{type:String },
    demoLink: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    tools: { type: [String], default: [] },
    thumbnail: { type: String, default: "https://placehold.co/600x400?text=Project" },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
   
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
