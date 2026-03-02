import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

const GET_ORDER_DETAIL = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      paymentMethod
      totalPrice
      createdAt
      userInfo {
        fullName
        phone
        address
      }
      products {
        name
        price
        quantity
      }
    }
  }
`;

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_ORDER_DETAIL, {
    variables: { id },
  });

  if (loading) return <div className="center">Loading...</div>;
  if (error) return <div className="center">Something went wrong.</div>;

  const order = data.order;

  return (
    <div className="page">
      <div className="container">
        <button onClick={() => navigate("/")} style={{ marginBottom: 20 }}>
          ← Back
        </button>

        <div className="order-card">
          <div className="order-header">
            <span className="order-title">Order Detail</span>
            <span className="order-total">
              ${order.totalPrice.toLocaleString()}
            </span>
          </div>

          <div style={{ marginTop: 10, fontSize: 14 }}>
            <strong>Payment:</strong> {order.paymentMethod}
          </div>

          <div style={{ fontSize: 14 }}>
            <strong>Created:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </div>

          <div style={{ marginTop: 12 }}>
            <strong>Customer Info:</strong>
            <div>{order.userInfo.fullName}</div>
            <div>{order.userInfo.phone}</div>
            <div>{order.userInfo.address}</div>
          </div>

          <div className="divider" />

          <div className="table-header">
            <div>Product</div>
            <div style={{ textAlign: "right" }}>Price</div>
            <div style={{ textAlign: "center" }}>Quantity</div>
            <div style={{ textAlign: "right" }}>Total</div>
          </div>

          <div className="divider-light" />

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
      </div>
    </div>
  );
}

export default OrderDetailPage;
