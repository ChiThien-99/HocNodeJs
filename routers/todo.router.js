const express=require("express");
const router=express.Router();
const todoController=require("../controllers/todo.controller");
const prefix="/todo";
router.get(prefix,todoController.getTodo);
router.post(`${prefix}/create`,todoController.postTodo);
module.exports=router;