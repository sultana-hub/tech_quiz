const express=require('express')
const UserAndAnswerController=require('../controller/UserAndAnswerController')
const {AuthCheck}=require('../middleware/auth')
 const CategoryController=require('../controller/CategoryController')
const router=express.Router()

/**
 * @swagger
 * /api/answer/create:
 *   post:
 *     summary: Submit an answer to a quiz question
 *     tags:
 *       - Quiz
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - selectedAnswer
 *               - timeZone
 *             properties:
 *               questionId:
 *                 type: string
 *                 description: The ID of the question
 *                 example: "64d8c9c7e42b9a12f8e3c123"
 *               selectedAnswer:
 *                 type: string
 *                 description: User's selected option
 *                 example: "Option A"
 *               timeZone:
 *                 type: string
 *                 description: User's time zone
 *                 example: "Asia/Kolkata"
 *     responses:
 *       '200':
 *         description: Answer submitted successfully
 *       '400':
 *         description: Invalid input
 *       '401':
 *         description: Unauthorized (missing or invalid token)
 *       '500':
 *         description: Server error
 */


//      /api//answer/create
router.post('/answer/create',AuthCheck,UserAndAnswerController.createAnswer)

/**
 * @swagger
 * /api/quiz/start:
 *   post:
 *     summary: Start a quiz session
 *     tags:
 *       - Quiz
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: Name of the quiz category
 *                 example: "JavaScript"
 *               timeZone:
 *                 type: string
 *                 description: User's time zone
 *                 example: "Asia/Kolkata"
 *     responses:
 *       '200':
 *         description: Quiz started successfully (returns questions)
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server error
 */

// /api//quiz/start
router.post('/quiz/start', AuthCheck,UserAndAnswerController.quizStart)

/**
 * @swagger
 * /api/quiz/result:
 *   get:
 *     summary: Get quiz results of logged-in user
 *     tags:
 *       - Quiz
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       '200':
 *         description: Quiz results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalScore:
 *                   type: number
 *                   example: 15
 *                 answers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionId:
 *                         type: string
 *                         example: "64d8c9c7e42b9a12f8e3c123"
 *                       selectedAnswer:
 *                         type: string
 *                         example: "Option B"
 *                       isCorrect:
 *                         type: boolean
 *                         example: true
 *                       score:
 *                         type: number
 *                         example: 5
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server error
 */
//  /api//quiz/result
router.get('/quiz/result',AuthCheck,UserAndAnswerController.getQuizResults)

router.get('/categories',AuthCheck,CategoryController.getAllCategory)

module.exports=router