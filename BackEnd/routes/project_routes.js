import express from "express";
import isAuthenticated from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

import {
  addNewProject,
  getAllProjects,
  getUserProjects,
  getProjectDetails,
  updateProject,
  deleteProject,
  likeUnlikeProject,
  checkUniqueProjectTitle,
  checkUniqueProjectRepoLink,
 
  getTopTrendingProjects,
} from "../controller/project_controllers.js";

const router = express.Router();

router.route("/addproject").post(isAuthenticated, upload.single("thumbnail"), addNewProject);
router.route("/check-unique-title").post( checkUniqueProjectTitle);
router.route("/check-unique-repo").post( checkUniqueProjectRepoLink);

router.route("/all").get(isAuthenticated, getAllProjects);
router.route("/user/:id").get(isAuthenticated, getUserProjects);
router.route("/:projectId").get(isAuthenticated, getProjectDetails);

router.route("/update/:projectId").put(isAuthenticated, upload.single("thumbnail"), updateProject);
router.route("/delete/:projectId").delete(isAuthenticated, deleteProject);

router.route("/like/:projectId").post(isAuthenticated, likeUnlikeProject);


router.route("/trending").get(getTopTrendingProjects);

export default router;
