import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId:string): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  console.log("createTodoRequest")
  console.log(createTodoRequest)
  return await todoAccess.createTodo({
    todoId: itemId,
    userId:userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false
  })
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<boolean> {

  return await todoAccess.updateTodo(updateTodoRequest,todoId,userId)
}

export async function deleteTodo(todoId:string,userId:string): Promise<boolean> {
  return todoAccess.deleteTodo(todoId,userId)
}
