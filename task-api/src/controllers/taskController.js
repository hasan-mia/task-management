const { handleError, sendResponse } = require('../utils/utils');
const catchAsyncError = require('../middleware/catchAsyncError');
const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    setTaskStatus,
    deleteTask,
} = require('../services/taskService');

exports.createTask = catchAsyncError(async (req, res) => {
    try {
        const data = await createTask(req.body);
        sendResponse(res, 201, true, 'Task created successfully', data, true);
    } catch (error) {
        handleError(res, error);
    }
});

exports.getAllTasks = catchAsyncError(async (req, res) => {
    try {
        const data = await getAllTasks(req.query);
        sendResponse(res, 200, true, 'Tasks fetched successfully', data, true);
    } catch (error) {
        handleError(res, error);
    }
});

exports.getTaskById = catchAsyncError(async (req, res) => {
    try {
        const data = await getTaskById(req.params.id);
        sendResponse(res, 200, true, 'Task fetched successfully', data, true);
    } catch (error) {
        handleError(res, error);
    }
});

exports.updateTask = catchAsyncError(async (req, res) => {
    try {
        const data = await updateTask(req.params.id, req.body);
        sendResponse(res, 200, true, 'Task updated successfully', data, true);
    } catch (error) {
        handleError(res, error);
    }
});

exports.setTaskStatus = catchAsyncError(async (req, res) => {
    try {
        const data = await setTaskStatus(req.params.id, req.body.status);
        sendResponse(res, 200, true, 'Task status updated successfully', data, true);
    } catch (error) {
        handleError(res, error);
    }
});

exports.deleteTask = catchAsyncError(async (req, res) => {
    try {
        const result = await deleteTask(req.params.id);
        sendResponse(res, 200, true, result.message);
    } catch (error) {
        handleError(res, error);
    }
});