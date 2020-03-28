import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.Todods_TABLE) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false

    }).promise()
    const items = result.Items
    console.log("items "+items)
    return items as TodoItem[]
  }

  async createTodo(todoitem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoitem
    }).promise()

    return todoitem
  }

  async updateTodo(updateTodoRequest: UpdateTodoRequest,todoId: string,userId:string): Promise<boolean> {
    const params = {
      TableName:this.todosTable,
      Key: {
        'userId':userId,
        'todoId':todoId
      },
      UpdateExpression: 'set #name = :name , dueDate = :dueDate , done = :done',
      ExpressionAttributeValues:{
        ':name':updateTodoRequest.name,
        ':dueDate':updateTodoRequest.dueDate,
        ':done':updateTodoRequest.done
      },
      ExpressionAttributeNames:{
      "#name": "name"
    },
      ReturnValues:"UPDATED_NEW"
  };

    await this.docClient.update(params).promise()

    return true
  }

  async deleteTodo(todoId: string,userId: string): Promise<boolean> {
    await this.docClient.delete( {
      TableName:this.todosTable,
      Key: {
  'userId':userId,
  'todoId':todoId
}} ).promise()

    return true
  }
}

function createDynamoDBClient() {

  return new XAWS.DynamoDB.DocumentClient()
}
