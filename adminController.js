const Issue = require('../models/Issue');
const User = require('../models/User');
const Department = require('../models/Department');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        const totalIssues = await Issue.countDocuments();
        const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
        const inProgressIssues = await Issue.countDocuments({ status: 'in_progress' });
        const highPriorityIssues = await Issue.countDocuments({ priority: 'high' });

        // Issues by category
        const issuesByCategory = await Issue.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Issues by status
        const issuesByStatus = await Issue.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Monthly issues trend
        const monthlyTrend = await Issue.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 6 }
        ]);

        res.json({
            success: true,
            data: {
                totalIssues,
                resolvedIssues,
                inProgressIssues,
                highPriorityIssues,
                issuesByCategory,
                issuesByStatus,
                monthlyTrend
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get department performance metrics
// @route   GET /api/admin/department-metrics
// @access  Private/Admin
exports.getDepartmentMetrics = async (req, res) => {
    try {
        const metrics = await Department.aggregate([
            {
                $lookup: {
                    from: 'issues',
                    localField: '_id',
                    foreignField: 'assignedTo',
                    as: 'assignedIssues'
                }
            },
            {
                $project: {
                    name: 1,
                    code: 1,
                    totalIssues: { $size: '$assignedIssues' },
                    resolvedIssues: {
                        $size: {
                            $filter: {
                                input: '$assignedIssues',
                                as: 'issue',
                                cond: { $eq: ['$$issue.status', 'resolved'] }
                            }
                        }
                    },
                    avgResolutionTime: {
                        $avg: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$assignedIssues',
                                        as: 'issue',
                                        cond: { $eq: ['$$issue.status', 'resolved'] }
                                    }
                                },
                                as: 'issue',
                                in: {
                                    $divide: [
                                        { $subtract: ['$$issue.actualResolutionTime', '$$issue.createdAt'] },
                                        1000 * 60 * 60 * 24 // Convert to days
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};