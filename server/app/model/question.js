
const mongoose = require('mongoose');


const AnswerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'

    },
  
    selectedAnswer: {
        type: String,
        default: null
    },
    isCorrect: {
        type: Boolean
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    score:{
        type:Number
    },
    timeZone: {
        type: String,
        required: true
    }
});

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    categoryIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',

    }],
    answers: [AnswerSchema], // Embedded answers
    createdAt: {
        type: Date,
        default: Date.now
    },
    duration:{
        type:Number,
        default:30  //second per question
    }
});

const QuestionModel = mongoose.model('question', QuestionSchema);

module.exports =  QuestionModel
   
   

