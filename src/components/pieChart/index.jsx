import { useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Request } from "../../utils";
import Title from "../title";

const ChartPie = ({ variant }) => {
  const theme = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    Request.get(
      `${
        !variant
          ? `BillController/GetStatusAllBillByYear/${new Date().getFullYear()}`
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
          };
        })
        .filter((item) => item.value > 0);
      setData(filteredData);
    });
  }, [variant]);

  return (
    <>
      <Title>
        {!variant
          ? "Thống kê trạng thái đơn hàng"
          : "Thống kê trạng thái đơn hàng năm nay"}
      </Title>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart width={400} height={400}>
          <Pie
            dataKey='value'
            data={data}
            cx='50%'
            cy='50%'
            fill={theme.palette.primary.main}
            label={(entry) => entry.name}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartPie;
