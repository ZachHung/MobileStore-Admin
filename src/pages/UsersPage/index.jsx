import React from "react";
import { Grid } from "@mui/material";
import DataTable from "../../components/tableUsers";

const UsersPage = () => {
  return (
    <Grid item xs={12}>
      <DataTable />
    </Grid>
  );
};

export default UsersPage;
