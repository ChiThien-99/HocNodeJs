let todolist = [
  { id: 1, task: "Ăn sáng", complete: false },
  { id: 2, task: "Đi làm", complete: false },
];
export const getTodo = (req, res) => {
  res.render("todo.ejs", { todolist });
};
export const postTodo = (req, res) => {
  try {
    let newTodo = req.body;
    console.log(req.body);
    newTodo.id =
      todolist.length > 0 ? Math.max(...todolist.map((t) => t.id)) + 1 : 1;
    todolist.push(newTodo);
    console.log(todolist);
    res.status(201).json(newTodo);
  } catch (error) {
    res.json(error);
  }
};
export const deleteTodo = (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    todolist = todolist.filter((item) => item.id != id);
    res.json({ mess: "Xóa thành công", status: 200 });
  } catch (error) {
    res.json({ mess: "Xóa không thành công", error: error.message });
  }
};
export const putComplete=(req,res)=>{
  try {
    const {id}=req.params;
    todolist[Number(id)-1].complete=true;
    console.log(todolist);
    res.json({mess:"Đã hoàn thành",status:200});
  } catch (error) {
    res.json({mess:"Chưa hoàn thành",error});
  }
}
export const getUpdateTask=(req,res)=>{
  try {
    const {id}=req.params;
    const task=todolist[Number(id)-1];
    res.json(task);
  } catch (error) {
    res.json(error);
  }
}
export const putUpdateTask=(req,res)=>{
  try {
    const {id}=req.params;
    const body=req.body;
    todolist[Number(id)-1].task=body.task;
    console.log(body.task);
    res.json({mess:"Đã update",status:200});
  } catch (error) {
    res.json({mess:"Update lỗi",error:error.message});
  }
  
}
