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
import { Request } from "../../utils";
import { TextField, MenuItem, Box } from "@mui/material";

const monthToNum = (mmm) => {
  return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mmm) / 3 + 1;
};

const years = (back) => {
  const year = new Date().getFullYear();
  return Array.from({ length: back }, (v, i) => year - back + i + 1).sort(
    (a, b) => b - a
  );
};

export default function Chart({ variant }) {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const theme = useTheme();
  const [data, setData] = React.useState(undefined);

  React.useEffect(() => {
    Request.get("BillController/GetStatisticByYear/" + year).then((res) => {
      let filteredData = res.data;
      filteredData = Object.keys(filteredData).map((key) => {
        return {
          month: "Tháng " + monthToNum(key),
          amount: filteredData[key] / 1000000,
        };
      });
      setData(filteredData);
    });
  }, [year]);

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Title>
          {variant ? "Tổng doanh thu năm" : "Tổng doanh thu năm nay"}
        </Title>
        {variant && (
          <TextField
            sx={{ width: "8rem", marginLeft: "1rem" }}
            name='year'
            select
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {years(5).map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
          barSize={60}
        >
          <XAxis
            dataKey='month'
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position='left'
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Doanh thu (triệu vnd)
            </Label>
          </YAxis>
          <Tooltip />
          <Bar
            type='monotone'
            dataKey='amount'
            unit=' triệu VND'
            name='Doanh thu'
            fill={theme.palette.primary.main}
            radius={[16, 16, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
