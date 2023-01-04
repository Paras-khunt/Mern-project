const app = require("./app")

const cloudinary = require("cloudinary")
const connectDatabase = require("./config/database")

const hostname = '0.0.0.0'

//=====Unhandling Uncaught Exception====================================================================
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`)
    process.exit(1)
})


if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "../backend/config/config.env" })
}


connectDatabase();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const server = app.listen(process.env.PORT, hostname, () => {
    console.log(`server is running on ${process.env.PORT}`)
})

// const server = app.listen(process.env.PORT, '192.168.29.229', () => {
//     console.log(`server is running on ${process.env.PORT}`)
// })

//========Unhandled Promise Rejection===================================================================

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)

    server.close(() => {
        process.exit(1)
    })
})