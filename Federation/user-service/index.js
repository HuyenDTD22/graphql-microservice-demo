const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");

const database = require("./config/database");
database.connect();

const User = require("./models/user.model");

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    fullName: String
    email: String
    phone: String
    gender: String
    address: String
  }

  type Query {
    user(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await User.findById(id);
      if (!user) return null;
      return {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
      };
    },
  },

  User: {
    __resolveReference: async ({ id }) => {
      const user = await User.findById(id);
      if (!user) return null;
      return {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
      };
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, { listen: { port: 4001 } });
