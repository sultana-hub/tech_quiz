const  QuestionModel= require('../model/question');
const  CategoryModel = require('../model/category');
const mongoose=require('mongoose')
const  {questionValidation}=require('../helper/validation')


class QuestionController {

    async createQuestion(req, res) {
        console.log("Received categories from frontend:", req.body.category);
        const { question, options, correctAnswer, category } = req.body;

        try {
            const categoryArray = Array.isArray(category) ? category : [category];

            const categoryIds = categoryArray.map(id =>
                new mongoose.Types.ObjectId(id)
            );

            // Validate using Joi
            const { error } = questionValidation.validate({
                question,
                options,
                correctAnswer,
                categoryIds
            });

            if (error) {
                return res.status(400).json({ status: false, message: error.message });
            }

            // Create the question
            const newQuestion = await QuestionModel.create({
                question,
                options,
                correctAnswer,
                categoryIds
            });

            return res.status(201).json({
                status: true,
                message: "Question created successfully",
                data: newQuestion
            });
        } catch (error) {
            console.error("Question creation error:", error);
            return res.status(500).json({
                status: false,
                message: "Something went wrong"
            });
        }
    }

}

module.exports = new QuestionController