
const mongoose = require('mongoose')
const schema = mongoose.Schema
const Joi = require('joi')

const userValidation = Joi.object({
    userName: Joi.string().required().min(3).trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/) // Alphanumeric and at least one special character
        .messages({
            'string.length': 'Password must be exactly 8 characters long.',
            'string.pattern.base': 'Password must contain alphanumeric characters and at least one special character.',
        }),
    profilePic: Joi.string().optional().trim()
})

const loginValidation = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().trim()
 
})

const passwordValidation = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, contain alphanumeric characters, and at least one special character"
    }),
});



const UserSchema = new schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,


    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: String,
        default: "user"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const UserModel = mongoose.model('user', UserSchema)
module.exports = { UserModel, userValidation, loginValidation ,passwordValidation}