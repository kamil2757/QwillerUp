// import React from "react";
// import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

// const ProgressCircle = ({ spentTime, goalTime }) => {
//   const percentage = Math.min((spentTime / goalTime) * 100, 100);

//   const data = [
//     { name: "Background", value: 100, fill: "#2F3864" },
//     { name: "Progress", value: percentage, fill: "#7AD3F9" },
//   ];

//   return (
//     <div
//       style={{
//         textAlign: "center",
//         position: "relative",
//         width: "300px",
//         height: "300px",
//       }}
//     >
//       <RadialBarChart
//         width={300}
//         height={300}
//         cx={150}
//         cy={150}
//         innerRadius={140}
//         outerRadius={140}
//         barSize={15}
//         data={data}
//         startAngle={90}
//         endAngle={-270} // Ограничиваем прогресс
//       >
//         <RadialBar dataKey="value" clockWise={true} cornerRadius={50} />
//       </RadialBarChart>
//       <div
//         style={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           fontSize: "42px",
//           fontWeight: "300",
//           color: "#ffffff",
//         }}
//       >
//         {Math.round(percentage)}%
//       </div>
//     </div>
//   );
// };

// export default ProgressCircle;

import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import styles from './ProgressCircle.module.scss'

function ProgressCircle({ spentTime, goalTime }) {
  const progress = (spentTime / goalTime) * 100;

  const data = [
    { name: "background", value: 100, fill: "#2F3864" },
    { name: "Progress", value: Math.min(progress, 100), fill: "#7AD3F9" },
  ];

  return (
    <div className={styles.ProgressCircle_block}>
      <RadialBarChart
        width={300}
        height={300}
        data={data}
        cx={150}
        cy={150}
        innerRadius={130}
        outerRadius={130}
        barSize={16}
        startAngle={90}
        endAngle={-270}
      >
        <RadialBar dataKey="value" cornerRadius={50}></RadialBar>
      </RadialBarChart>

      <h1>{Math.round(progress)}%</h1>
    </div>
  );
}

export default ProgressCircle;
