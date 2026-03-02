const { ApolloServer } = require("@apollo/server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
const { startStandaloneServer } = require("@apollo/server/standalone");

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "user", url: "http://localhost:4001" },
      { name: "order", url: "http://localhost:4002" },
      { name: "product", url: "http://localhost:4003" },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
});

startStandaloneServer(server, { listen: { port: 4000 } });
