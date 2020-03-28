import 'source-map-support/register'

// import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createTodo } from '../../bussinesLogic/todos';
import { parseUserId , getToken } from '../../auth/utils'
import bodyParser from 'body-parser';
import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'

// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   // const newTodo: CreateTodoRequest = JSON.parse(event.body)
//   console.log(event);
//   // TODO: Implement creating a new TODO item
//   return undefined
// }


const app = express()
app.use(bodyParser.json());
app.post('/todos', async (_req, res) => {
  const authHeader = _req.headers.authorization
  const token = getToken(authHeader)
  const userId = parseUserId(token)
  const todo = await createTodo(_req.body,userId)
  res.set({
          'Access-Control-Allow-Origin': '*'
      });
  res.json({
    items: todo
  })
})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
