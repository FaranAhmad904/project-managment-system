const Project = require("../models/projectModel");


//CREATEPROJECT

const createProject = async(req,res)=>{

    try{

        const{
             name,
            description,
            startDate,
            deadline,
            priority
        }=req.body

        if(!name || !startDate || !deadline)
        {
            res.status(404).json({
                message:"please provide information that is required add properly"
            })
        }

        const project = await Project.create({
             name,
            description,
            startDate,
            deadline,
            priority,
            owner: req.user._id
        });

        res.status(201).json({
            message:"User created Suceessfully",
            project
        });
    }
    catch(error)
    {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}


//GET ALL PROJECT

const getProjects = async(req,res)=>{
    try{
        const projects = await Project.find({
             $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        });

        res.status(200).json({
            projects
        })
    }
    catch(error)
    {
        console.error(error)
    }
}

//get one project
const getProject = async (req,res)=>{

    try{
        const project = await Project.findById(req.params.id)
        if(!project)
        {
            return res.status(404).json({
                message:"Project not found"
            })
        }
        res.status(200).json({
            project
        })

    }catch(error)
    {
        console.error(error);
        res.status(500).json({
            message:"Server no found project"
        })
    }
}

//updateProject

const updateProject = async (req,res)=>{

    try{
        const {
            name,
            description,
            startDate,
            deadline,
            priority,
            status
        } = req.body;

        const project = await Project.findById(req.params.id);

        if(!project)
        {
            return res.status(404).json({
                message:"project not found"
            })
        }


        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to update this project"
            });
        }

         project.name = name || project.name;
        project.description = description || project.description;
        project.startDate = startDate || project.startDate;
        project.deadline = deadline || project.deadline;
        project.priority = priority || project.priority;
        project.status = status || project.status;

        await project.save();

        res.status(200).json({
            message:"Project updated successfully",
            project
        })
    }catch(error)
    {
        console.log(error);
    }
}

//deleteProject

const deleteProject = async (req,res)=>{
    try{
        const project = await Project.findById(req.params.id)
        if(!project)
        {
           return res.status(404).json({
            message:"Project ot found"
           })
        }

         // Check project ownership
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to delete this project"
            });
        }
        await Project.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            message: "Project deleted successfully"
        });
    }catch(error)
    {
        console.error(error);
        res.status(500).json({
            message:"server error"
        })
    }
}


//addmemeber
// ==========================
// ADD PROJECT MEMBER
// ==========================

const addMember = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "Please provide user ID"
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only project owner can add members
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only the project owner can add members"
            });
        }

        // Check if user is already a member
        if (project.members.includes(userId)) {
            return res.status(400).json({
                message: "User is already a member"
            });
        }

        project.members.push(userId);

        await project.save();

        res.status(200).json({
            message: "Member added successfully",
            project
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

//getmemebers

const getProjectMembers = async (req,res)=>{

    try
    {
        const project = await Project.findById(req.params.id)
        .populate("owner", "name email role")
        .populate("members", "name email role");

        if(!project)
        {
            res.status(404).json({
                message:"Project doesnt exist"
            })
        }
        res.status(200).json({
             owner: project.owner,
            members: project.members
        })
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}
//remove
const removeMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only project owner can remove members
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only the project owner can remove members"
            });
        }

        const memberExists = project.members.some(
            member => member.toString() === req.params.userId
        );

        if (!memberExists) {
            return res.status(404).json({
                message: "Member not found in this project"
            });
        }

        project.members = project.members.filter(
            member => member.toString() !== req.params.userId
        );

        await project.save();

        res.status(200).json({
            message: "Member removed successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    addMember,
    getProjectMembers,
    removeMember


};