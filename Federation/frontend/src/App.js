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
