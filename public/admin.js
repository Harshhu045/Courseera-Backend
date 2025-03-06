const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const course = require("./course");

adminRouter.post("/signup", async function(req, res) {
    const{ email, password, firstName, lastName } = req.body;           // add zod validation

    // hash the password so that it is not store as plain text in db

    // Addd try catch block
    await adminModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    })

    res.json({
        message: "You are succesfully signed Up!"
    })
})

adminRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body

    if(!email || !password){
        return res.json({
            message: "Email and Password can not be empty!"
        })
    }

    const admin = await adminModel.findOne({
        email: email,
        password: password
    });

    if(admin){
        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);

        // Do cookiee logic

        res.json({
            message: "you are succesfully signed in",
            token: token
        })
    }
    else{
        res.json({
            message : "Invalid email-ID or Password"
        });
    }
})

adminRouter.post("/course", adminMiddleware, async function(req, res) {

    const adminId = req.userId;

    const { title, description, imageUrl, price} = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })
    res.json({
        message: "course created succesfully",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.params.adminId;

    const {title, description, imageUrl, price, courseId} = req.body;


    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: new ObjectId(adminId)
    }, {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price
    })
    
    res.json({
        message: "course Updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId
    });

    res.json({
        message: "course updated",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}