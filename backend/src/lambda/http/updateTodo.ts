// import 'source-map-support/register'
//
// import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
//
// // import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
//
// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   // const todoId = event.pathParameters.todoId
//   // const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
//
//   // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
//   console.log(event);
//   return undefined
// }


import 'source-map-support/register'
import { updateTodo } from '../../bussinesLogic/todos';
import { parseUserId , getToken } from '../../auth/utils'
import * as express from 'express'
import bodyParser from 'body-parser';
import * as awsServerlessExpress from 'aws-serverless-express'


const app = express()
app.use(bodyParser.json())
app.put('/todos/:todoId', async (_req, res) => {
  const authHeader = _req.headers.authorization
  const token = getToken(authHeader)
  const userId = parseUserId(token)
  await updateTodo(_req.body,_req.params.todoId,userId)
  res.set({
          'Access-Control-Allow-Origin': '*'
      });
  res.json({
  })
})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
