import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenNib,
  faHouse,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ isAuth, purchaseData }) => {
  return (
    <nav>
      {!isAuth ? (
        <Link to="/login">ログイン</Link>
      ) : (
        <>
          <Link to="/">
            <FontAwesomeIcon icon={faHouse} className="iconUser" />
            ホーム
          </Link>
          {/* <Link to={{ pathname: "/customeranalysis", state: { purchaseData } }}>
            <FontAwesomeIcon icon={faRightFromBracket} className="iconUser" />
            顧客分析
          </Link> */}
          <Link to="/creatememo">
            <FontAwesomeIcon icon={faPenNib} className="iconUser" />
            メモ登録
          </Link>
          <Link to="/logout">
            <FontAwesomeIcon icon={faRightFromBracket} className="iconUser" />
            ログアウト
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
