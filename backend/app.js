const express = require('express')
const jsonParser = require('body-parser').json;
const errorMiddleware = require("./middleware/error")
const cookieparser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const bodyParser = require('body-parser');

const path = require("path")

const app = express()

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "../backend/config/config.env" })
}


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.json())
app.use(cookieparser())
app.use(jsonParser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())




const product = require("./routes/productRoutes")
const user = require('./routes/userRoutes')
const order = require("./routes/orderRoutes");
const payment = require("./routes/paymentRoute");


app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)
app.use("/api/v1", payment)




app.use(express.static(path.resolve(__dirname, "../frontend/build")))

app.get("*", (req, resp) => {

    resp.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
})

app.use(errorMiddleware)



module.exports = app