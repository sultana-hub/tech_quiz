
const httpStatusCode = require("../helper/httpStatusCode");
const CategoryModel = require("../model/category");
const fs = require('fs').promises
const path = require('path')
const mongoose = require('mongoose')
const logger=require('../helper/logger')
class CategoryController {

    async createCategory(req, res) {
        try {
            const { categoryName } = req.body;

            if (!categoryName) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "All fields are required"
                });
            }

            if (categoryName.length < 3 || categoryName.length > 30) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "categoryName must be within 3 to 30 characters"
                });
            }

            //  Create a new instance of the CategoryModel
            const categoryData = new CategoryModel({ categoryName });

            // Save the document instance
            const data = await categoryData.save();
            return res.redirect(`/category/list`);
        } catch (error) {
             logger.error("error occured", error);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            });
        }
    }


    async getAllCategory(req, res) {
        try {
            // Fetch all categories from the database
            const categories = await CategoryModel.find({});

            // If no categories found 
            if (!categories.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No categories found',
                    data: []
                });
            }

            // Successful response
            // return res.redirect('/category/list')
            return res.status(200).json({
                success: true,
                message: 'Categories retrieved successfully',
                data: categories
            });

        } catch (error) {
             logger.error("error occured", error);
            console.error('Error fetching categories:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while fetching categories',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }



    async updateCategory(req, res) {
        const { id } = req.params;
        const { categoryName } = req.body;

        try {
            if (!categoryName || categoryName.trim() === "") {
                console.log("categoryName required");
                return res.redirect(`/category/${id}/edit`);
            }

            // Use aggregation to check for duplicate categoryName excluding the current ID
            const existingCategory = await CategoryModel.aggregate([
                {
                    $match: {
                        categoryName: categoryName,
                        _id: { $ne: new mongoose.Types.ObjectId(id) }
                    }
                },
                { $limit: 1 }
            ]);

            if (existingCategory.length > 0) {
                console.log("categoryName already exists");
                return res.redirect(`/category/${id}/edit`);
            }

            // Perform the update
            const updateResult = await CategoryModel.updateOne({ _id: id },

                {
                    $set: {
                        categoryName: categoryName

                    }
                }
            );

            if (updateResult.matchedCount === 0) {
                console.log("Category not found");
                return res.redirect('/category/list');
            }

            console.log("Category updated successfully");
            res.redirect('/category/list');

        } catch (error) {
             logger.error("error occured", error);
            console.error("Update error:", error.message);
            res.redirect(`/category/${id}/edit`);
        }
    }

    async deleteCategory(req, res) {
        try {
            const id = req.params.id;

            // Step 1: Using aggregation to verify the category exists
            const existingCategory = await CategoryModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) }
                },
                { $limit: 1 }
            ]);

            if (existingCategory.length === 0) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "Category not found"
                });
            }

            // Step 2: Proceeding to delete
            await CategoryModel.deleteOne({ _id: id });

            return res.redirect('/category/list')
            
        } catch (error) {
             logger.error("error occured", error);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            });
        }
    }



}


module.exports = new CategoryController()