const mongoose = require('mongoose')

const connectdb = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        
        console.log(`db has been connected ${conn.connection.host}`);
        
    }
    catch(err) {
        console.error(`Error connecting to the database: ${err.message}`);
        process.exit(1);
    }

}
module.exports = connectdb;