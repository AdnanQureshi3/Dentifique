import Project from "../models/project_model.js";
import User from "../models/user_Model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

export const addNewProject = async (req, res) => {
  console.log("Request Body:", req.body);

  try {
    const { title, description, repoLink, domain, demoLink, liveLink, tools  } = req.body;
    const thumbnail = req.file;
    const authorId = req.id;
    const toolsArray = tools ? tools.split(",") : [];
    // console.log(toolsArray);
    // return;
    // Validate
    if (!title || !description || !repoLink || !domain) {
      return res.status(400).json({ msg: "Title, Description, Repo Link and Domain are required", success: false });
    }

    // Check if repoLink is already used
    const existingRepo = await Project.findOne({ repoLink });
    if (existingRepo) {
      return res.status(400).json({ msg: "This repository link is already used in another project", success: false });
    }

    // Check if title is already used
    const existingTitle = await Project.findOne({ title });
    if (existingTitle) {
      return res.status(400).json({ msg: "A project with this title already exists", success: false });
    }
    const user  = await User.findById(authorId);

    // Default thumbnail if not provided
    let thumbnailUrl = "https://s3-ap-south-1.amazonaws.com/static.awfis.com/wp-content/uploads/2017/07/07184649/ProjectManagement.jpg";

    // If thumbnail is uploaded, process and upload it
    if (thumbnail) {
      const optimizedImageBuffer = await sharp(thumbnail.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toBuffer();

      const fileuri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
      const cloudResponse = await cloudinary.uploader.upload(fileuri);
      thumbnailUrl = cloudResponse.secure_url;
    }

    // Create the project
    const project = await Project.create({
      title,
      description,
      repoLink,
      domain,
      creatorname:user?.username || "",
      demoLink: demoLink || "",
      liveLink: liveLink || "",
      tools:toolsArray,
      createdBy: authorId,

      thumbnail: thumbnailUrl,
    });

    // Link project to user
    
    user?.projects?.push(project._id);
    await user.save();

    // Populate and send response
    await project.populate({ path: "createdBy", select: "-password" });
    res.status(201).json({ msg: "Project created successfully", project, success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong", success: false });
  }
};

export const checkUniqueProjectTitle = async (req, res) => {
  try {
    console.log("Checking unique title:", req.body);
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ msg: "Project title is required", success: false });
    }
    const existingProject = await Project.findOne({ title });
    if (existingProject) {
      return res.status(200).json({ msg: "Project title already exists", success: false });
    }
    else return res.status(200).json({ msg: "Project title is unique", success: true });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", success: false });
  }
};
export const checkUniqueProjectRepoLink = async (req, res) => {
  try {
    // console.log("Checking unique title:", req.body);
    const { repoLink } = req.body;
    if (!repoLink) {
      return res.status(400).json({ msg: "Project repository link is required", success: false });
    }
    const existingProject = await Project.findOne({ repoLink });
    if (existingProject) {
      return res.status(200).json({ msg: "Project repository link already exists", success: false });
    }
    else return res.status(200).json({ msg: "Project repository link is unique", success: true });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", success: false });
  }
};

// Get All Projects
export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 5,  title } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const filter = {};
if (title) filter.title = { $regex: title, $options: "i" };
if (title) filter.domain = { $regex: title, $options: "i" };
if (title) filter.creatorname = { $regex: title, $options: "i" };

   
    const total = await Project.countDocuments(filter); // total number of projects

    const projects = await Project.find(filter)
      .populate("createdBy", "username _id")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
      

      console.log(projects);

    res.status(200).json({
      projects,
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch projects", success: false });
  }
};


// Get User Projects
export const getUserProjects = async (req, res) => {
  try {
    const userId = req.params.id;
    const projects = await Project.find({ createdBy: userId }).populate("createdBy", "-password");
    res.status(200).json({ projects, success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch user projects", success: false });
  }
};

// Get Project Details
export const getProjectDetails = async (req, res) => {
    try {
      console.log("we  are fetching" , req.params.projectname);
    const project = await Project.findOne({
  title: { $regex: `^${req.params.projectname}$`, $options: "i" }
})
    .populate("createdBy", "username _id profilePicture ")
    if (!project) return res.status(404).json({ msg: "Project not found", success: false });
    console.log(project , "its my projects")
        
   return res.status(200).json({ project, success: true });
  } catch (err) {
   return res.status(500).json({ msg: "Failed to fetch project", success: false });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const { title, description, repoLink, domain, demoLink, liveLink, tools } = req.body;
    const thumbnail = req.file;

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ msg: "Project not found", success: false });

    if (title) project.title = title;
    if (description) project.description = description;
    if (repoLink) project.repoLink = repoLink;
    if (domain) project.domain = domain;
    if (demoLink) project.demoLink = demoLink;
    if (liveLink) project.LiveLink = liveLink;
    if (tools) project.Tools = tools.split(",");

    if (thumbnail) {
      const optimizedImageBuffer = await sharp(thumbnail.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toBuffer();

      const fileuri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
      const cloudResponse = await cloudinary.uploader.upload(fileuri);
      project.thumbnail = cloudResponse.secure_url;
    }

    await project.save();
    res.status(200).json({ msg: "Project updated", project, success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update project", success: false });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ msg: "Project not found", success: false });

    await Project.findByIdAndDelete(req.params.projectId);

    const user = await User.findById(project.createdBy);
    user.projects = user.projects.filter(p => p.toString() !== req.params.projectId);
    await user.save();

    res.status(200).json({ msg: "Project deleted", success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete project", success: false });
  }
};

// Like / Unlike Project
export const likeUnlikeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ msg: "Project not found", success: false });

    if (project.likes.includes(req.id)) {
      project.likes = project.likes.filter(id => id.toString() !== req.id);
    } else {
      project.likes.push(req.id);
    }

    await project.save();
    res.status(200).json({ msg: "Toggled like", success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to like/unlike project", success: false });
  }
};

// Save Project
export const saveProject = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) return res.status(404).json({ msg: "User not found", success: false });

    if (user.savedProjects.includes(req.params.projectId)) {
      user.savedProjects = user.savedProjects.filter(p => p.toString() !== req.params.projectId);
    } else {
      user.savedProjects.push(req.params.projectId);
    }

    await user.save();
    res.status(200).json({ msg: "Toggled save", success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to save project", success: false });
  }
};



// Get Top Trending Projects
export const getTopTrendingProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ likes: -1 }).limit(3).populate("createdBy", "-password");
    res.status(200).json({ projects, success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch trending projects", success: false });
  }
};
