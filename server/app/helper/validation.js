const Joi = require('joi');

const questionValidation = Joi.object({
    question: Joi.string().required().min(3).trim(),
    options: Joi.array()
        .items(Joi.string().required())
        .min(3)
        .required(),
    correctAnswer: Joi.string().required(),

    categoryIds: Joi.array()
        .items(Joi.any())  // Allow any type, including ObjectId
        .min(1)
        .required()
});

const categoryValidation = Joi.object({
    categoryName: Joi.string().required().min(3).trim(),
})


// const answerValidation = Joi.object({
//   selectedAnswer: Joi.string().required().trim()
// //   timeZone: Joi.string().required().trim(),
// });




const answerValidation = Joi.object({
    // questionId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    //     'string.pattern.base': 'Invalid question ID format',
    //     'any.required': 'Question ID is required',
    // }),
    selectedAnswer: Joi.string().required().messages({
        'any.required': 'Selected answer is required',
    }),
    timeZone: Joi.string().required().messages({
        'any.required': 'Time zone is required',
    }),
});

module.exports = { answerValidation };

module.exports = { questionValidation, categoryValidation,answerValidation }