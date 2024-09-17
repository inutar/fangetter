// import React from "react";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const PieChart = (props) => {
//   const numberOfPurchasersData = {
//     labels: ["茶盌", "皿", "カップ", "酒盌", "オブジェ", "その他"],
//     datasets: [
//       {
//         label: "# of Votes",
//         data: props.data,
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(54, 162, 235, 0.2)",
//           "rgba(255, 206, 86, 0.2)",
//           "rgba(75, 192, 192, 0.2)",
//           "rgba(153, 102, 255, 0.2)",
//           "rgba(255, 159, 64, 0.2)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//           "rgba(255, 159, 64, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div style={{ width: "500px", height: "500px" }}>
//       <h2>人気ランキング（種類ごとの購入者数）</h2>
//       <Pie data={numberOfPurchasersData} />
//     </div>
//   );
// };

// export default PieChart;

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props) => {
  // データとラベルを一緒にするために配列を作成
  const dataWithLabels = props.data.map((value, index) => ({
    value,
    label: ["茶盌", "皿", "カップ", "酒盌", "オブジェ", "その他"][index],
  }));

  // データを値の降順にソート
  dataWithLabels.sort((a, b) => b.value - a.value);

  // ソートされたデータからラベルとデータを抽出
  const sortedLabels = dataWithLabels.map((item) => item.label);
  const sortedData = dataWithLabels.map((item) => item.value);

  const numberOfPurchasersData = {
    labels: sortedLabels,
    datasets: [
      {
        label: "# of Purchasers",
        data: sortedData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "500px", height: "500px" }}>
      <h2>人気ランキング（種類ごとの購入者数）</h2>
      <Pie data={numberOfPurchasersData} />
    </div>
  );
};

export default PieChart;
