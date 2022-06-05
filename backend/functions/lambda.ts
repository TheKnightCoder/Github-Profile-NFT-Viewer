import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {  
  console.log(process.env.tableName);
  let count = 5;
  count = 4
  count = 3
  count = 1
  count = 2
  
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, World 2! ${count}`,
  };
};
