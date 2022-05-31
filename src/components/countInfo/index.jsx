import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import DescriptionIcon from "@mui/icons-material/Description";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { Request } from "../../utils";

const iconMap = {
  User: <PeopleIcon fontSize='large' sx={{ color: "#f9fafc" }} />,
  Product: <Inventory2Icon fontSize='large' sx={{ color: "#f9fafc" }} />,
  Bill: <DescriptionIcon fontSize='large' sx={{ color: "#f9fafc" }} />,
  Comment: <ReviewsIcon fontSize='large' sx={{ color: "#f9fafc" }} />,
};
const nameMap = {
  User: "Người dùng",
  Product: "Sản phẩm",
  Bill: "Đơn hàng",
  Comment: "Bình luận",
};

const CountInfo = () => {
  const [data, setData] = useState([
    {
      name: "User",
    },
    {
      name: "Product",
    },
    {
      name: "Bill",
    },
    {
      name: "Comment",
    },
  ]);
  const theme = useTheme();
  useEffect(() => {
    Request.get("BillController/GetCountInfo").then((res) => {
      let filteredData = res.data;
      filteredData = Object.keys(filteredData).map((key) => {
        return {
          name: key,
          value: filteredData[key],
        };
      });
      setData(filteredData);
    });
  }, []);
  return (
    data &&
    data.map((item, index) => (
      <Grid item xs={3} key={index}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            height: 150,
          }}
        >
          <Box
            sx={{
              borderRadius: 1,
              width: "40%",
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.primary.main,
            }}
          >
            {iconMap[item.name]}
          </Box>
          <Box
            sx={{
              borderRadius: 1,
              display: "flex",
              mt: -2,
              flexDirection: "column",
            }}
          >
            <Typography variant='h6' component='p' sx={{ ml: 2 }}>
              {nameMap[item.name]}
            </Typography>
            <Typography
              fontSize={"18px"}
              variant='body1'
              component='p'
              sx={{ ml: 2 }}
            >
              {item.value}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    ))
  );
};

export default CountInfo;
