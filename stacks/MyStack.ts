import { StackContext, Api, Table, StaticSite } from "@serverless-stack/resources";
import * as sst from "@serverless-stack/resources";

export function MyStack({ stack }: sst.StackContext) {

  // const table = new sst.Table(stack, "SomeTable", {
  //   fields: {
  //     visitor: 'string'
  //   },
  //   primaryIndex: { partitionKey: "visitor" }
  // })
  // stack.setDefaultFunctionProps({
  //   environment: {
  //     tableName: table.tableName
  //   }
  // });
  const api = new sst.Api(stack, "api", {
    routes: {
      "GET /": "functions/lambda.handler",
      "GET /anotherroute": "functions/lambda.handler"
    },
  });

  // api.attachPermissions([table])
}
