require('dotenv').config();
const mongoose = require('mongoose');
const mongo_uri = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);

const connectDB = async()=> {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database: ' + conn.connection.host);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;