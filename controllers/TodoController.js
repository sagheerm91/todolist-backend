import TodoTask from "../models/TodoModel.js";
import todoServices from "../services/todoServices.js";

export const createTodo = async (req, res) => {
    try {
        const newTodo = new TodoTask(req.body);
        const result = await todoServices.createTodo({ newTodo });
        res.status(200).json(result);
      } catch (error) {
        if (error.message === "Task already exists") {
          res.status(409).json({ message: "Task already exists" }); // 409 Conflict
        } else {
          res.status(500).json({ message: "Error creating todo" });
        }
      }
    
};

export const getTodos = async (req, res) => {
    const result = await todoServices.getAllTodos();
    if (result.error) {
      return res.status(500).json(result);
    } else if (result.data === null) {
      return res.status(404).json(result);
    } else {
      return res.status(200).json({data: result});
    }
  }

/*
export const getSingleTodo = async(req, res) => {
    try {
        const id = req.params.id;
        const taskToUpdate = await TodoTask.findById({_id:id});
        if(!taskToUpdate){
            return res.status(404).json({message:"No task found for this id"});
        }
        return res.status(200).json(taskToUpdate.task);
        
    } catch (error) {
        return res.status(500).json(error);
    }
} */

export const updateTodo = async(req, res) =>{
    const result = await todoServices.updateTodo({
      id: req.params.id,
      body: req.body
    });
    if (result.todo) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  };

export const deleteTodo = async(req, res) => {
    const result = await todoServices.deleteTodo({
      id: req.params.id
    });
    if (result.todo) {
      return res.status(200).json(result);
    } else if (result.error) {
      return res.status(500).json(result);
    } else {
      return res.status(404).json(result);
    }
};