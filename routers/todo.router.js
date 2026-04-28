import express from "express";
export const routerTodo = express.Router();
import * as todoController from "../controllers/todo.controller.js";
const prefix = "/todo";
routerTodo.get(prefix, todoController.getTodo);
routerTodo.get(`${prefix}/updatetask/:id`,todoController.getUpdateTask)
routerTodo.post(`${prefix}/create`, todoController.postTodo);
routerTodo.put(`${prefix}/complete/:id`,todoController.putComplete);
routerTodo.put(`${prefix}/updatetask/:id`,todoController.putUpdateTask)
routerTodo.delete(`${prefix}/delete/:id`, todoController.deleteTodo);

