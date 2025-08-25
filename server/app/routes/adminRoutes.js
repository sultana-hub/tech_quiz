const express = require("express")
const AdminController = require("../controller/AdminController")
// const productImageUploads=require('../helper/productImageUpload')
const QuestionController = require('../controller/QuestionController')
const CategoryController = require('../controller/CategoryController')
const EjsAuthCheck = require('../middleware/EjsAuthCheck')
const router = express.Router()


// router.post("/register",UsersImageUploads.single('image'),AuthController.register)

//view login and register pages
router.get('/', AdminController.loginpage)

//post login pages
router.post('/login', AdminController.login)

router.get('/logout', EjsAuthCheck, AdminController.logout)

router.get("/dashboard", EjsAuthCheck, AdminController.dashboard)

//question admin route
router.get('/question/list',EjsAuthCheck, AdminController.listQuestionPage)

router.get('/question/add',EjsAuthCheck, AdminController.addQuestionPage)

router.post('/question/create',EjsAuthCheck, QuestionController.createQuestion)

router.get('/question/:id/edit',EjsAuthCheck, AdminController.editQuestionPage)

router.put('/question/update/:id', QuestionController.updateQuestion)

router.delete('/question/delete/:id',EjsAuthCheck, QuestionController.deleteQuestion)

//category admin route
router.get('/category/list',EjsAuthCheck, AdminController.listCategoryPage)

router.post('/category/create',EjsAuthCheck, CategoryController.createCategory)

router.get('/category/add',EjsAuthCheck, AdminController.addCategoryPage)

router.get('/category/:id/edit',EjsAuthCheck, AdminController.editCategory)

router.put('/category/update/:id',EjsAuthCheck, CategoryController.updateCategory)

router.delete('/category/delete/:id',EjsAuthCheck, CategoryController.deleteCategory)

// //users route
// /**
//  * @swagger
//  * /user/list:
//  *   get:
//  *     summary: Get all the users from Database
//  *     tags:
//  *       - Users
//  *     parameters:
//  *       - in: header
//  *         name: x-access-token
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Your authentication token
//  *     produces:
//  *       - application/json
//  *     responses:
//  *       '200':
//  *         description: Data fetched successfully
//  */

router.get('/user/list',EjsAuthCheck, AdminController.getUsersList)

router.delete('/user/:userId',EjsAuthCheck, AdminController.softDelete)

router.get('/user/score',EjsAuthCheck, AdminController.getUserScoresByCategory)

module.exports = router