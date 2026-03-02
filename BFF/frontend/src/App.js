// import React from "react";
// import { gql, useQuery } from "@apollo/client";
// import "./App.css";

// const GET_USER = gql`
//   query GetUser($id: ID!) {
//     user(id: $id) {
//       fullName
//       email
//       orders {
//         totalPrice
//         products {
//           name
//           price
//           quantity
//         }
//       }
//     }
//   }
// `;

// function App() {
//   const userId = "69a3bf5be6c1a3f9bf5a858e";

//   const { loading, error, data } = useQuery(GET_USER, {
//     variables: { id: userId },
//   });

//   if (loading) return <div className="center">Loading...</div>;
//   if (error) return <div className="center">Something went wrong.</div>;

//   const user = data.user;

//   return (
//     <div className="page">
//       <div className="container">
//         {/* User Info */}
//         <div className="user-card">
//           <div>
//             <h2 style={{ margin: 0 }}>{user.fullName}</h2>
//             <p className="email">{user.email}</p>
//           </div>
//           <div className="badge">{user.orders.length} Orders</div>
//         </div>

//         <h3 className="section-title">Order History</h3>

//         {user.orders.map((order, index) => (
//           <div key={index} className="order-card">
//             <div className="order-header">
//               <span className="order-title">Order #{index + 1}</span>
//               <span className="order-total">
//                 ${order.totalPrice.toLocaleString()}
//               </span>
//             </div>

//             <div className="divider" />

//             {/* Table Header */}
//             <div className="table-header">
//               <div>Product</div>
//               <div style={{ textAlign: "right" }}>Price</div>
//               <div style={{ textAlign: "center" }}>Quantity</div>
//               <div style={{ textAlign: "right" }}>Total</div>
//             </div>

//             <div className="divider-light" />

//             {/* Products */}
//             {order.products.map((p, i) => (
//               <div key={i} className="product-row">
//                 <div className="product-name">{p.name}</div>
//                 <div className="product-price">${p.price.toLocaleString()}</div>
//                 <div className="product-qty">x{p.quantity}</div>
//                 <div className="product-total">
//                   ${(p.price * p.quantity).toLocaleString()}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserPage from "./pages/UserPage";
import OrderDetailPage from "./pages/OrderDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
