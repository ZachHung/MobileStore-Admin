import {
  Paper,
  Stack,
  Typography,
  LinearProgress,
  MenuItem,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { changeToVND, Request } from "../../utils";
import { useParams } from "react-router-dom";

const statuses = [
  {
    label: "Đang giao",
    value: 0,
  },
  {
    label: "Đã giao",
    value: 1,
  },
];

export default function FormPropsTextFields() {
  const [orderData, setOrderData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [isChanged, setChanged] = useState(false);
  const { id } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    Request.get(`BillController/ChangeBillStatus/${id}/${status}`)
      .catch((err) => console.log(err))
      .finally(() => {
        setChanged((prev) => !prev);
      });
  };

  useEffect(() => {
    setLoading(true);
    let data = {};
    Request.get("BillController/GetBillById/" + id)
      .then((resOG) => {
        data = resOG.data;
        Request.get("ProductController/GetProductByID/" + resOG.data.ProductId)
          .then((res) => (data.ProductId = res.data))
          .then(() =>
            Request.get(
              "ShipmentController/GetShipmentById/" + resOG.data.ShipmentId
            ).then((res) => (data.ShipmentId = res.data))
          )
          .then(() =>
            Request.get(
              "AccountController/GetAccountById/" + resOG.data.AccountId
            ).then((res) => {
              data.AccountId = res.data;
              setStatus(data.Status);
              setOrderData(data);
              setLoading(false);
            })
          );
      })
      .catch((err) => console.log(err));
  }, [id, isChanged]);

  return !isLoading ? (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }} className='new-page'>
      <Box
        component='form'
        autoComplete='off'
        onSubmit={(e) => handleSubmit(e)}
      >
        <Typography variant='h5' component='h2' sx={{ mb: 2 }}>
          Thông tin hoá đơn
        </Typography>
        <Stack spacing={2}>
          <Stack spacing={2} direction='row'>
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='AccountName'
              label='Khách hàng'
              value={orderData.AccountId?.FullName}
            />
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='AccountId'
              label='Mã khách hàng'
              value={orderData.AccountId?.Id}
            />
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='CreateAt'
              label='Ngày đặt hàng'
              value={orderData.CreateAt}
            />
            <TextField
              select={status === 0 || status === 1}
              fullWidth
              inputProps={{
                readOnly: !(status === 0 || status === 1),
              }}
              name='Status'
              label='Trạng thái'
              value={
                status === 2 ? "Đã đánh giá" : status === 3 ? "Đã huỷ" : status
              }
              onChange={
                status === 0 || status === 1
                  ? (e) => setStatus(e.target.value)
                  : null
              }
            >
              {status === 0 || status === 1
                ? statuses.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))
                : null}
            </TextField>
          </Stack>
          {status === 3 ? (
            <TextField
              inputProps={{
                readOnly: !(status === 0 || status === 1),
              }}
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              name='Reason'
              label='Lí do huỷ đơn hàng'
              defaultValue={orderData.Reason}
            />
          ) : null}
          <Typography variant='h5' component='h2' sx={{ mb: 2 }}>
            Thông tin vận chuyển
          </Typography>
          <Stack spacing={2} direction='row'>
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='ShipmentName'
              label='Người nhận hàng'
              value={orderData.ShipmentId?.FullName}
            />
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='ShipmentPhone'
              label='Số điện thoại'
              value={orderData.ShipmentId?.PhoneNumber}
            />
          </Stack>
          <TextField
            fullWidth
            inputProps={{ readOnly: true }}
            name='Address'
            label='Địa chỉ'
            value={
              orderData.ShipmentId?.Street +
              ", " +
              orderData.ShipmentId?.Address
            }
          />
          <Typography variant='h5' component='h2' sx={{ mb: 2 }}>
            Thông tin sản phẩm
          </Typography>
          <Stack spacing={2} direction='row'>
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='ProductName'
              label='Tên sản phẩm'
              value={orderData.ProductId?.ProductName}
            />
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='ProductId'
              label='Mã sản phẩm'
              value={orderData.ProductId?.Id}
            />
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='TypeProduct'
              label='Tuỳ chọn'
              value={orderData.TypeProduct}
            />
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='Quantity'
              label='Tuỳ chọn'
              value={orderData.Quantity}
            />
            <TextField
              fullWidth
              inputProps={{ readOnly: true }}
              name='Giá tiền'
              label='Tuỳ chọn'
              value={orderData.ProductId?.Price}
            />
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Typography
            variant='h5'
            component='h2'
            sx={{ my: 2, alignSelf: "flex-end" }}
          >
            Tổng cộng: {changeToVND(orderData.TotalPrice)}
          </Typography>
          <LoadingButton
            loading={isLoading}
            variant='contained'
            size='large'
            sx={{
              width: "fit-content",
              height: "fit-content",
              alignSelf: "flex-end",
              marginTop: "4rem !important",
              fontSize: "1.25rem",
            }}
            type='submit'
          >
            Sửa Hoá đơn
          </LoadingButton>
        </Stack>
      </Box>
    </Paper>
  ) : (
    <Box sx={{ height: "80vh", width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
