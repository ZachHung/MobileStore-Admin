import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { Request, changeToVND } from "../../utils";
import Skeleton from "@mui/material/Skeleton";
import { useSelector, useDispatch } from "react-redux";
import { error, fetching, success } from "../../redux/userSlice";
import moment from "moment";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "Id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "CreateAt",
    numeric: false,
    disablePadding: true,
    label: "Ngày đặt hàng",
  },
  {
    id: "TypeProduct",
    numeric: false,
    disablePadding: true,
    label: "Phân loại sản phẩm",
  },
  {
    id: "Quantity",
    numeric: false,
    disablePadding: true,
    label: "Số lượng",
  },
  {
    id: "TotalPrice",
    numeric: false,
    disablePadding: true,
    label: "Tổng tiền",
  },
  {
    id: "Status",
    numeric: false,
    disablePadding: true,
    label: "Trạng thái",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold" }}
          >
            {headCell.id !== "options" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = () => {
  const theme = useTheme();
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant='h6'
        color={theme.palette.primary.main}
        id='tableTitle'
        component='div'
      >
        Đơn hàng gần đây
      </Typography>
    </Toolbar>
  );
};
export default function EnhancedTable() {
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("CreateAt");
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);

  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetching());
    Request.get("BillController/GetAllBill")
      .then((res) => {
        dispatch(success());
        let filteredData = res.data
          .filter((item) => !item.IsDelete || item.Status !== 3)
          .map(({ CreateAt, Status, ...rest }) => {
            return {
              ...rest,
              CreateAt: moment(CreateAt, "DD/MM/YYYY").valueOf(),
              Status:
                Status === 0
                  ? "Đang giao"
                  : Status === 1 || Status === 2
                  ? "Đã giao"
                  : "Đã huỷ",
            };
          });
        setData(filteredData);
      })
      .catch((err) => {
        dispatch(error);
        console.log(err);
      });
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <>
      {!state.isFetching ? (
        <EnhancedTableToolbar />
      ) : (
        <Skeleton variant='text' width='77%'>
          <Typography variant='h2'>.</Typography>
        </Skeleton>
      )}
      {!state.isFetching ? (
        <>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby='tableTitle'
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {data
                  .slice()
                  .sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        tabIndex={-1}
                        key={row.Id}
                      >
                        <TableCell component='th' id={labelId} scope='row'>
                          {row.Id}
                        </TableCell>
                        <TableCell padding='none'>
                          {moment(row.CreateAt).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell padding='none'>{row.TypeProduct}</TableCell>
                        <TableCell padding='none'>{row.Quantity}</TableCell>
                        <TableCell padding='none'>
                          {changeToVND(row.TotalPrice)}
                        </TableCell>
                        <TableCell padding='none'>{row.Status}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Skeleton variant='rectangular' width='100' height='30rem'></Skeleton>
      )}
    </>
  );
}
