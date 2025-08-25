
const QuestionModel = require('../model/question');
const { answerValidation } = require('../helper/validation');
const httpStatusCode = require('../helper/httpStatusCode')
const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');
class UserAndAnswerController {

  // creating answer
  // async createAnswer(req, res) {
  //   try {
  //     const userId = req.user._id;
  //     let { questionId, selectedAnswer, timeZone } = req.body;

  //     //  Allow null/empty answers → treat as unanswered
  //     // Allow null/empty answers → treat as unanswered
  //     if (selectedAnswer === undefined || selectedAnswer === "") {
  //       selectedAnswer = null;
  //     }

  //     // Validate only selectedAnswer
  //     const { error } = answerValidation.validate({ selectedAnswer, timeZone });
  //     if (error) {
  //       return res.status(400).json({ status: false, message: error.message });
  //     }

  //     // Get question via aggregation (you can use findById too)
  //     const questionArr = await QuestionModel.aggregate([
  //       { $match: { _id: new ObjectId(questionId) } },
  //       {
  //         $project: {
  //           correctAnswer: 1,
  //           answers: 1
  //         }
  //       }
  //     ]);

  //     const question = questionArr[0];
  //     if (!question) {
  //       return res.status(404).json({ status: false, message: "Question not found" });
  //     }

  //     // Check if correct
  //     const isCorrect = question.correctAnswer === selectedAnswer;

  //     // Prepare answer
  //     const answerObj = {
  //       userId,
  //       selectedAnswer,
  //       isCorrect,
  //       score: isCorrect ? 1 : 0,
  //       timeZone,
  //       submittedAt: new Date()
  //     };

  //     // Push into answers[]
  //     await QuestionModel.updateOne(
  //       { _id: new ObjectId(questionId) },
  //       { $push: { answers: answerObj } }
  //     );

  //     return res.status(201).json({
  //       status: true,
  //       message: "Answer submitted successfully",
  //       score: isCorrect ? 1 : 0
  //     });

  //   } catch (err) {
  //     console.error("createAnswer error:", err);
  //     return res.status(500).json({ status: false, message: "Server error" });
  //   }
  // }


