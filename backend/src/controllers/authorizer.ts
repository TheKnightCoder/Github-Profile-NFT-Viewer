import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {  
  console.log(process.env.tableName); //TODO: create custom authorizer
  return {
    headers: { "Content-Type": "text/json" },
    statusCode: 200,
    body: JSON.stringify(event),
  };
};
