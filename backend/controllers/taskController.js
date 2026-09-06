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

const getProjectTasks = async (req,res)=>{
    try
    {
        const project = await Project.findById(req.params.projectId);

        if(!project)
        {
            return res.status(404).json({
                message:"Project not found "
            })
        }

        const tasks = await Task.find({
            project: req.params.projectId
        }) .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

        res.status(200).json({
            tasks
        });


    }catch(error)
    {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

//get a single TASK;

const getTask = async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email")
            .populate("project", "name");

        if(!task)
        {
            return res.status(404).json({
                message:"Task not found"
            })
        }
        res.status(200).json({
            task
        })
    }catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}



//updateTASK
const updateTask = async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

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

        task.title =
            title || task.title;

        task.description =
            description ?? task.description;

        task.status =
            status || task.status;

        task.priority =
            priority || task.priority;

        task.deadline =
            deadline || task.deadline;

        task.assignedTo =
            assignedTo || task.assignedTo;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


//Delete Task

const deleteTask = async(req,res)=>{
    try
    {
        const task = await Task.findById(req.params.id);

        if(!task)
        {
            return res.status(404).json({
                message:"Task not found"
            })
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Task deleted successfully"
        });
    }catch(error)
    {
         console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}














module.exports = {
    createTask,
    getProjectTasks,
    getTask,
    updateTask,
    deleteTask
};