const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a department name'],
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    description: String,
    categories: [{
        type: String,
        enum: ['pothole', 'streetlight', 'trash', 'water', 'sewage', 'road_damage', 'other']
    }],
    contact: {
        email: String,
        phone: String,
        address: String
    },
    head: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);