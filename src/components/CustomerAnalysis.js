import React from "react";
import { useLocation } from "react-router-dom";
import PieChart from "./PieChart";

const CustomerAnalysis = () => {
  const location = useLocation();
  const { purchaseData } = location.state || { purchaseData: [] };

  return (
    <div>
      <PieChart data={purchaseData} />
    </div>
  );
};

export default CustomerAnalysis;
