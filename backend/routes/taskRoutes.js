const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createTask,
    getProjectTasks,
    getTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const router = express.Router();


// ==========================
// CREATE TASK
// ==========================

router.post("/", protect, createTask);


// ==========================
// GET TASKS OF PROJECT
// ==========================

router.get(
    "/project/:projectId",
    protect,
    getProjectTasks
);


// ==========================
// GET SINGLE TASK
// ==========================

router.get(
    "/:id",
    protect,
    getTask
);


// ==========================
// UPDATE TASK
// ==========================

router.put(
    "/:id",
    protect,
    updateTask
);


// ==========================
// DELETE TASK
// ==========================

router.delete(
    "/:id",
    protect,
    deleteTask
);


module.exports = router;