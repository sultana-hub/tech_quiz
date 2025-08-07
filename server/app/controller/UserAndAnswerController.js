

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
      const { questionId, selectedAnswer } = req.body;

      // Get timeZone from session (optional fallback)
      const timeZone = req.session?.timeZone || "UTC";

      // Validate only selectedAnswer
      const { error } = answerValidation.validate({ selectedAnswer });
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
    const { timeZone } = req.body;
    req.session.timeZone = timeZone;

    if (!timeZone) {
      return res.status(400).json({ status: false, message: 'Time zone required' });
    }

    // Save time zone in session or DB (optional), then send questions
    const questions = await QuestionModel.aggregate([
      { $match: {} },
      {
        $project: {
          question: 1,
          options: 1,
          duration: 1,
          categoryIds: 1,
        }
      }
    ]);

    return res.status(200).json({
      status: true,
      message: 'Quiz started',
      timeZone,
      questions
    });

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