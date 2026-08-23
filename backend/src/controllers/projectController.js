const mongoose = require("mongoose");

const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      areaOfInterest,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required.",
      });
    }

    const project = await Project.create({
      owner: req.user._id,
      name: name.trim(),
      description:
        description?.trim() || "",
      location:
        location?.trim() || "",
      areaOfInterest:
        areaOfInterest?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error(
      "Create project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create project.",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error(
      "Get projects error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch projects.",
    });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const project = await Project.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(
      "Get project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch project.",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const {
      name,
      description,
      location,
      areaOfInterest,
      status,
    } = req.body;

    const project = await Project.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Project name cannot be empty.",
        });
      }

      project.name = name.trim();
    }

    if (description !== undefined) {
      project.description =
        description.trim();
    }

    if (location !== undefined) {
      project.location =
        location.trim();
    }

    if (areaOfInterest !== undefined) {
      project.areaOfInterest =
        areaOfInterest.trim();
    }

    if (status !== undefined) {
      if (
        !["active", "archived"].includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project status.",
        });
      }

      project.status = status;
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error(
      "Update project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update project.",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const project =
      await Project.findOneAndDelete({
        _id: id,
        owner: req.user._id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete project.",
    });
  }
};

const getProjectStats = async (req, res) => {
  try {
    const owner = req.user._id;

    const [
      total,
      active,
      archived,
    ] = await Promise.all([
      Project.countDocuments({ owner }),
      Project.countDocuments({
        owner,
        status: "active",
      }),
      Project.countDocuments({
        owner,
        status: "archived",
      }),
    ]);

    const recentProjects =
      await Project.find({
        owner,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "name location status createdAt updatedAt"
        );

    return res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        archived,
      },
      recentProjects,
    });
  } catch (error) {
    console.error(
      "Project stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch project statistics.",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectStats,
};