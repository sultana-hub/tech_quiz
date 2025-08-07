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


const answerValidation = Joi.object({
  selectedAnswer: Joi.string().required().trim()
//   timeZone: Joi.string().required().trim(),
});


module.exports = { questionValidation, categoryValidation,answerValidation }