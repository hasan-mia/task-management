const { handleError, sendResponse } = require('../utils/utils');
const catchAsyncError = require('../middleware/catchAsyncError');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');

exports.createCategory = catchAsyncError(async (req, res) => {
  try {
    const data = await createCategory(req.body);
    sendResponse(res, 201, true, 'Category created successfully', data, true);
  } catch (error) {
    handleError(res, error);
  }
});

exports.getAllCategories = catchAsyncError(async (req, res) => {
  try {
    const data = await getAllCategories(req.query);
    sendResponse(res, 200, true, 'Categories fetched successfully', data, true);
  } catch (error) {
    handleError(res, error);
  }
});

exports.getCategoryById = catchAsyncError(async (req, res) => {
  try {
    const data = await getCategoryById(req.params.id);
    sendResponse(res, 200, true, 'Category fetched successfully', data, true);
  } catch (error) {
    handleError(res, error);
  }
});

exports.updateCategory = catchAsyncError(async (req, res) => {
  try {
    const data = await updateCategory(req.params.id, req.body);
    sendResponse(res, 200, true, 'Category updated successfully', data, true);
  } catch (error) {
    handleError(res, error);
  }
});

exports.deleteCategory = catchAsyncError(async (req, res) => {
  try {
    const result = await deleteCategory(req.params.id);
    sendResponse(res, 200, true, result.message);
  } catch (error) {
    handleError(res, error);
  }
});