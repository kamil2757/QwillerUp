import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import styles from "./ProgressCircle.module.scss";

function ProgressCircle({ spentTime, goalTime, mini = false, superMini = false, perfect_day}) {
  const progress = (spentTime / goalTime) * 100;
  const chartSize = mini ? superMini ? 140 : 200 : 300;
  const innerRadius = mini ? superMini ? 60 : 90 : 130;
  const outerRadius = mini ? superMini ? 60 : 90 : 130;
  const barSize = mini ? superMini ? 7 : 10 : 16;

  const data = [
    { name: "background", value: 100, fill: "#2F3864" },
    { name: "Progress", value: Math.min(progress, 100), fill: perfect_day ? "rgb(248, 188, 59)" : "#7AD3F9" },
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

      <h1>{progress ? `${Math.round(progress)}%` : 'Загрузка'}</h1>
    </div>
  );
}

export default ProgressCircle;
