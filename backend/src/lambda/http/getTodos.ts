import 'source-map-support/register'
import { getAllTodos } from '../../bussinesLogic/todos';
import { parseUserId , getToken } from '../../auth/utils'
import * as express from 'express'
import bodyParser from 'body-parser';
import * as awsServerlessExpress from 'aws-serverless-express'

// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
const app = express()
app.use(bodyParser.json());
app.get('/todos', async (_req, res) => {
  const authHeader = _req.headers.authorization
  const token = getToken(authHeader)
  const userId = parseUserId(token)
  const todos = await getAllTodos(userId)
  res.set({
          'Access-Control-Allow-Origin': '*'
      });
  res.json({
    items: todos
  })
})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }

//
// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   // TODO: Get all TODO items for a current user
//
//
// }
