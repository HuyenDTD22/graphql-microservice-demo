const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");

const database = require("./config/database");
database.connect();

const Order = require("./models/order.model");

const typeDefs = gql`
  type Order @key(fields: "id") {
    id: ID!
    user: User
    userInfo: UserInfo
    paymentMethod: String
    totalPrice: Float
    createdAt: String
    products: [OrderProduct]
  }

  type OrderProduct {
    product: Product
    quantity: Int
  }

  type UserInfo {
    fullName: String
    phone: String
    address: String
  }

  type User @key(fields: "id") {
    id: ID!
    orders: [Order]
  }

  type Product @key(fields: "id") {
    id: ID!
  }

  type Query {
    order(id: ID!): Order
  }
`;

const resolvers = {
  Query: {
    order: async (_, { id }) => {
      const order = await Order.findById(id);
      if (!order) return null;

      return {
        id: order._id.toString(),
        user: { id: order.userId.toString() },
        userInfo: order.userInfo,
        paymentMethod: order.paymentMethod,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt.toISOString(),
        products: order.items.map((item) => ({
          product: { id: item.productId.toString() },
          quantity: item.quantity,
        })),
      };
    },
  },

  User: {
    orders: async (user) => {
      const orders = await Order.find({ userId: user.id });

      return orders.map((order) => ({
        id: order._id.toString(),
        totalPrice: order.totalPrice,
        products: order.items.map((item) => ({
          product: { id: item.productId.toString() },
          quantity: item.quantity,
        })),
      }));
    },
  },

  Order: {
    __resolveReference: async ({ id }) => {
      const order = await Order.findById(id);
      return order ? mapOrder(order) : null;
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, { listen: { port: 4002 } });
