const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo.controller");
const prefix = "/todo";
router.get(prefix, todoController.getTodo);
router.get(`${prefix}/updatetask/:id`,todoController.getUpdateTask)
router.post(`${prefix}/create`, todoController.postTodo);
router.put(`${prefix}/complete/:id`,todoController.putComplete);
router.put(`${prefix}/updatetask/:id`,todoController.putUpdateTask)
router.delete(`${prefix}/delete/:id`, todoController.deleteTodo);
module.exports = router;
