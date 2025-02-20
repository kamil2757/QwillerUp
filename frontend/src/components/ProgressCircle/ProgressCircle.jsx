import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import styles from "./ProgressCircle.module.scss";

function ProgressCircle({ spentTime, goalTime, mini = false }) {
  const progress = (spentTime / goalTime) * 100;
  const chartSize = mini ? 200 : 300;
  const innerRadius = mini ? 90 : 130;
  const outerRadius = mini ? 90 : 130;
  const barSize = mini ? 10 : 16;

  const data = [
    { name: "background", value: 100, fill: "#2F3864" },
    { name: "Progress", value: Math.min(progress, 100), fill: "#7AD3F9" },
  ];

  return (
    <div className={styles.ProgressCircle_block}>
      <RadialBarChart
        width={chartSize}
        height={chartSize}
        data={data}
        cx={chartSize / 2}
        cy={chartSize / 2}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        barSize={barSize}
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
