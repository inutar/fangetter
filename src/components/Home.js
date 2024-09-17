import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import jaLocale from "date-fns/locale/ja";

const Home = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusList, setStatusList] = useState({});
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [purchaseData, setPurchaseData] = useState([]);

  const navigate = useNavigate();

  const calculatePurchaseCounts = (orders) => {
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
      if (purchaseCounts[type] !== undefined) {
        purchaseCounts[type] += 1; // 各種類ごとの購入人数をカウント
      } else {
        purchaseCounts["その他"] += 1;
      }
    });

    return Object.values(purchaseCounts);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const getOrders = async () => {
      const data = await getDocs(collection(db, "orders"));
      const orders = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        // createdAt: doc.data().createdAt?.toDate() || new Date(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null, // nullに設定
      }));

      // 最新の注文を一番上に表示するために作成日付でソート
      // orders.sort((a, b) => b.createdAt - a.createdAt);

      // 最新の注文を一番上に表示し、createdAtがないものは下に表示するようにソート
      orders.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt - a.createdAt;
        } else if (a.createdAt) {
          return -1; // aがbより前
        } else if (b.createdAt) {
          return 1; // bがaより前
        } else {
          return 0; // 両方ともcreatedAtがない場合
        }
      });

      setOrderList(orders);
      setFilteredOrders(orders);

      const initialStatus = {};
      for (const order of orders) {
        if (!order.status) {
          order.status = "未";
          const orderDocRef = doc(db, "orders", order.id);
          await updateDoc(orderDocRef, { status: "未" });
        }
        initialStatus[order.id] = order.status;
      }
      setStatusList(initialStatus);

      const purchaseData = calculatePurchaseCounts(orders);
      setPurchaseData(purchaseData);
    };

    //   const purchaseCounts = {
    //     茶盌: 0,
    //     皿: 0,
    //     カップ: 0,
    //     酒盌: 0,
    //     オブジェ: 0,
    //     その他: 0,
    //   };

    //   orders.forEach((order) => {
    //     const type = order.orderInfo.selectedType;
    //     const quantity = Number(order.orderInfo.selectedQuantity);
    //     if (purchaseCounts[type] !== undefined) {
    //       purchaseCounts[type] += quantity;
    //     } else {
    //       purchaseCounts["その他"] += quantity;
    //     }
    //   });

    //   setPurchaseData(Object.values(purchaseCounts));
    // };

    getOrders();
  }, []);

  const handleNavigateToCustomerAnalysis = () => {
    navigate("/customeranalysis", { state: { purchaseData } });
    // console.log(purchaseData);
  };

  const calculateDaysRemaining = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDifference = deadlineDate - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    if (daysDifference <= 0) {
      return "終了";
    } else {
      return `${daysDifference} 日`;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ja-JP").format(price);
  };

  const editInfo = (orderId) => {
    navigate(`/edit-order/${orderId}`);
  };

  const toggleStatus = async (orderId) => {
    const currentStatus = statusList[orderId];
    const newStatus = currentStatus === "未" ? "完" : "未";

    setStatusList((prevStatusList) => ({
      ...prevStatusList,
      [orderId]: newStatus,
    }));

    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, { status: newStatus });
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatuses((prevStatuses) =>
      prevStatuses.includes(status)
        ? prevStatuses.filter((s) => s !== status)
        : [...prevStatuses, status]
    );
  };

  const handleSearch = () => {
    const filtered = orderList
      .filter((order) => {
        const matchesStatus =
          selectedStatuses.length > 0
            ? selectedStatuses.includes(order.status)
            : true;
        const matchesDate = selectedDate
          ? new Date(order.orderInfo.deadline) <= selectedDate
          : true;
        return matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.orderInfo.deadline);
        const dateB = new Date(b.orderInfo.deadline);
        return dateA - dateB; // 期限の近い順にソート
      });
    setFilteredOrders(filtered);
  };

  return (
    <>
      {!loading && (
        <>
          {!user ? (
            <Navigate to="/login" />
          ) : (
            <div className={styles.orderManagementPage}>
              <h1 className={styles.header}>受注管理</h1>
              <div className={styles.contentContainer}>
                <div className={styles.searchArea}>
                  <div className={styles.conditionContent}>
                    <div className={styles.searchCondition}>ステータス</div>
                    <FormGroup>
                      <FormControlLabel
                        onClick={() => handleStatusChange("未")}
                        control={<Checkbox color="default" />}
                        label="未"
                        sx={{ marginBottom: "-10px", marginTop: "-10px" }}
                      />
                      <FormControlLabel
                        onClick={() => handleStatusChange("完")}
                        control={<Checkbox color="default" />}
                        label="完"
                        sx={{ marginBottom: "-10px" }}
                      />
                    </FormGroup>
                  </div>
                  <div className={styles.conditionContent}>
                    <div className={styles.searchCondition}>期限</div>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      locale={jaLocale}
                    >
                      <DatePicker
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>

                  <Button
                    onClick={handleSearch}
                    variant="contained"
                    size="small"
                    sx={{ margin: "30px auto", display: "block" }}
                  >
                    検索
                  </Button>
                </div>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleNavigateToCustomerAnalysis}
                  // sx={{ marginTop: "20px" }}
                  sx={{ margin: "30px auto", display: "block" }}
                >
                  顧客分析
                </Button>

                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}></th>
                        <th className={styles.th}>受注情報</th>
                        <th className={styles.th}>期限</th>
                        <th className={styles.th}>あと</th>
                        <th className={styles.th}>
                          <FontAwesomeIcon
                            icon={faUser}
                            className={styles.icon}
                          />
                          顧客情報
                        </th>
                        <th className={styles.th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => {
                        const formattedDeadline = order.orderInfo.deadline
                          ? new Date(
                              order.orderInfo.deadline
                            ).toLocaleDateString()
                          : "";
                        const daysRemaining = order.orderInfo.deadline
                          ? calculateDaysRemaining(order.orderInfo.deadline)
                          : "";
                        return (
                          <tr key={index}>
                            <td
                              onClick={() => toggleStatus(order.id)}
                              className={styles.statusContainer}
                            >
                              <span
                                className={`${styles.status} ${
                                  statusList[order.id] === "未"
                                    ? styles["status-un"]
                                    : styles["status-com"]
                                }`}
                              >
                                {statusList[order.id]}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <div>種類: {order.orderInfo.selectedType}</div>
                              <div>詳細: {order.orderInfo.orderDetails}</div>
                              <div>
                                個数: {order.orderInfo.selectedQuantity}
                              </div>
                              <div>
                                ￥
                                {formatPrice(
                                  order.orderInfo.price *
                                    order.orderInfo.selectedQuantity
                                )}
                              </div>
                              <div>
                                （単価￥{formatPrice(order.orderInfo.price)}）
                              </div>
                            </td>
                            <td>{formattedDeadline}</td>
                            <td>{daysRemaining}</td>
                            <td className={styles.td}>
                              <div>{order.customerInfo.customerName}</div>
                              <div>{order.customerInfo.selectedGender}</div>
                              <div>{order.customerInfo.selectedAge}代</div>
                            </td>
                            <td>
                              <button
                                className={styles.editButton}
                                onClick={() => editInfo(order.id)}
                              >
                                編集
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
