import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { Box, ButtonGroup, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./CreateMemo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faComments } from "@fortawesome/free-solid-svg-icons";

const CreateMemo = ({ isAuth }) => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [customerName, setCustomerName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [orderDetails, setOrderDetails] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }

    if (id) {
      // 編集モードの場合、既存の注文情報を取得
      const getOrder = async () => {
        const orderDoc = await getDoc(doc(db, "orders", id));
        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          setCustomerName(orderData.customerInfo.customerName);
          setSelectedGender(orderData.customerInfo.selectedGender);
          setSelectedAge(orderData.customerInfo.selectedAge);
          setSelectedType(orderData.orderInfo.selectedType);
          setSelectedQuantity(orderData.orderInfo.selectedQuantity);
          setOrderDetails(orderData.orderInfo.orderDetails);
          setPrice(orderData.orderInfo.price);
          setDeadline(
            orderData.orderInfo.deadline
              ? new Date(orderData.orderInfo.deadline)
              : null
          );
        }
      };
      getOrder();
    }
  }, [isAuth, navigate, id]);

  const handleGenderClick = (gender) => {
    setSelectedGender(gender);
  };

  const handleAgeClick = (age) => {
    setSelectedAge(age);
  };

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const saveMemo = async () => {
    if (id) {
      // 編集モードの場合、既存の注文を更新
      const orderDoc = doc(db, "orders", id);
      await updateDoc(orderDoc, {
        customerInfo: {
          customerName,
          selectedGender,
          selectedAge,
        },
        orderInfo: {
          selectedType,
          selectedQuantity,
          orderDetails,
          price,
          deadline: deadline ? deadline.toISOString() : null,
        },
      });
    } else {
      // 新規作成モードの場合、新しい注文を追加
      await addDoc(collection(db, "orders"), {
        customerInfo: {
          customerName,
          selectedGender,
          selectedAge,
        },
        orderInfo: {
          selectedType,
          selectedQuantity,
          orderDetails,
          price,
          deadline: deadline ? deadline.toISOString() : null,
        },
        createdAt: serverTimestamp(),
      });
    }
    navigate("/");
  };

  // カスタムスタイル
  const buttonStyles = {
    outlined: {
      borderColor: "gray",
      color: "gray",
    },
    contained: {
      backgroundColor: "gray",
      color: "white",
    },
  };

  return (
    <div className="createMemoPage">
      <div className="postContainer">
        <div className="infoTitle">
          顧客情報
          <FontAwesomeIcon icon={faUser} className="iconUser" />
        </div>
        <div className="inputPost">
          <div>氏名</div>
          <input
            type="text"
            placeholder="氏名を記入"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="inputPost">
          <div>性別</div>
          <Box
            sx={{ display: "flex", alignItems: "center", "& > *": { m: 1 } }}
          >
            <ButtonGroup variant="outlined">
              <Button
                onClick={() => handleGenderClick("男")}
                variant={selectedGender === "男" ? "contained" : "outlined"}
                sx={
                  selectedGender === "男"
                    ? buttonStyles.contained
                    : buttonStyles.outlined
                }
              >
                男
              </Button>
              <Button
                onClick={() => handleGenderClick("女")}
                variant={selectedGender === "女" ? "contained" : "outlined"}
                sx={
                  selectedGender === "女"
                    ? buttonStyles.contained
                    : buttonStyles.outlined
                }
              >
                女
              </Button>
              <Button
                onClick={() => handleGenderClick("その他")}
                variant={selectedGender === "その他" ? "contained" : "outlined"}
                sx={
                  selectedGender === "その他"
                    ? buttonStyles.contained
                    : buttonStyles.outlined
                }
              >
                その他
              </Button>
            </ButtonGroup>
          </Box>
        </div>
        <div className="inputPost">
          <div>年齢</div>
          <Box
            sx={{ display: "flex", alignItems: "center", "& > *": { m: 1 } }}
          >
            <ButtonGroup variant="outlined">
              {["20", "30", "40", "50", "60", "70", "80", "90", "100"].map(
                (age) => (
                  <Button
                    key={age}
                    onClick={() => handleAgeClick(age)}
                    variant={selectedAge === age ? "contained" : "outlined"}
                    sx={
                      selectedAge === age
                        ? buttonStyles.contained
                        : buttonStyles.outlined
                    }
                  >
                    {age}
                  </Button>
                )
              )}
            </ButtonGroup>
          </Box>
        </div>
        <div className="infoTitle">
          注文情報
          <FontAwesomeIcon icon={faComments} className="iconUser" />
        </div>
        <div className="inputPost">
          <div>種類</div>
          <Box
            sx={{ display: "flex", alignItems: "center", "& > *": { m: 1 } }}
          >
            <ButtonGroup variant="outlined">
              {[
                "茶盌",
                "皿",
                "カップ",
                "酒盌",
                "オブジェ",
                // "花入",
                "その他",
              ].map((type) => (
                <Button
                  key={type}
                  onClick={() => handleTypeClick(type)}
                  variant={selectedType === type ? "contained" : "outlined"}
                  sx={
                    selectedType === type
                      ? buttonStyles.contained
                      : buttonStyles.outlined
                  }
                >
                  {type}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        </div>
        <div className="inputPost">
          <div>個数</div>
          <input
            type="number"
            placeholder="個数を記入"
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(e.target.value)}
          />
        </div>
        <div className="inputPost">
          <div>詳細</div>
          <textarea
            placeholder="詳細を記入"
            value={orderDetails}
            onChange={(e) => setOrderDetails(e.target.value)}
          ></textarea>
        </div>
        <div className="inputPost">
          <div>単価</div>
          <input
            type="number"
            placeholder="価格を記入"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="inputPost">
          <div>期限</div>
          <div className="inputDeadline">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </div>
        <button onClick={saveMemo} className="postButton">
          {id ? "更新する" : "登録する"}
        </button>{" "}
      </div>
    </div>
  );
};

export default CreateMemo;
