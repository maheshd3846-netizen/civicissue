const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the issue'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: String,
        required: true,
        enum: ['pothole', 'streetlight', 'trash', 'water', 'sewage', 'road_damage', 'other']
    },
    location: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        ward: String,
        pincode: String
    },
    images: [{
        url: String,
        filename: String
    }],
    reportedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['reported', 'acknowledged', 'in_progress', 'resolved', 'closed'],
        default: 'reported'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department'
    },
    assignedStaff: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    estimatedResolutionTime: Date,
    actualResolutionTime: Date,
    updates: [{
        status: String,
        description: String,
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    citizenFeedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: Date
    }
}, {
    timestamps: true
});

// Index for geospatial queries
issueSchema.index({ 'location.coordinates': '2dsphere' });

// Index for status and category filters
issueSchema.index({ status: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('Issue', issueSchema);