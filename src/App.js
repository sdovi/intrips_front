import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./Pages/Main";
import CategoryPage from "./Components/CategoryPage/CategoryPage";
import ViewProduct from "./Components/VIew_product/View_product";
import CartPage from "./CartPage/CartPage";
import ClientChat from "./Components/Chat/ClientChat";
import AdminChat from "./Components/Chat/AdminChat";
import WebSocketChat from "./Components/Chat/ClientChat";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/category/" element={<ViewProduct/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/admin" element={<AdminChat/>} />
        <Route path="/chat" element={<WebSocketChat/>} />
      </Routes>
      <ClientChat/>
    </div>
  );
}

export default App;
