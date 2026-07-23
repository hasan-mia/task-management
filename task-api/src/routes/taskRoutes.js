const express = require('express');
const taskRouter = express.Router();
const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    setTaskStatus,
    deleteTask,
} = require('../controllers/taskController');

taskRouter.get('/', getAllTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.post('/', createTask);
taskRouter.put('/:id', updateTask);
taskRouter.patch('/:id/status', setTaskStatus);
taskRouter.delete('/:id', deleteTask);

module.exports = taskRouter;