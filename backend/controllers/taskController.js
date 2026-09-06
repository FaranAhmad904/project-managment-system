const Task = require("../models/taskModel");
const Project = require("../models/projectModel");


// ==========================
// CREATE TASK
// ==========================

const createTask = async (req, res) => {

    try {

        const {
            title,
            description,
            status,
            priority,
            deadline,
            project,
            assignedTo
        } = req.body;


        // ==========================
        // VALIDATION
        // ==========================

        if (!title || !deadline || !project) {

            return res.status(400).json({
                message: "Please provide title, deadline and project"
            });

        }


        // ==========================
        // CHECK PROJECT
        // ==========================

        const existingProject =
            await Project.findById(project);

        if (!existingProject) {

            return res.status(404).json({
                message: "Project not found"
            });

        }


        // ==========================
        // CHECK PROJECT ACCESS
        // ==========================

        const isOwner =
            existingProject.owner.toString() ===
            req.user._id.toString();

        const isMember =
            existingProject.members.some(
                member =>
                    member.toString() ===
                    req.user._id.toString()
            );


        if (!isOwner && !isMember) {

            return res.status(403).json({
                message: "You are not a member of this project"
            });

        }


        // ==========================
        // CREATE TASK
        // ==========================

        const task = await Task.create({

            title,

            description,

            status: status || "todo",

            priority: priority || "medium",

            deadline,

            project,

            assignedTo: assignedTo || null,

            createdBy: req.user._id

        });


        // ==========================
        // SUCCESS RESPONSE
        // ==========================

        return res.status(201).json({

            message: "TASK CREATED SUCCESSFULLY",

            task

        });

    } catch (error) {

        console.error(
            "Create Task Error:",
            error
        );

        return res.status(500).json({

            message: "Server error"

        });

    }

};


// ==========================
// GET PROJECT TASKS
// ==========================

const getProjectTasks = async (req, res) => {

    try {

        const project =
            await Project.findById(
                req.params.projectId
            );


        if (!project) {

            return res.status(404).json({

                message: "Project not found"

            });

        }


        const tasks =
            await Task.find({
                project: req.params.projectId
            })
            .populate(
                "assignedTo",
                "name email"
            )
            .populate(
                "createdBy",
                "name email"
            )
            .sort({
                createdAt: -1
            });


        res.status(200).json({

            tasks

        });


    } catch (error) {

        console.error(
            "Get Project Tasks Error:",
            error
        );

        res.status(500).json({

            message: "Server error"

        });

    }

};


// ==========================
// GET SINGLE TASK
// ==========================

const getTask = async (req, res) => {

    try {

        const task =
            await Task.findById(
                req.params.id
            )
            .populate(
                "assignedTo",
                "name email"
            )
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "project",
                "name"
            );


        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        res.status(200).json({

            task

        });


    } catch (error) {

        console.error(
            "Get Task Error:",
            error
        );

        res.status(500).json({

            message: "Server error"

        });

    }

};


// ==========================
// UPDATE TASK
// ==========================

const updateTask = async (req, res) => {

    try {

        const task =
            await Task.findById(
                req.params.id
            );


        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        const {
            title,
            description,
            status,
            priority,
            deadline,
            assignedTo
        } = req.body;


        // ==========================
        // UPDATE FIELDS
        // ==========================

        task.title =
            title !== undefined
                ? title
                : task.title;


        task.description =
            description !== undefined
                ? description
                : task.description;


        task.status =
            status !== undefined
                ? status
                : task.status;


        task.priority =
            priority !== undefined
                ? priority
                : task.priority;


        task.deadline =
            deadline !== undefined
                ? deadline
                : task.deadline;


        task.assignedTo =
            assignedTo !== undefined
                ? assignedTo
                : task.assignedTo;


        // ==========================
        // SAVE TASK
        // ==========================

        await task.save();


        // ==========================
        // SUCCESS RESPONSE
        // ==========================

        res.status(200).json({

            message: "Task updated successfully",

            task

        });


    } catch (error) {

        console.error(
            "Update Task Error:",
            error
        );

        res.status(500).json({

            message: "Server error"

        });

    }

};


// ==========================
// DELETE TASK
// ==========================

const deleteTask = async (req, res) => {

    try {

        const task =
            await Task.findById(
                req.params.id
            );


        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        // ==========================
        // DELETE TASK
        // ==========================

        await Task.findByIdAndDelete(
            req.params.id
        );


        // ==========================
        // SUCCESS RESPONSE
        // ==========================

        res.status(200).json({

            message: "Task deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete Task Error:",
            error
        );

        res.status(500).json({

            message: "Server error"

        });

    }

};


// ==========================
// EXPORT CONTROLLERS
// ==========================

module.exports = {

    createTask,

    getProjectTasks,

    getTask,

    updateTask,

    deleteTask

};