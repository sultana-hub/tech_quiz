const QuestionModel = require('../model/question');
const CategoryModel = require('../model/category');
const mongoose = require('mongoose')
const { questionValidation } = require('../helper/validation')
const logger=require('../helper/logger')

class QuestionController {

    async createQuestion(req, res) {
        console.log("Received categories from frontend:", req.body.category);
        let { question, options, correctAnswer, category } = req.body;
        // Trim whitespace from answers
        if (correctAnswer) correctAnswer = correctAnswer.trim()
        if (options && Array.isArray(options)) options = options.map(opt => opt.trim());
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
            res.redirect("/question/list");
            // return res.status(201).json({
            //     status: true,
            //     message: "Question created successfully",
            //     data: newQuestion
            // });
        } catch (error) {
             logger.error("error occured", error);
            console.error("Question creation error:", error);
            return res.status(500).json({
                status: false,
                message: "Something went wrong"
            });
        }
    }

    async updateQuestion(req, res) {
        try {
            let { question, options, correctAnswer, categoryIds, duration } = req.body;

            if (correctAnswer) correctAnswer = correctAnswer.trim()
            // Ensure categoryIds is always an array
            let categoryArray = Array.isArray(categoryIds)
                ? categoryIds
                : [categoryIds];

            // Update the question
            await QuestionModel.findByIdAndUpdate(
                req.params.id,
                {
                    question,
                    options: Array.isArray(options) ? options : [options], // handle single input
                    correctAnswer,
                    categoryIds: categoryArray.map((id) => new mongoose.Types.ObjectId(id)),
                    duration
                },
                { new: true }
            );

            res.redirect("/question/list"); // redirect back to list
        } catch (error) {
             logger.error("error occured", error);
            console.error("Error updating question:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async deleteQuestion(req, res) {
        try {
            const { id } = req.params;
            const deleted = await QuestionModel.findByIdAndDelete(id);

            if (!deleted) {
                return res.status(404).json({ status: false, message: "Question not found" });
            }

            // if using EJS page redirection
            res.redirect('/question/list');

            // or if using API
            // res.status(200).json({ status: true, message: "Question deleted successfully" });
        } catch (error) {
            console.error("Delete question error:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }


}

module.exports = new QuestionController