
const mongoose = require('mongoose')
const schema = mongoose.Schema


const CategorySchema = new schema({
    categoryName: {
        type: String,
        required: true
       
    },
    createdAt: {
        type: Date,
        default: Date.now
           
    },
});


const CategoryModel=mongoose.model('category',CategorySchema)

module.exports=CategoryModel