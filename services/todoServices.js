import TodoTask from "../models/TodoModel.js";

class TodoService {
  async createTodo({ newTodo }) {
    const { task } = newTodo;
    const taskExist = await TodoTask.findOne({ task });
    if (taskExist) {
      throw new Error("Task already exists");
    }
    const saveTask = await newTodo.save();
    return { message: "Task has been added successfully", todo: saveTask };
  }

  async getAllTodos({page, limit}) {
    try {
      const options = {
        page: page || 1,
        limit: limit || 3,
      };
      const todos = await TodoTask.paginate({}, options);
      return { data: todos.docs, total: todos.totalDocs, totalPages: todos.totalPages, currentPage: todos.page };
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateTodo({ id, body }) {
    const updatedTask = await TodoTask.findByIdAndUpdate({ _id: id }, body, {
      new: true,
    });
    if (!updatedTask) {
      return { message: "No task found for this id", todo: null };
    }
    return { message: "Task has been updated", todo: updatedTask };
  }

  async deleteTodo({ id }) {
    try {
      const taskToDelete = await TodoTask.findByIdAndDelete({ _id: id });
      if (!taskToDelete) {
        return { message: "No task found", todo: null };
      }
      return { message: "Record deleted successfully", todo: taskToDelete };
    } catch (error) {
      return { error };
    }
  }
}

export default new TodoService();
