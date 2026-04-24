
const todolist=[
    {id:1,task:"Ăn sáng",complete:false},
    {id:2,task:"Đi làm",complete:false},
]
export const getTodo=(req,res)=>{
    res.render("todo.ejs",{todolist});
}
export const postTodo=(req,res)=>{
    try {
        let newTodo=req.body;
        console.log(req.body);
        newTodo.id=todolist.length>0?Math.max(...todolist.map(t=>t.id))+1:1;
        todolist.push(newTodo);
        console.log(todolist);
        res.status(201).json(newTodo);
    } catch (error) {
        res.json(error);
    }
}