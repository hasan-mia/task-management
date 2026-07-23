const { Category } = require('../models');
const { ErrorHandler } = require('../utils/utils');
const { Op } = require('sequelize');

const createCategory = async (data) => {
  try {
    const { name } = data;

    if (!name || !name.trim()) {
      throw new ErrorHandler('Name is required', 400);
    }

    const category = await Category.create({
      name: name.trim(),
    });

    return category;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ErrorHandler('Category name already exists', 409);
    }
    throw new ErrorHandler(error.message, error.statusCode || 500);
  }
};

const getAllCategories = async (filters = {}) => {
  try {
    const { search } = filters;
    const whereClause = {};

    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    const categories = await Category.findAll({
      where: whereClause,
      order: [['name', 'ASC']],
    });

    return categories;
  } catch (error) {
    throw new ErrorHandler(error.message, error.statusCode || 500);
  }
};

const getCategoryById = async (id) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new ErrorHandler('Category not found', 404);
    }
    return category;
  } catch (error) {
    throw new ErrorHandler(error.message, error.statusCode || 500);
  }
};

const updateCategory = async (id, data) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new ErrorHandler('Category not found', 404);
    }

    if (data.hasOwnProperty('name')) {
      if (!data.name || !data.name.trim()) {
        throw new ErrorHandler('Name is required', 400);
      }
      await category.update({ name: data.name.trim() });
    }

    return category;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ErrorHandler('Category name already exists', 409);
    }
    throw new ErrorHandler(error.message, error.statusCode || 500);
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new ErrorHandler('Category not found', 404);
    }
    await category.destroy();
    return { message: 'Category deleted successfully' };
  } catch (error) {
    throw new ErrorHandler(error.message, error.statusCode || 500);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};