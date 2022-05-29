import { Grid } from "@mui/material";
import React from "react";
import DataTable from "../../components/tableBills";
import EditForm from "../../components/billsEdit";

const OrdersPage = ({ edit }) => {
  return edit ? (
    <Grid item xs={12}>
      <EditForm />
    </Grid>
  ) : (
    <Grid item xs={12}>
      <DataTable />
    </Grid>
  );
};

export default OrdersPage;
