// TableComponent.js
import React from "react";

const OrderTable = ({ data = [] }) => (
  <table>
    <thead>
      <tr>
        <th>ステータス</th>
        <th>受注情報</th>
        <th>期限</th>
        <th>あと</th>
        <th>顧客情報</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <td>{row.status}</td>
          <td>{row.orderInfo}</td>
          <td>{row.deadline}</td>
          <td>{row.remaining}</td>
          <td>{row.customerInfo}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default OrderTable;
