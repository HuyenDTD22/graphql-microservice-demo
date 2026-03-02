import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "../App.css";

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      fullName
      email
      orders {
        id
        totalPrice
        products {
          name
          price
          quantity
        }
      }
    }
  }
`;

function UserPage() {
  const userId = "69a3bf5be6c1a3f9bf5a858e";
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  if (loading) return <div className="center">Loading...</div>;
  if (error) return <div className="center">Something went wrong.</div>;

  const user = data.user;

  return (
    <div className="page">
      <div className="container">
        <div className="user-card">
          <div>
            <h2 style={{ margin: 0 }}>{user.fullName}</h2>
            <p className="email">{user.email}</p>
          </div>
          <div className="badge">{user.orders.length} Orders</div>
        </div>

        <h3 className="section-title">Order History</h3>

        {user.orders.map((order, index) => (
          <div
            key={order.id}
            className="order-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <div className="order-header">
              <span className="order-title">Order #{index + 1}</span>
              <span className="order-total">
                ${order.totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="divider" />

            {order.products.map((p, i) => (
              <div key={i} className="product-row">
                <div className="product-name">{p.name}</div>
                <div className="product-price">${p.price.toLocaleString()}</div>
                <div className="product-qty">x{p.quantity}</div>
                <div className="product-total">
                  ${(p.price * p.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPage;
