import dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

import { generateNonce } from './utils';
// https://tomanagle.medium.com/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
export interface IUser extends Document {
  publicAddress: string;
  nonce: number;
  displayName: string;
}

const schema = new dynamoose.Schema(
  {
    publicAddress: {
      type: String,
      hashKey: true,
    },
    nonce: {
      type: Number,
      default: generateNonce(),
    },
    displayName: String,
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);

export default dynamoose.model<IUser>(process.env.tableName!, schema);
