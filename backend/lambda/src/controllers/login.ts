import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import * as yup from 'yup';
import * as createError from 'http-errors';
import User from '../domain/users';
import { generateNonce } from '../domain/utils';

class NotFoundError extends Error {}

const apiSchema = yup.object({
  body: yup
    .object({
      publicAddress: yup.string().required(),
      signature: yup.string().required(),
    })
    .required(),
});

const verifySignature = async (
  publicAddress: string,
  signature: string,
  nonce: number = Number(process.env.defaultNonce!)
) => {
  // TODO: Recover and verify signature
  console.log(publicAddress, signature, nonce);
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log(event);
    const {
      body: { publicAddress, signature },
    } = await apiSchema.validate({
      ...event,
      body: event.body && JSON.parse(event.body),
    });

    let user = await User.get(publicAddress);
    if (!user) {
      verifySignature(publicAddress, signature);
      user = await User.create({ publicAddress });

      return {
        headers: { 'Content-Type': 'text/json' },
        statusCode: 200,
        body: JSON.stringify(user),
      };
    }
    verifySignature(publicAddress, signature, user.nonce);
    await User.update({ publicAddress }, { nonce: generateNonce() });

    return {
      headers: { 'Content-Type': 'text/json' },
      statusCode: 200,
      body: JSON.stringify(user), // TODO return a JWT
    };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return new createError.BadRequest(error.message);
      }
      if (error instanceof NotFoundError) {
        return new createError.NotFound(error.message);
      }
      throw error;
    }
    throw Error('error caught not instance of Error');
  }
};
