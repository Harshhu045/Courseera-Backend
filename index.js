require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose")
const { userRouter } = require("./public/user");
const { courseRouter } = require("./public/course");
const { adminRouter } = require("./public/admin");

const app = express();
app.use(express.json())

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000)
    console.log("LIstening on port 3000")
}

main();