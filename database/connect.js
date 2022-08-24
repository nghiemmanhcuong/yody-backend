const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@yody.ponso.mongodb.net/?retryWrites=true&w=majority`,
        );
        console.log('database connect successfull!');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;
