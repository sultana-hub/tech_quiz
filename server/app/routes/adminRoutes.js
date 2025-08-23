const express = require("express")
const AdminController = require("../controller/AdminController")
// const productImageUploads=require('../helper/productImageUpload')
const QuestionController = require('../controller/QuestionController')
const CategoryController = require('../controller/CategoryController')
const router = express.Router()


// router.post("/register",UsersImageUploads.single('image'),AuthController.register)
router.get("/", AdminController.dashboard)

//question admin route
router.get('/question/list', AdminController.listQuestionPage)

router.get('/question/add', AdminController.addQuestionPage)

router.post('/question/create', QuestionController.createQuestion)

router.get('/question/:id/edit',AdminController.editQuestionPage)

router.put('/question/update/:id',QuestionController.updateQuestion)

router.delete('/question/delete/:id',QuestionController.deleteQuestion)

//category admin route
router.get('/category/list', AdminController.listCategoryPage)

router.post('/category/create', CategoryController.createCategory)

router.get('/category/add', AdminController.addCategoryPage)

router.get('/category/:id/edit', AdminController.editCategory)

router.put('/category/update/:id', CategoryController.updateCategory)

router.delete('/category/delete/:id', CategoryController.deleteCategory)

//users route

router.get('/user/list', AdminController.getUsersList)

router.delete('/user/:userId',AdminController.softDelete)

router.get('/user/score', AdminController.getUserScoresByCategory)

module.exports = router