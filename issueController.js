const Issue = require('../models/Issue');
const Department = require('../models/Department');

// @desc    Create new issue (FROM FRONTEND)
// @route   POST /api/issues
// @access  Private
exports.createIssue = async (req, res) => {
    try {
        // Add user to req.body
        req.body.reportedBy = req.user.id;

        // Handle file uploads
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                filename: file.filename
            }));
        }

        // Auto-assign to department based on category
        const department = await Department.findOne({ 
            categories: req.body.category 
        });
        
        if (department) {
            req.body.assignedTo = department._id;
        }

        const issue = await Issue.create(req.body);

        // Populate the response
        const populatedIssue = await Issue.findById(issue._id)
            .populate('reportedBy', 'name email phone')
            .populate('assignedTo', 'name code');

        res.status(201).json({
            success: true,
            message: 'Issue reported successfully',
            data: populatedIssue
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all issues (FOR FRONTEND)
// @route   GET /api/issues
// @access  Public
exports.getIssues = async (req, res) => {
    try {
        const { category, status, page = 1, limit = 10 } = req.query;
        
        // Build filter object
        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;

        const issues = await Issue.find(filter)
            .populate('reportedBy', 'name')
            .populate('assignedTo', 'name code')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Issue.countDocuments(filter);

        res.json({
            success: true,
            count: issues.length,
            total,
            pages: Math.ceil(total / limit),
            data: issues
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
exports.getIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('reportedBy', 'name email phone')
            .populate('assignedTo', 'name code')
            .populate('updates.updatedBy', 'name role');

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        res.json({
            success: true,
            data: issue
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id
// @access  Private
exports.updateIssue = async (req, res) => {
    try {
        let issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        // Add update to history
        if (req.body.status) {
            req.body.updates = [
                ...issue.updates,
                {
                    status: req.body.status,
                    description: req.body.updateDescription || `Status changed to ${req.body.status}`,
                    updatedBy: req.user.id
                }
            ];
        }

        issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('reportedBy', 'name email phone')
          .populate('assignedTo', 'name code');

        res.json({
            success: true,
            message: 'Issue updated successfully',
            data: issue
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};