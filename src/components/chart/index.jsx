import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "../title";

// Generate Sales Data
function createData(month, amount) {
  return { month: "Tháng " + month, amount };
}

const data = [
  createData("1", 0),
  createData("2", 400),
  createData("3", 800),
  createData("3", 1200),
  createData("4", 1600),
  createData("5", 2000),
  createData("6", 2400),
  createData("7", 2800),
  createData("9", 3200),
  createData("10", 3600),
  createData("11", 4000),
  createData("12", 4400),
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Năm nay</Title>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}>
          <XAxis
            dataKey='month'
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}>
            <Label
              angle={270}
              position='left'
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}>
              Doanh thu (vnd)
            </Label>
          </YAxis>
          <Tooltip />
          <Bar
            isAnimationActive={false}
            type='monotone'
            dataKey='amount'
            fill={theme.palette.primary.main}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
