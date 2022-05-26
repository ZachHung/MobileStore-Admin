import React from "react";
import { Grid } from "@mui/material";
import ProductsForm from "../../components/productsForm";
import ProductsEdit from "../../components/productsFormEdit";

const ProductsFormPage = ({ edit }) => {
  return !edit ? (
    <Grid item xs={12}>
      <ProductsForm />
    </Grid>
  ) : (
    <Grid item xs={12}>
      <ProductsEdit />
    </Grid>
  );
};

export default ProductsFormPage;
