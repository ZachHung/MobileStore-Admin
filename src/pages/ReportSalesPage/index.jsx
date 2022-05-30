import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Chart from "../../components/chart";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { changeToVND, Request } from "../../utils";
import "moment/locale/vi";

moment.locale("vi");

const ReportSalesPage = () => {
  const [date, setDate] = React.useState(moment());
  const [data, setData] = React.useState(undefined);

  useEffect(() => {
    Request.get(
      `BillController/GetBillByDay/${moment(date.valueOf()).format("D/M/YYYY")}`
    ).then((res) => {
      let filteredData = {};
      filteredData.Sales = res.data.length;
      filteredData.TotalRevenue = res.data.reduce((a, b) => {
        return a + b.TotalPrice;
      }, 0);
      filteredData.ProductCount = res.data.reduce((a, b) => {
        return a + b.Quantity;
      }, 0);
      setData(filteredData);
    });
  }, [date]);

  return (
    <>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 450,
          }}
        >
          <Chart variant />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container>
            <Box sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <Typography variant='h5' component='h5' color='primary'>
                Thống kê doanh thu theo ngày
              </Typography>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale={"vi-VN"}
              >
                <DatePicker
                  label='Chọn ngày, tháng, năm'
                  value={date}
                  inputFormat='DD/MM/YYYY'
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>

            <Typography variant='h5' component='p' sx={{ my: 2 }}>
              Doanh thu:
              <Typography
                variant='h4'
                component='span'
                sx={{ my: 2, mx: 2 }}
                color='primary'
              >
                {data && changeToVND(data.TotalRevenue)}
              </Typography>
            </Typography>
            <Typography variant='h5' component='p' sx={{ my: 2 }}>
              Số đơn hàng đã bán:
              <Typography
                variant='h4'
                component='span'
                sx={{ my: 2, mx: 2 }}
                color='primary'
              >
                {data && data.Sales}
              </Typography>
            </Typography>
            <Typography variant='h5' component='p' sx={{ my: 2 }}>
              Số sản phẩm đã bán:
              <Typography
                variant='h4'
                component='span'
                sx={{ my: 2, mx: 2 }}
                color='primary'
              >
                {data && data.ProductCount}
              </Typography>
            </Typography>
          </Container>
        </Paper>
      </Grid>
    </>
  );
};

export default ReportSalesPage;
