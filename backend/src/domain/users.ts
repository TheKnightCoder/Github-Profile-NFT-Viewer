const dynamoose = require("dynamoose");
import { generateNonce } from "./utils";
const schema = new dynamoose.Schema({
  publicAddress: {
    haskKey: true,
    type: String
  },
  nonce: {
    type: Number,
    default: generateNonce()
  },
  displayName: String
}, {
  saveUnknown: true,
  timestamps: true
});

export default dynamoose.model(process.env.tableName, schema);