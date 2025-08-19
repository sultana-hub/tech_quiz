const httpStatusCode = require('../helper/httpStatusCode')
const QuestionModel = require('../model/question')
const CategoryModel = require('../model/category')
const { UserModel } = require('../model/user')
// const mongoose = require('mongoose')

class AdminController {
    async dashboard(req, res) {
        try {

            res.render('dashboard', {
                title: "dashboard"
            })

        } catch (error) {
            console.log(error.message);

        }

    }
    //Question admin
    async listQuestionPage(req, res) {
        try {
            const questions = await QuestionModel.aggregate([
                {
                    $match: {}
                }
            ])

            res.render('question/list', {
                title: "question List", questions

            })
        } catch (error) {
            console.log("errorr in showing question list", error)
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }



    async addQuestionPage(req, res) {
        try {
            const category = await CategoryModel.aggregate([
                {
                    $match: {}

                },
                {
                    $project: {
                        _id: 1,
                        categoryName: 1
                    }
                }
            ]);

            res.render('question/add', {
                title: "Add Question",
                category
            });
        } catch (error) {
            res.status(httpStatusCode.InternalServerError).send(error);
        }
    }



    // async editQuestionPage(req, res) {
    //     try {
    //         const product = await ProductModel.findById(req.params.id);
    //          const category=await CategoryModel.find()
    //         res.render('product/edit', { title: "Edit Course", product,category })
    //     } catch (error) {
    //         res.status(httpStatusCode.InternalServerError).send(error)
    //     }
    // }





    // category admin
    async listCategoryPage(req, res) {
        try {
            const category = await CategoryModel.find()

            res.render('category/list', {
                title: "category List", category,

            })
        } catch (error) {
            console.log("errorr in showing category list", error)
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }
    async addCategoryPage(req, res) {
        try {
            res.render('category/add', { title: "Add category" })
        } catch (errorr) {
            res.status(httpStatusCode.InternalServerError).send(errorr)
        }
    }



    async editCategory(req, res) {
        try {
            const category = await CategoryModel.findById(req.params.id);
            res.render('category/edit', { title: "Edit category", category })
        } catch (error) {
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }

    async getUsersList(req, res) {
        try {
            const users = await UserModel.aggregate([
                {
                    $match: {}
                }
            ])
            res.render('users/list', { title: "Users", users })
        } catch (error) {
            console.error("getUsersList error:", error);
            res.status(httpStatusCode.InternalServerError).send(error.message)
        }
    }

    async getUserScoresByCategory(req, res) {
        try {
         const results = await QuestionModel.aggregate([
  { $unwind: "$answers" },

  // join user details
  {
    $lookup: {
      from: "users",
      localField: "answers.userId",
      foreignField: "_id",
      as: "userDetails"
    }
  },
  { $unwind: "$userDetails" },

  // join categories
  {
    $lookup: {
      from: "categories",
      localField: "categoryIds",
      foreignField: "_id",
      as: "categories"
    }
  },
  { $unwind: "$categories" },

  // group per user + category (user's achieved score)
  {
    $group: {
      _id: {
        userId: "$userDetails._id",
        categoryId: "$categories._id"
      },
      userName: { $first: "$userDetails.userName" },
      email: { $first: "$userDetails.email" },
      categoryName: { $first: "$categories.categoryName" }, // adjust field name
      totalScore: { $sum: "$answers.score" }
    }
  },

  // lookup again to compute max possible score per category
  {
    $lookup: {
      from: "questions",
      localField: "_id.categoryId",
      foreignField: "categoryIds",
      as: "categoryQuestions"
    }
  },

  // compute maxScore for category
  {
    $addFields: {
      maxScore: {
        $sum: {
          $map: {
            input: "$categoryQuestions",
            as: "q",
            in: {
              $cond: [
                { $gt: [{ $size: "$$q.options" }, 0] },
                // assume each question max score = highest score among answers
                { $max: "$$q.answers.score" },
                0
              ]
            }
          }
        }
      }
    }
  },

  // compute percentage
  {
    $addFields: {
      percentage: {
        $cond: [
          { $gt: ["$maxScore", 0] },
          { $round: [{ $multiply: [{ $divide: ["$totalScore", "$maxScore"] }, 100] }, 2] },
          0
        ]
      }
    }
  },

  { $project: { categoryQuestions: 0 } }, // cleanup
  { $sort: { userName: 1, categoryName: 1 } }
]);

            console.log("score result",results)
            res.render("userScore/score", { title:"Scores",results });
        } catch (err) {
            console.error("Error fetching user scores:", err);
            res.status(500).send("Server Error",err.message);
        }
    }




}

module.exports = new AdminController