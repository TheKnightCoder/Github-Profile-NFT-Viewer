import * as sst from "@serverless-stack/resources";

export function MyStack({ stack }: sst.StackContext) {

  const authTable = new sst.Table(stack, "authTable", {
    fields: {
      publicAddress: 'string',
      nonce: 'number',
      displayName: 'string'
    },
    primaryIndex: { partitionKey: "publicAddress" }
  })

  stack.setDefaultFunctionProps({
    environment: {
      tableName: authTable.tableName,
      defaultNonce: 'authenticate',
      authSecret: 'sometestsecret' // TODO: Move secret to SSM
    }
  });

  const api = new sst.Api(stack, "api", {
    authorizers: {
      Authorizer: {
        type: "lambda",
        function: new sst.Function(stack, "Authorizer", {
          handler: "src/controllers/authorizer.handler",
        }),
      },
    },
    routes: {
      "GET /users/{publicAddress}": "src/controllers/getUser.handler", //get user detail and nonce (public)
      "POST /login": "src/controllers/login.handler", //login and return JWT + update nonce (public)
      "PATCH /users/{publicAddress}": {
        authorizer: "Authorizer",
        function: "src/controllers/updateUser.handler"
      } //edit user displayName (auth)
    },
  });

  api.attachPermissions([authTable, "grantFullAccess"])
}
