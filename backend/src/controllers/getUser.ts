import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import User from './../domain/users'
const Joi = require('joi');

const apiSchema = Joi.object({
  pathParameters: Joi.object({
    publicAddress: Joi.string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .required()
  }).required().unknown()
}).unknown();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {  
  try {
    console.log(event);
    const {
      pathParameters: { publicAddress },
    } = await apiSchema.validateAsync(event);

    let user = await User.get({publicAddress});
    if (!user) {
      user = {
        publicAddress,
        nonce: process.env.defaultNonce
      }
    }

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
    throw error;
  }
};


