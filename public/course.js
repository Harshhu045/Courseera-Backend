
const { Router } = require("express")
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const courseRouter = Router();


courseRouter.post("/purchase", userMiddleware, async function(req, res) {
        // you would expect the user to pay you money
        const userId = req.userId;
        const courseId = req.body.courseId;

        await purchaseModel.create({
            userId,
            courseId
        })

        res.json({
            message: "You have succesfully purchased the course!"
        })
    })

courseRouter.get("/preview", async function(req, res) {

        const courses = await courseModel.find({});

        res.json({
            courses
        })
    })

module.exports = {
    courseRouter: courseRouter
}