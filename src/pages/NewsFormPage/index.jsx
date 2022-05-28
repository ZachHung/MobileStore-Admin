import React from "react";
import { Grid } from "@mui/material";
import AddForm from "../../components/newsForm";
import EditForm from "../../components/newsFormEdit";

const NewsFormPage = ({ edit }) => {
  return !edit ? (
    <Grid item xs={12}>
      <AddForm />
    </Grid>
  ) : (
    <Grid item xs={12}>
      <EditForm />
    </Grid>
  );
};

export default NewsFormPage;
