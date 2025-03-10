import { Routes, Route } from "react-router-dom";
import Login from "../src/Components/Login.js";
import AdminDashboard from "./Components/Admindashboard.js";
import Usersaleform from "./Components/Usersaleform.js";
import Checkout from "./Components/Checkout.js";
import Salesdetails from  "./Components/Salesdetails.js"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/adminboard" element={<AdminDashboard />} />
      <Route path="/salesboard" element={<Usersaleform />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/salesdetails/:salesmanId" element={<Salesdetails />} />
    </Routes>
  );
};

export default App;