  async createAnswer(req, res) {
    try {
      const userId = req.user._id;
      let { questionId, selectedAnswer, timeZone } = req.body;
      if (selectedAnswer) selectedAnswer = selectedAnswer.trim();
      if (!selectedAnswer) selectedAnswer = null;

      const { error } = answerValidation.validate({ selectedAnswer, timeZone });
      if (error) return res.status(400).json({ status: false, message: error.message });

      const question = await QuestionModel.findById(questionId);
      if (!question) return res.status(404).json({ status: false, message: "Question not found" });

      const isCorrect = question.correctAnswer === selectedAnswer;

      const existingIndex = question.answers.findIndex(a => a.userId.toString() === userId.toString());

      const answerObj = {
        userId,
        selectedAnswer,
        isCorrect,
        score: isCorrect ? 1 : 0,
        timeZone,
        submittedAt: new Date()
      };

      if (existingIndex > -1) {
        // Update existing answer
        question.answers[existingIndex] = answerObj;
      } else {
        // Push new answer
        question.answers.push(answerObj);
      }

      await question.save();

      return res.status(201).json({
        status: true,
        message: "Answer submitted successfully",
        score: answerObj.score
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
        return res.status(200).json({
          status: false,
          message: "No quiz available for the selected subject",
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


      // if (!questions.length) {
      //   return res.status(404).json({
      //     status: false,
      //     message: 'No questions found for this category'
      //   });
      // }

      // return res.status(200).json({
      //   status: true,
      //   message: 'Quiz started',
      //   timeZone,
      //   questions
      // });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }


  // async getUserQuizAnswers(req, res) {
  //   try {
  //     console.log(" Authenticated User ID:", req.user?._id);
  //     const userId = new mongoose.Types.ObjectId(req.user._id); // ensure ObjectId
  //     const results = await QuestionModel.aggregate([
  //       { $match: { 'answers.userId': userId } },

  //       // Join categories to get categoryName
  //       {
  //         $lookup: {
  //           from: 'categories', // actual collection name
  //           localField: 'categoryIds',
  //           foreignField: '_id',
  //           as: 'categories',
  //         },
  //       },

  //       // Deconstruct embedded answers
  //       { $unwind: '$answers' },

  //       // Filter only this user's answers
  //       { $match: { 'answers.userId': userId } },

  //       // Sort latest answers first
  //       { $sort: { 'answers.submittedAt': -1 } },

  //       // Group by question ID to get latest answer
  //       {
  //         $group: {
  //           _id: '$_id', // question ID
  //           question: { $first: '$question' },
  //           correctAnswer: { $first: '$correctAnswer' },
  //           selectedAnswer: { $first: '$answers.selectedAnswer' },
  //           isCorrect: { $first: '$answers.isCorrect' },
  //           score: {
  //             $first: {
  //               $ifNull: ['$answers.score', { $cond: ['$answers.isCorrect', 1, 0] }]
  //             },
  //           },
  //           submittedAt: { $first: '$answers.submittedAt' },
  //           timeZone: { $first: '$answers.timeZone' },
  //           //  categoryName from joined category document
  //           categoryName: {
  //             $first: {
  //               $cond: [
  //                 { $gt: [{ $size: '$categories' }, 0] },
  //                 { $arrayElemAt: ['$categories.categoryName', 0] },
  //                 null
  //               ],
  //             },
  //           },
  //         },
  //       },

  //       // Optional: sort latest submissions first
  //       { $sort: { submittedAt: -1 } },
  //     ]);

  //     console.log('Final filtered result:', results.map(r => ({
  //       question: r.question,
  //       categoryName: r.categoryName
  //     })));

  //     return res.status(200).json(results);
  //   } catch (err) {
  //     console.error('Error fetching user quiz answers:', err);
  //     return res.status(500).json({ error: 'Failed to fetch quiz answers' });
  //   }
  // };


  async getUserQuizAnswers(req, res) {
    try {
      console.log("Authenticated User ID:", req.user?._id);
      const userId = new mongoose.Types.ObjectId(req.user._id);

      const results = await QuestionModel.aggregate([
        // Lookup user answers for this question
        {
          $lookup: {
            from: 'questions',
            pipeline: [
              { $unwind: '$answers' },
              { $match: { 'answers.userId': userId } },
              { $sort: { 'answers.submittedAt': -1 } },
              {
                $group: {
                  _id: '$_id',
                  selectedAnswer: {
                    $first: { $ifNull: ['$answers.selectedAnswer', null] }
                  },
                  isCorrect: {
                    $first: {
                      $cond: [
                        { $eq: ['$answers.selectedAnswer', null] },
                        false,
                        '$answers.isCorrect'
                      ]
                    }
                  },
                  score: {
                    $first: {
                      $cond: [
                        { $eq: ['$answers.selectedAnswer', null] },
                        0,
                        { $ifNull: ['$answers.score', { $cond: ['$answers.isCorrect', 1, 0] }] }
                      ]
                    }
                  },
                  submittedAt: { $first: '$answers.submittedAt' },
                  timeZone: { $first: '$answers.timeZone' }
                }
              }
            ],
            localField: '_id',
            foreignField: '_id',
            as: 'userAnswer'
          }
        },
        {
          $unwind: { path: '$userAnswer', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryIds',
            foreignField: '_id',
            as: 'categories'
          }
        },
        {
          $project: {
            question: 1,
            correctAnswer: 1,
            categoryName: {
              $cond: [
                { $gt: [{ $size: '$categories' }, 0] },
                { $arrayElemAt: ['$categories.categoryName', 0] },
                null
              ]
            },
            selectedAnswer: '$userAnswer.selectedAnswer',
            isCorrect: '$userAnswer.isCorrect',
            score: { $ifNull: ['$userAnswer.score', 0] },
            submittedAt: '$userAnswer.submittedAt',
            timeZone: '$userAnswer.timeZone'
          }
        }
      ]);

      console.log(
        'Final filtered result:',
        results.map(r => ({ question: r.question, categoryName: r.categoryName, selectedAnswer: r.selectedAnswer, correctAnswer: r.correctAnswer }))
      );

      return res.status(200).json(results);
    } catch (err) {
      console.error('Error fetching user quiz answers:', err);
      return res.status(500).json({ error: 'Failed to fetch quiz answers' });
    }
  }


  // getQuizResults = async (req, res) => {
  //   try {
  //     const userId = req.user._id; // assuming auth middleware sets req.user

  //     const questions = await QuestionModel.find({})
  //       .populate("categoryIds", "categoryName");

  //     const results = questions.map((q) => {
  //       const userAnswer = q.answers.find(a => a.userId.toString() === userId.toString());

  //       return {
  //         questionId: q._id,
  //         question: q.question,
  //         categoryName: q.categoryIds?.[0]?.categoryName || "Unknown", // if populated
  //         correctAnswer: q.correctAnswer,
  //         selectedAnswer: userAnswer && userAnswer.selectedAnswer ? userAnswer.selectedAnswer : "Not Attempted",
  //         isCorrect: userAnswer && userAnswer.selectedAnswer ? userAnswer.selectedAnswer === q.correctAnswer : false,
  //         score: userAnswer && userAnswer.selectedAnswer ? (userAnswer.selectedAnswer === q.correctAnswer ? 1 : 0) : 0,
  //         submittedAt: userAnswer && userAnswer.selectedAnswer ? userAnswer.submittedAt : Date.now()
  //       };
  //     });
  //     console.log("quiz backend result", results)
  //     return res.status(200).json({
  //       message: ":result fectched",
  //       data: results
  //     });
  //   } catch (error) {
  //     console.error("Error fetching quiz results:", error);
  //     res.status(500).json({ message: error.message });
  //   }
  // };


getQuizResults = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch only questions where this user has answered
    const questions = await QuestionModel.find({
      "answers.userId": userId
    }).populate("categoryIds", "categoryName");

    // Map results only for answered questions
    const results = questions.map((q) => {
      const userAnswer = q.answers.find(a => a.userId.toString() === userId.toString());

      return {
        questionId: q._id,
        question: q.question,
        categoryName: q.categoryIds?.[0]?.categoryName || "Unknown",
        correctAnswer: q.correctAnswer,
        selectedAnswer: userAnswer?.selectedAnswer || "Not Attempted",
        isCorrect: userAnswer?.selectedAnswer
          ? userAnswer.selectedAnswer === q.correctAnswer
          : false,
        score: userAnswer?.selectedAnswer
          ? (userAnswer.selectedAnswer === q.correctAnswer ? 1 : 0)
          : 0,
        submittedAt: userAnswer?.submittedAt || null
      };
    });

    return res.status(200).json({
      message: "Results fetched",
      data: results
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ message: error.message });
  }
};




}

module.exports = new UserAndAnswerController