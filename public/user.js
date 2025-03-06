const { Router } = require("express");
const jwt = require("jsonwebtoken")
const { userModel, purchaseModel } = require("../db")

const userRouter = Router();

const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

    //sign-up route
userRouter.post("/signup", async function(req, res) {
    const{ email, password, firstName, lastName } = req.body;           // add zod validation

    // hash the password so that it is not store as plain text in db

    // Addd try catch block
    await userModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    })

    res.json({
        message: "You are succesfully signed Up!"
    })
})


        // Sign in Route
userRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body

    if(!email || !password){
        return res.json({
            message: "Email and Password can not be empty!"
        })
    }

    const user = await userModel.findOne({
        email: email,
        password: password
    });

    if(user){
        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);

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

userRouter.get("/purchases", userMiddleware,async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    })


    res.json({
        purchases
    })
})

module.exports = {
    userRouter: userRouter
}