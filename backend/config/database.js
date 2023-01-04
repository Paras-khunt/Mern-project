const mongoose = require('mongoose')

const connectDatabase = () => {

    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("database connection successfully")
    })
}

module.exports = connectDatabase