import { Grid, Paper } from "@mui/material";
import React from "react";
import Chart from "../../components/chart";
import Orders from "../../components/order";
import ChartPie from "../../components/pieChart";
import CountInfo from "../../components/countInfo";

const SummaryPage = () => {
  return (
    <>
      <CountInfo />
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 400,
          }}
        >
          <Chart />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Orders />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 400,
          }}
        >
          <ChartPie />
        </Paper>
      </Grid>
    </>
  );
};

export default SummaryPage;
