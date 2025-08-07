const express=require('express')
const UserAndAnswerController=require('../controller/UserAndAnswerController')
const {AuthCheck}=require('../middleware/auth')

const router=express.Router()


router.post('/answer/create',AuthCheck,UserAndAnswerController.createAnswer)

router.post('/quiz/start', AuthCheck,UserAndAnswerController.quizStart)

router.get('/quiz/result',AuthCheck,UserAndAnswerController.getUserQuizAnswers)

module.exports=router