// import 'source-map-support/register'
//
// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//
// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   // const todoId = event.pathParameters.todoId
//   console.log(event);
//   // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
//   return undefined
// }



import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as uuid from 'uuid'
import * as express from 'express'
import bodyParser from 'body-parser';
import * as awsServerlessExpress from 'aws-serverless-express'
import { parseUserId , getToken } from '../../auth/utils'

const XAWS = AWSXRay.captureAWS(AWS)
// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
const docClient = new XAWS.DynamoDB.DocumentClient()
const app = express()
app.use(bodyParser.json())
app.post('/todos/:todoId/attachment', async (_req, res) => {
  const authHeader = _req.headers.authorization
  const token = getToken(authHeader)
  const userId = parseUserId(token)
  const todoId = _req.params.todoId
  const bucket = process.env.S3_BUCKET
  const url_exp = process.env.SIGNED_URL_EXPIRATION
  const todosTable = process.env.Todods_TABLE

  const imageId = uuid.v4()

  const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })

  const url = s3.getSignedUrl('putObject',{
    Bucket: bucket,
    Key: imageId,
    Expires: url_exp
  })

  const imageUrl = `https://${bucket}.s3.amazonaws.com/${imageId}`

  const updateUrlOnTodo = {
    TableName: todosTable,
    Key:{
        "todoId": todoId,
        "userId":userId
    },
    UpdateExpression: "set attachmentUrl = :a",
    ExpressionAttributeValues:{
      ":a": imageUrl
  },
  ReturnValues:"UPDATED_NEW"
  }

  console.log("updateUrlOnTodo")
  console.log(updateUrlOnTodo)
  await docClient.update(updateUrlOnTodo).promise()

  res.set({
          'Access-Control-Allow-Origin': '*'
      });
  res.json({
    uploadUrl: url
  })



})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
