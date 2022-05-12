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
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import LockIcon from "@mui/icons-material/Lock";
import { visuallyHidden } from "@mui/utils";
import AddIcon from "@mui/icons-material/Add";
import { Request } from "../../utils/api";
import Skeleton from "@mui/material/Skeleton";
import { useSelector, useDispatch } from "react-redux";
import { error, fetching, success } from "../../redux/userSlice";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { LockOpen } from "@mui/icons-material";

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
    id: "FullName",
    numeric: false,
    disablePadding: true,
    label: "Tên khách hàng",
  },
  {
    id: "UserName",
    numeric: false,
    disablePadding: true,
    label: "Username",
  },
  {
    id: "Birthday",
    numeric: false,
    disablePadding: true,
    label: "Ngày sinh",
  },
  {
    id: "PhoneNumber",
    numeric: false,
    disablePadding: true,
    label: "SĐT",
  },
  {
    id: "Email",
    numeric: false,
    disablePadding: true,
    label: "Email",
  },
  {
    id: "Gender",
    numeric: false,
    disablePadding: true,
    label: "Giới tính",
  },
  {
    id: "options",
    numeric: true,
    disablePadding: false,
    label: "Tuỳ chọn",
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
        Danh Sách Hoá Đơn
      </Typography>
    </Toolbar>
  );
};
const ModaleDelete = ({ modalState, setModalState, handleConfirm, type }) => {
  const onConfirm = () => {
    handleConfirm();
    setModalState(false);
  };
  console.log(type);
  return (
    <Modal
      open={modalState}
      onClose={() => setModalState(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "1rem",
          p: 4,
        }}
      >
        <Typography
          id='modal-modal-title'
          variant='h5'
          component='h5'
          textAlign='center'
        >
          {type === "delete"
            ? "Khoá tài khoản khách hàng ?"
            : "Khôi phục tài khoản khách hàng ?"}
        </Typography>
        <Stack
          spacing={2}
          direction='row'
          justifyContent='flex-end'
          sx={{ mt: 4 }}
        >
          <Button variant='text' onClick={() => setModalState(false)}>
            Huỷ
          </Button>
          <Button variant='contained' onClick={onConfirm}>
            {type === "delete" ? "Khoá" : "Khôi phục"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [modalState, setModalState] = React.useState(false);
  const [modalRestore, setModalRestore] = React.useState(false);
  const [selected, setSelected] = React.useState(0);

  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleConfirm = (id) => {
    let indexID = data.findIndex((item) => item.Id === id);
    let newData = [...data];
    if (!newData[indexID].IsDelete) {
      newData[indexID].IsDelete = true;
      setData(newData);
      Request.get("AccountController/DeleteAccount/" + id).catch((err) =>
        console.log(err)
      );
    } else {
      newData[indexID].IsDelete = false;
      setData(newData);
      Request.get("AccountController/RestoreAccount/" + id).catch((err) =>
        console.log(err)
      );
    }
  };

  React.useEffect(() => {
    dispatch(fetching());
    Request.get("AccountController/GetAllAccount")
      .then((res) => {
        dispatch(success());
        let filteredData = res.data
          .filter((item) => item.Role !== "Admin")
          .map(({ PassWord, Role, ...others }) => others);
        console.log(filteredData);
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

  const handleOnClick = (id, isDelete) => {
    setSelected(id);
    !isDelete ? setModalState(true) : setModalRestore(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <>
      {!state.isFetching && (
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label='Phiên bản thu gọn '
        />
      )}
      <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
        {!state.isFetching ? (
          <EnhancedTableToolbar />
        ) : (
          <Skeleton variant='text' width='77%'>
            <Typography variant='h2'>.</Typography>
          </Skeleton>
        )}
        {!state.isFetching ? (
          <>
            <ModaleDelete
              type={"delete"}
              modalState={modalState}
              setModalState={setModalState}
              handleConfirm={() => handleConfirm(selected)}
            />
            <ModaleDelete
              type={"restore"}
              modalState={modalRestore}
              setModalState={setModalRestore}
              handleConfirm={() => handleConfirm(selected)}
            />
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
                          <TableCell padding='none'>{row.FullName}</TableCell>
                          <TableCell padding='none'>{row.UserName}</TableCell>
                          <TableCell padding='none'>{row.Birthday}</TableCell>
                          <TableCell padding='none'>
                            {row.PhoneNumber}
                          </TableCell>
                          <TableCell padding='none'>{row.Email}</TableCell>
                          <TableCell padding='none'>
                            {!row.Gender ? "Nam" : "Nữ"}
                          </TableCell>
                          <TableCell align='right'>
                            <Tooltip
                              title={
                                !row.IsDelete
                                  ? "Khoá người dùng"
                                  : "Khôi phục người dùng"
                              }
                              placement='left'
                              arrow
                            >
                              <IconButton
                                onClick={() =>
                                  handleOnClick(row.Id, row.IsDelete)
                                }
                                aria-label={
                                  !row.IsDelete ? "delete" : "restore"
                                }
                                size={dense ? "small" : "medium"}
                                // sx={{
                                //   "&:hover": {
                                //     color: theme.palette.error.main,
                                //     backgroundColor: `rgba(211,47,47, 0.04)`,
                                //   },
                                // }}
                              >
                                {!row.IsDelete ? <LockIcon /> : <LockOpen />}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
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
      </Paper>
    </>
  );
}
