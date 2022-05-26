import React from "react";
import { Grid } from "@mui/material";
import DataTable from "../../components/tableProducts";

const ProductsPage = () => {
  return (
    <Grid item xs={12}>
      <DataTable />
    </Grid>
  );
};

export default ProductsPage;
