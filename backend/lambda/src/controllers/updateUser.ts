import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import * as yup from 'yup';
import * as createError from 'http-errors';

import User from '../domain/users';

class NotFoundError extends Error {}

const apiSchema = yup.object().shape({
  body: yup
    .object({
      displayName: yup.string(),
    })
    .required(),
  requestContext: yup
    .object({
      authorizer: yup
        .object({
          publicAddress: yup.string().required(),
        })
        .required(),
    })
    .required(),
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log(event);
    const {
      body: { displayName },
      requestContext: {
        authorizer: { publicAddress },
      },
    } = await apiSchema.validate({
      ...event,
      body: event.body && JSON.parse(event.body),
    });

    const user = await User.get(publicAddress);
    if (!user) throw new NotFoundError('User Not Found');

    await User.update({ publicAddress }, { displayName });

    return {
      headers: { 'Content-Type': 'text/json' },
      statusCode: 200,
      body: JSON.stringify(user),
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
