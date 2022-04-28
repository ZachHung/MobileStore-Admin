import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import ForumIcon from "@mui/icons-material/Forum";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Link as RouterLink } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={RouterLink} to='/'>
      <ListItemIcon>
        <SummarizeIcon />
      </ListItemIcon>
      <ListItemText primary='Tổng Quan' />
    </ListItemButton>
    <ListItemButton component={RouterLink} to='/orders'>
      <ListItemIcon>
        <DescriptionIcon />
      </ListItemIcon>
      <ListItemText primary='Hoá đơn' />
    </ListItemButton>
    <ListItemButton component={RouterLink} to='/users'>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary='Khách hàng' />
    </ListItemButton>
    <ListItemButton component={RouterLink} to='/products'>
      <ListItemIcon>
        <CategoryIcon />
      </ListItemIcon>
      <ListItemText primary='Sản phẩm' />
    </ListItemButton>
    <ListItemButton component={RouterLink} to='/comments'>
      <ListItemIcon>
        <ForumIcon />
      </ListItemIcon>
      <ListItemText primary='Bình luận' />
    </ListItemButton>
    <ListItemButton component={RouterLink} to='/news'>
      <ListItemIcon>
        <NewspaperIcon />
      </ListItemIcon>
      <ListItemText primary='Tin tức' />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component='div' inset>
      Thống kê
    </ListSubheader>
    <ListItemButton component={RouterLink} to='/sales'>
      <ListItemIcon>
        <AnalyticsIcon />
      </ListItemIcon>
      <ListItemText primary='Doanh thu' />
    </ListItemButton>
    <ListItemButton component={RouterLink} to='/popular'>
      <ListItemIcon>
        <AnalyticsIcon />
      </ListItemIcon>
      <ListItemText primary='Bán chạy' />
    </ListItemButton>
  </React.Fragment>
);
