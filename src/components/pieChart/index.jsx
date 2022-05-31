import { useTheme, Box, TextField, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Request } from "../../utils";
import Title from "../title";

const years = (back) => {
  const year = new Date().getFullYear();
  let arr = Array.from({ length: back }, (v, i) => year - back + i + 1).sort(
    (a, b) => b - a
  );
  arr.unshift("all");
  return arr;
};

const ChartPie = ({ variant }) => {
  const theme = useTheme();
  const [year, setYear] = useState("all");
  const [data, setData] = useState([]);

  const colorsMap = {
    Cancel: theme.palette.error.main,
    Delivering: theme.palette.secondary.main,
    Delivered: theme.palette.primary.main,
    Completed: theme.palette.primary.dark,
  };

  useEffect(() => {
    Request.get(
      `${
        year !== "all"
          ? `BillController/GetStatusAllBillByYear/${year}`
          : "BillController/GetStatusAllBill"
      }`
    ).then((res) => {
      let filteredData = res.data;
      filteredData = Object.keys(filteredData)
        .map((key) => {
          return {
            name:
              key === "Delivering"
                ? "Đang giao"
                : key === "Delivered"
                ? "Đã giao"
                : key === "Completed"
                ? "Đã đánh giá"
                : "Đã huỷ",
            value: filteredData[key],
            color: colorsMap[key],
          };
        })
        .filter((item) => item.value > 0);
      setData(filteredData);
    });
  }, [year]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>Thống kê trạng thái đơn hàng</Title>
        <TextField
          sx={{ width: "8rem" }}
          name='year'
          select
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {years(5).map((y) => (
            <MenuItem key={y} value={y}>
              {y === "all" ? "Tất cả" : y}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart width={400} height={400}>
          <Pie
            dataKey='value'
            animationDuration={600}
            data={data}
            cx='50%'
            cy='50%'
            fill={theme.palette.primary.main}
            label={(entry) => entry.name}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartPie;
