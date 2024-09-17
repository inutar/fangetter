import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateMemo from "./components/CreateMemo";
// import PieChart from "./components/CustomerAnalysis";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import CustomerAnalysis from "./components/CustomerAnalysis";
// import { useLocation } from "react-router-dom";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "./firebase.js";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [purchaseData, setPurchaseData] = useState([]);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const data = await getDocs(collection(db, "orders"));
      const orders = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setOrderList(orders);

      const purchaseCounts = {
        茶盌: 0,
        皿: 0,
        カップ: 0,
        酒盌: 0,
        オブジェ: 0,
        その他: 0,
      };

      orders.forEach((order) => {
        const type = order.orderInfo.selectedType;
        const quantity = Number(order.orderInfo.selectedQuantity);
        if (purchaseCounts[type] !== undefined) {
          purchaseCounts[type] += quantity;
        } else {
          purchaseCounts["その他"] += quantity;
        }
      });

      setPurchaseData(Object.values(purchaseCounts));
    };

    getOrders();
  }, []);

  return (
    <Router>
      <Navbar isAuth={isAuth} purchaseData={purchaseData} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/creatememo"
          element={<CreateMemo isAuth={isAuth} />}
        ></Route>
        <Route
          path="/edit-order/:id"
          element={<CreateMemo isAuth={isAuth} />}
        />
        <Route
          path="/customeranalysis"
          element={<CustomerAnalysis purchaseData={purchaseData} />}
        ></Route>

        <Route path="/login" element={<Login setIsAuth={setIsAuth} />}></Route>
        <Route
          path="/logout"
          element={<Logout setIsAuth={setIsAuth} />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
