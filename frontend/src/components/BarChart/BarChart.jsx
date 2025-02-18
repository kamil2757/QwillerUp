import styles from "./BarChart.module.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Rectangle,
} from "recharts";

const data = [
  { day: "Пн", hours: 3, perfect: false },
  { day: "Вт", hours: 5, perfect: false },
  { day: "Ср", hours: 7, perfect: true },
  { day: "Чт", hours: 2, perfect: false },
  { day: "Пт", hours: 6, perfect: false },
  { day: "Сб", hours: 8, perfect: false },
  { day: "Вс", hours: 4, perfect: false },
];

function BarChartProfile() {
  return (
    <ResponsiveContainer width="90%" height="85%">
      <BarChart data={data} barCategoryGap="67%">
        <XAxis
          dataKey="day"
          tick={{ fill: "white" }}
          axisLine={false}
          tickLine={false}
          tickMargin={14}
        />
        <YAxis
          tick={{ fill: "white" }}
          axisLine={false}
          tickLine={false}
          tickMargin={30}
        />
        <Tooltip
          cursor={{ fill: "rgba(122, 211, 249, 0.1)" }}
          contentStyle={{
            backgroundColor: "rgb(47, 56, 100)",
            borderRadius: "8px",
            border: "none",
            padding: "10px",
            color: "#fff",
          }}
          formatter={(value) => {
            return [
              <span style={{color: 'white'}}>часов: {value}</span>
            ]
          }}
        />
        <Bar
          dataKey="hours"
          shape={(props) => (
            <Rectangle
              {...props}
              fill={
                props.payload.perfect
                  ? "rgb(248, 188, 59)"
                  : "rgb(122, 211, 249)"
              }
              radius={18}
            />
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartProfile;
