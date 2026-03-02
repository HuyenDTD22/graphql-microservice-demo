const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

const typeDefs = gql`
  type User {
    id: ID!
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
    id: ID!
    userId: ID!
    userInfo: UserInfo
    items: [OrderItem]
    paymentMethod: String
    totalPrice: Float
    createdAt: String
    updatedAt: String
    products: [Product]
  }

  type Product {
    id: ID!
    name: String
    price: Float
    quantity: Int
  }

  type Query {
    user(id: ID!): User
    order(id: ID!): Order
  }

  type Mutation {
    createOrder(
      userId: ID!
      userInfo: UserInfoInput!
      items: [OrderItemInput!]!
      paymentMethod: String
    ): Order
  }

  input UserInfoInput {
    fullName: String!
    phone: String!
    address: String!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
    discountPercentage: Float
  }
`;

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      try {
        const res = await axios.get(`http://localhost:4001/users/${id}`);
        if (!res.data) return null;
        return {
          id: res.data._id,
          fullName: res.data.fullName,
          email: res.data.email,
        };
      } catch (err) {
        console.error("User Service error:", err.message);
        throw new Error("Không thể lấy thông tin user");
      }
    },

    order: async (_, { id }) => {
      try {
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
      } catch (err) {
        console.error("Order Service error:", err.message);
        throw new Error("Không thể lấy thông tin order");
      }
    },
  },

  User: {
    orders: async (parent) => {
      try {
        const res = await axios.get(
          `http://localhost:4002/orders?userId=${parent.id}`,
        );
        return res.data.map((order) => ({
          id: order._id,
          userId: order.userId,
          userInfo: order.userInfo,
          items: order.items,
          paymentMethod: order.paymentMethod,
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }));
      } catch (err) {
        console.error("Order Service error:", err.message);
        throw new Error("Không thể lấy danh sách orders");
      }
    },
  },

  Order: {
    products: async (parent) => {
      try {
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
      } catch (err) {
        console.error("Product Service error:", err.message);
        throw new Error("Không thể lấy thông tin sản phẩm");
      }
    },
  },

  Mutation: {
    createOrder: async (_, { userId, userInfo, items, paymentMethod }) => {
      try {
        const products = await Promise.all(
          items.map((i) =>
            axios.get(`http://localhost:4003/products/${i.productId}`),
          ),
        );

        let totalPrice = 0;
        const orderItems = items.map((item, index) => {
          const price = products[index].data.price;
          const discount = item.discountPercentage || 0;
          const finalPrice = price * (1 - discount / 100);
          totalPrice += finalPrice * item.quantity;
          return {
            productId: item.productId,
            price,
            discountPercentage: discount,
            quantity: item.quantity,
          };
        });

        const res = await axios.post("http://localhost:4002/orders", {
          userId,
          userInfo,
          items: orderItems,
          paymentMethod,
          totalPrice,
        });

        return { id: res.data._id, ...res.data };
      } catch (err) {
        console.error("Create order error:", err.message);
        throw new Error("Không thể tạo order");
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000).then(({ url }) => {
  console.log(`Gateway BFF running at ${url}`);
});
