const httpStatusCode = require('../helper/httpStatusCode')
const QuestionModel = require('../model/question')
const CategoryModel = require('../model/category')
const { UserModel, loginValidation } = require('../model/user')
const mongoose = require('mongoose')
const { hashedPassword, comparePassword } = require("../middleware/auth");
const jwt = require('jsonwebtoken')
const logger=require('../helper/logger')
class AdminController {

  async ejsAuthCheck(req, res, next) {
    try {
      if (req.user) {
        return next();
      }
      return res.redirect('/'); // login page
    } catch (err) {
      console.error("AuthCheck Error:", err);
      return res.redirect('/');
    }
  };

  async loginpage(req, res) {
    try {
      const message = req.flash('message');
      res.render('login', {
        title: "Login",
        message
      });
    } catch (error) {
       logger.error("error occured", error);
      console.error(error);
      req.flash('message', "Internal server error");
      res.redirect('/');
    }
  }




  async login(req, res) {
    try {
      const { error, value } = loginValidation.validate(req.body);
      if (error) {
        req.flash('message', error.details[0].message);
        return res.redirect('/');
      }

      const user = await UserModel.findOne({ email: value.email });
      if (!user) {
        req.flash('message', "User not found");
        return res.redirect('/');
      }

      const isMatch = await comparePassword(value.password, user.password);
      if (!isMatch) {
        req.flash('message', "Invalid password");
        return res.redirect('/');
      }

    if (user.isAdmin !== 'admin') {
                req.flash('message', "Please login with admin credentials");
                return res.redirect('/');
            }


      //  Access Token (short expiry)
      const accessToken = jwt.sign(
        {
          _id: user._id,
          userName: user.userName,
          email: user.email,

        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" } // short lived
      );

      
      await user.save();

      //  Set cookies
      res.cookie("usertoken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

  

      req.flash("message", "Welcome admin!");
      return res.redirect("/dashboard");

    } catch (err) {
       logger.error("error occured", error);
      console.error(" Login error:", err);
      req.flash("message", "Internal server error");
      return res.redirect("/");
    }
  }

  async logout(req, res) {
    try {
      // If you stored JWT in cookies
      res.clearCookie("token");
      // If you also used session
      req.session.destroy(() => {
        res.redirect("/?message=Logged out successfully");
      });
    } catch (error) {
       logger.error("error occured", error);
      console.error("Logout error:", error);
      res.redirect("/?error=Something went wrong");
    }
  }


  async dashboard(req, res) {
    try {
      //Logged-in user comes from JWT (middleware attached req.user)
      const loggedInUser = req.user;
       const questions=await QuestionModel.find()
       const category=await CategoryModel.find()
      //  Use flash for dynamic message
      req.flash("success", `Welcome to ${loggedInUser.userName} dashboard`);

      res.render("dashboard", {
        title: `${loggedInUser.userName} Dashboard`,
        user: loggedInUser,   // only logged-in user
        message: req.flash("success"),
        questions:questions.length,
        category:category.length
      });
    } catch (error) {
       logger.error("error occured", error);
      console.error("Dashboard error:", error);
      req.flash("error", "Failed to load dashboard");
      return res.redirect("/");
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
       logger.error("error occured", error);
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



  async editQuestionPage(req, res) {
    try {
      const questionData = await QuestionModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
        },
        {
          $lookup: {
            from: "categories",              // collection name in MongoDB
            localField: "categoryIds",
            foreignField: "_id",
            as: "categoriesInfo"
          }
        }
      ]);

      if (!questionData.length) {
        return res.status(404).send("Question not found");
      }

      const question = questionData[0];
      const allCategories = await CategoryModel.find();

      res.render("question/edit", {
        question,
        categories: allCategories
      });
    } catch (err) {
       logger.error("error occured", error);
      console.error("Error fetching question with lookup:", err);
      res.status(500).send("Server error");
    }
  }








  async deleteQuestion(req, res) {
    try {

    } catch (error) {

    }
  }



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
          $match: { isDeleted: false }
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

      console.log("score result", results)
      res.render("userScore/score", { title: "Scores", results });
    } catch (err) {
       logger.error("error occured", error);
      console.error("Error fetching user scores:", err);
      res.status(500).send("Server Error", err.message);
    }
  }


  async softDelete(req, res) {

  }


}

module.exports = new AdminController