import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import User from './../domain/users'
import { generateNonce } from "./../domain/utils";
const createError = require('http-errors');
const Joi = require('joi');

class NotFoundError extends Error { }

const apiSchema = Joi.object({
  body: Joi.object({
    publicAddress: Joi.string().required(),
    signature: Joi.string().required()
  }).required()
}).unknown();

const verifySignature = async (publicAddress, signature, nonce = process.env.defaultNonce) => {
  // TODO: Recover and verify signature
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {  
  try {
    console.log(event);
    event.body = JSON.parse(event.body);
    const {
      body: { publicAddress, signature },
    } = await apiSchema.validateAsync(event);

    let user = await User.get(publicAddress);
    if (!user) {

      verifySignature(publicAddress, signature)
      user = await User.create({ publicAddress });

      return {
        headers: { "Content-Type": "text/json" },
        statusCode: 200,
        body: JSON.stringify(user)
      };
    }
    verifySignature(publicAddress, signature, user.nonce)
    await User.update({ publicAddress }, { nonce: generateNonce() });

    return {
      headers: { "Content-Type": "text/json" },
      statusCode: 200,
      body: JSON.stringify(user) //TODO return a JWT
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


