const express = require("express");
const protect = require("../middleware/authMiddleware");

const {createProject,getProjects, getProject, updateProject,deleteProject,addMember,getProjectMembers,removeMember} = require("../controllers/projectController");

const router = express.Router();
router.post("/", protect, createProject);
router.get("/",protect,getProjects)
router.get("/:id",protect,getProject)
router.put("/:id",protect,updateProject)
router.delete("/:id", protect, deleteProject);
router.post("/:id/members", protect, addMember);
router.get("/:id/members", protect, getProjectMembers);
router.delete("/:id/members/:userId", protect, removeMember);

module.exports = router;