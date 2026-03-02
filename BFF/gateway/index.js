const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

const typeDefs = gql`
  type User {
    id: ID
    fullName: String
    email: String
    orders: [Order]
  }

  type UserInfo {
    fullName: String
    phone: String
    address: String
  }

  type OrderItem {
    productId: ID
    price: Float
    discountPercentage: Float
    quantity: Int
  }

  type Order {
    id: ID
    userId: ID
    userInfo: UserInfo
    items: [OrderItem]
    paymentMethod: String
    totalPrice: Float
    createdAt: String
    updatedAt: String
    products: [Product]
  }

  type Product {
    id: ID
    name: String
    price: Float
    quantity: Int
  }

  type Query {
    user(id: ID!): User
    order(id: ID!): Order
  }
`;

const resolvers = {
  Query: {
    // Lấy user
    user: async (_, { id }) => {
      console.log("Calling User Service");
      const res = await axios.get(`http://localhost:4001/users/${id}`);

      if (!res.data) return null;

      return {
        id: res.data._id,
        fullName: res.data.fullName,
        email: res.data.email,
      };
    },

    // Lấy chi tiết 1 order
    order: async (_, { id }) => {
      console.log("Calling Order Service (single order)");

      const res = await axios.get(`http://localhost:4002/orders/${id}`);

      if (!res.data) return null;

      return {
        id: res.data._id,
        userId: res.data.userId,
        userInfo: res.data.userInfo,
        items: res.data.items,
        paymentMethod: res.data.paymentMethod,
        totalPrice: res.data.totalPrice,
        createdAt: res.data.createdAt,
        updatedAt: res.data.updatedAt,
      };
    },
  },

  User: {
    // Lấy tất cả orders của user
    orders: async (parent) => {
      console.log("Calling Order Service");

      const res = await axios.get(
        `http://localhost:4002/orders?userId=${parent.id}`,
      );

      return res.data.map((order) => ({
        id: order._id,
        totalPrice: order.totalPrice,
        items: order.items,
      }));
    },
  },
  Order: {
    products: async (parent) => {
      console.log("Calling Product Service");

      const productRequests = parent.items.map((item) =>
        axios.get(`http://localhost:4003/products/${item.productId}`),
      );

      const responses = await Promise.all(productRequests);

      return responses.map((res, index) => ({
        id: res.data._id,
        name: res.data.name,
        price: res.data.price,
        quantity: parent.items[index].quantity,
      }));
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000).then(({ url }) => {
  console.log(`Gateway running at ${url}`);
});
