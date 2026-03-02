const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");

const database = require("./config/database");
database.connect();

const Product = require("./models/product.model");

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String
    price: Float
    description: String
    stock: Int
  }

  type Query {
    product(id: ID!): Product
  }
`;

const resolvers = {
  Query: {
    product: async (_, { id }) => {
      const product = await Product.findById(id);
      if (!product) return null;
      return {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
      };
    },
  },

  Product: {
    __resolveReference: async ({ id }) => {
      const product = await Product.findById(id);
      if (!product) return null;
      return {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
      };
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, { listen: { port: 4003 } });
