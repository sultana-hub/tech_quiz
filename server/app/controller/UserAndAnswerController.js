
const QuestionModel = require('../model/question');
const { answerValidation } = require('../helper/validation');
const httpStatusCode = require('../helper/httpStatusCode')
const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');
class UserAndAnswerController {
  // creating answer
  async createAnswer(req, res) {
    try {
      const userId = req.user._id;
      const { questionId, selectedAnswer,timeZone } = req.body;

      // Get timeZone from session (optional fallback)
      // const timeZone = req.session?.timeZone || "UTC";

      // Validate only selectedAnswer
      const { error } = answerValidation.validate({ selectedAnswer ,timeZone});
      if (error) {
        return res.status(400).json({ status: false, message: error.message });
      }

      // Get question via aggregation (you can use findById too)
      const questionArr = await QuestionModel.aggregate([
        { $match: { _id: new ObjectId(questionId) } },
        {
          $project: {
            correctAnswer: 1,
            answers: 1
          }
        }
      ]);

      const question = questionArr[0];
      if (!question) {
        return res.status(404).json({ status: false, message: "Question not found" });
      }

      // Check if correct
      const isCorrect = question.correctAnswer === selectedAnswer;

      // Prepare answer
      const answerObj = {
        userId,
        selectedAnswer,
        isCorrect,
        timeZone,
        submittedAt: new Date()
      };

      // Push into answers[]
      await QuestionModel.updateOne(
        { _id: new ObjectId(questionId) },
        { $push: { answers: answerObj } }
      );

      return res.status(201).json({
        status: true,
        message: "Answer submitted successfully",
        score: isCorrect ? 1 : 0
      });

    } catch (err) {
      console.error("createAnswer error:", err);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  }


  async quizStart(req, res) {
    try {
      const { timeZone, categoryName } = req.body;

      if (!timeZone || !categoryName) {
        return res.status(400).json({
          status: false,
          message: 'Time zone and category name are required'
        });
      }

      req.session.timeZone = timeZone;

      const result = await QuestionModel.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryIds",
            foreignField: "_id",
            as: "categoryData"
          }
        },
        { $unwind: "$categoryData" },
        {
          $match: {
            "categoryData.categoryName": { $regex: categoryName, $options: 'i' }  // from req.body
          }
        },
        {
          $group: {
            _id: "$categoryData._id",
            categoryName: { $first: "$categoryData.categoryName" },
            questions: {
              $push: {
                 _id: '$_id', // question ID
                question: "$question",
                options: "$options",
                correctAnswer: "$correctAnswer",
                duration: "$duration"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            categoryName: 1,
            questions: 1
          }
        }
      ]);

      if (!result.length) {
        return res.status(404).json({
          status: false,
          message: "No questions found for this category",
          data: []
        });
      }

      res.json({
        status: true,
        message: "Quiz started",
        timeZone: req.body.timeZone,
        categoryName: result[0].categoryName,
        questions: result[0].questions
      });


      if (!questions.length) {
        return res.status(404).json({
          status: false,
          message: 'No questions found for this category'
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Quiz started',
        timeZone,
        questions
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }


  async getUserQuizAnswers(req, res) {
    try {
      console.log(" Authenticated User ID:", req.user?._id);
      const userId = new mongoose.Types.ObjectId(req.user._id); // ensure ObjectId
      const results = await QuestionModel.aggregate([
        { $match: { 'answers.userId': userId } },

        // Join categories to get categoryName
        {
          $lookup: {
            from: 'categories', // actual collection name
            localField: 'categoryIds',
            foreignField: '_id',
            as: 'categories',
          },
        },

        // Deconstruct embedded answers
        { $unwind: '$answers' },

        // Filter only this user's answers
        { $match: { 'answers.userId': userId } },

        // Sort latest answers first
        { $sort: { 'answers.submittedAt': -1 } },

        // Group by question ID to get latest answer
        {
          $group: {
            _id: '$_id', // question ID
            question: { $first: '$question' },
            correctAnswer: { $first: '$correctAnswer' },
            selectedAnswer: { $first: '$answers.selectedAnswer' },
            isCorrect: { $first: '$answers.isCorrect' },
            score: {
              $first: {
                $ifNull: ['$answers.score', { $cond: ['$answers.isCorrect', 1, 0] }]
              },
            },
            submittedAt: { $first: '$answers.submittedAt' },
            timeZone: { $first: '$answers.timeZone' },
            //  categoryName from joined category document
            categoryName: {
              $first: {
                $cond: [
                  { $gt: [{ $size: '$categories' }, 0] },
                  { $arrayElemAt: ['$categories.categoryName', 0] },
                  null
                ],
              },
            },
          },
        },

        // Optional: sort latest submissions first
        { $sort: { submittedAt: -1 } },
      ]);

      console.log('Final filtered result:', results.map(r => ({
        question: r.question,
        categoryName: r.categoryName
      })));

      return res.status(200).json(results);
    } catch (err) {
      console.error('Error fetching user quiz answers:', err);
      return res.status(500).json({ error: 'Failed to fetch quiz answers' });
    }
  };


}

module.exports = new UserAndAnswerController