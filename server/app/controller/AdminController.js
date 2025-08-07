const httpStatusCode = require('../helper/httpStatusCode')
const  QuestionModel  = require('../model/question')
const  CategoryModel  = require('../model/category')
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

    async getUserWithAnswer(req, res) {
        try {
            const users = await QuestionModel.aggregate([
                {
                    $match: {}
                }
            ])
            res.render('users/list', { title: "Users and Answers", users })
        } catch (error) {
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }






}

module.exports = new AdminController