import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import User from './../domain/users'

const createError = require('http-errors');
const Joi = require('joi');

class NotFoundError extends Error { }

const apiSchema = Joi.object({
  body: Joi.object({
    displayName: Joi.string()
  }).required(),
  requestContext: Joi.object({
    authorizer: Joi.object({
      publicAddress: Joi.string().required()
    }).required().unknown()
  }).required().unknown()
}).unknown();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {  
  try {

    console.log(event);
    event.body = JSON.parse(event.body);
    const {
      body: { displayName },
    } = await apiSchema.validateAsync(event);
    const publicAddress = event.requestContext.authorizer.publicAddress


    // const publicAddress = event.pathParameters?.publicAddress // joi validate this
    let user = await User.get(publicAddress);
    if (!user) throw new NotFoundError('User Not Found');

    await user.update({ publicAddress }, { displayName });

    return {
      headers: { "Content-Type": "text/json" },
      statusCode: 200,
      body: JSON.stringify(user)
    };
  
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: error.message
      };
    }
    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        body: error.message
      };
    }
    throw error;
  }
};


