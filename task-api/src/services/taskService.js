const { Task, Category } = require('../models');
const { ErrorHandler } = require('../utils/utils');
const { Op } = require('sequelize');

const ALLOWED_SORT_FIELDS = {
    dueDate: 'due_date',
    createdAt: 'created_at',
};

const createTask = async (data) => {
    try {
        const { title, description, categoryId, status, dueDate } = data;

        if (!title || !title.trim()) {
            throw new ErrorHandler('Title is required', 400);
        }

        if (status && !['open', 'done'].includes(status)) {
            throw new ErrorHandler('Status must be "open" or "done"', 400);
        }

        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw new ErrorHandler('Category not found', 404);
            }
        }

        const task = await Task.create({
            title: title.trim(),
            description: description ? description.trim() : null,
            categoryId: categoryId || null,
            status: status || 'open',
            dueDate: dueDate || null,
        });

        return getTaskById(task.id);
    } catch (error) {
        throw new ErrorHandler(error.message, error.statusCode || 500);
    }
};

const getAllTasks = async (filters = {}) => {
    try {
        const { search, categoryId, status, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
        const whereClause = {};

        if (categoryId) whereClause.categoryId = categoryId;
        if (status) {
            if (!['open', 'done'].includes(status)) {
                throw new ErrorHandler('Status must be "open" or "done"', 400);
            }
            whereClause.status = status;
        }
        if (search) {
            whereClause.title = { [Op.like]: `%${search}%` };
        }

        const sortColumn = ALLOWED_SORT_FIELDS[sortBy] || ALLOWED_SORT_FIELDS.createdAt;
        const order = String(sortOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const tasks = await Task.findAll({
            where: whereClause,
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
            order: [[sortColumn, order]],
        });

        return tasks;
    } catch (error) {
        throw new ErrorHandler(error.message, error.statusCode || 500);
    }
};

const getTaskById = async (id) => {
    try {
        const task = await Task.findByPk(id, {
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
        });
        if (!task) {
            throw new ErrorHandler('Task not found', 404);
        }
        return task;
    } catch (error) {
        throw new ErrorHandler(error.message, error.statusCode || 500);
    }
};

const updateTask = async (id, data) => {
    try {
        const task = await Task.findByPk(id);
        if (!task) {
            throw new ErrorHandler('Task not found', 404);
        }

        const updateData = {};

        if (data.hasOwnProperty('title')) {
            if (!data.title || !data.title.trim()) {
                throw new ErrorHandler('Title is required', 400);
            }
            updateData.title = data.title.trim();
        }
        if (data.hasOwnProperty('description')) {
            updateData.description = data.description ? data.description.trim() : null;
        }
        if (data.hasOwnProperty('categoryId')) {
            if (data.categoryId) {
                const category = await Category.findByPk(data.categoryId);
                if (!category) {
                    throw new ErrorHandler('Category not found', 404);
                }
            }
            updateData.categoryId = data.categoryId || null;
        }
        if (data.hasOwnProperty('status')) {
            if (!['open', 'done'].includes(data.status)) {
                throw new ErrorHandler('Status must be "open" or "done"', 400);
            }
            updateData.status = data.status;
        }
        if (data.hasOwnProperty('dueDate')) {
            updateData.dueDate = data.dueDate || null;
        }

        if (Object.keys(updateData).length > 0) {
            await task.update(updateData);
        }

        return getTaskById(id);
    } catch (error) {
        throw new ErrorHandler(error.message, error.statusCode || 500);
    }
};

const setTaskStatus = async (id, status) => {
    if (!['open', 'done'].includes(status)) {
        throw new ErrorHandler('Status must be "open" or "done"', 400);
    }
    return updateTask(id, { status });
};

const deleteTask = async (id) => {
    try {
        const task = await Task.findByPk(id);
        if (!task) {
            throw new ErrorHandler('Task not found', 404);
        }
        await task.destroy();
        return { message: 'Task deleted successfully' };
    } catch (error) {
        throw new ErrorHandler(error.message, error.statusCode || 500);
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    setTaskStatus,
    deleteTask,
};