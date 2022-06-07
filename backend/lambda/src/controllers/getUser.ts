import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import * as yup from 'yup';
import * as createError from 'http-errors';
import User from '../domain/users';

const apiSchema = yup.object().shape({
  pathParameters: yup
    .object({
      publicAddress: yup
        .string()
        .matches(/^0x[a-fA-F0-9]{40}$/)
        .required(),
    })
    .required(),
});

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    console.log(event);
    const {
      pathParameters: { publicAddress },
    } = await apiSchema.validate(event);
    const user = await User.get({ publicAddress });

    return {
      headers: {
        'Content-Type': 'text/json',
      },
      statusCode: 200,
      body: JSON.stringify(
        user ?? {
          publicAddress,
          nonce: process.env.defaultNonce,
        }
      ),
    };
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return new createError.BadRequest(error.message);
      }
      throw error;
    }
    throw Error('error caught not instance of Error');
  }
};
