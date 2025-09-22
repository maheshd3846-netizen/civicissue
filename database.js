const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use a default MongoDB URI if not specified in environment
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb+srv://maheshd-2005:RadhaKrishna143@cluster0.medyx5j.mongodb.net/civic_data?retryWrites=true&w=majority&appName=Cluster0', 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;