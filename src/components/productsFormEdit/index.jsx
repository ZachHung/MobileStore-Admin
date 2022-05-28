import {
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Typography,
  Button,
  FormHelperText,
  IconButton,
  Chip,
  Tooltip,
  ImageList,
  ImageListItem,
  LinearProgress,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import LoadingButton from "@mui/lab/LoadingButton";
import { Request } from "../../utils";
import { useParams } from "react-router-dom";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "./style.scss";

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { capitalize } from "../../utils";
import { Delete } from "@mui/icons-material";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);
const categories = [
  {
    value: true,
    label: "Máy tính bảng",
  },
  {
    value: false,
    label: "Điện thoại",
  },
];
export default function FormPropsTextFields() {
  const [productData, setProductData] = useState(undefined);
  const [productVersions, setProductVersions] = useState([]);
  const [, setCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isChanged, setChanged] = useState(false);
  const { id } = useParams();

  const [versions, setVersions] = useState([]);

  const handleChangeVersion = (index, e) => {
    let data = [...versions];
    data[index][e.target.name] = capitalize(e.target.value);
    setVersions(data);
  };
  const handleAddColor = (event, index) => {
    event.preventDefault();
    let data = [...versions];
    data[index].Color.push(data[index].VersionColor);
    data[index].VersionColor = "";
    setVersions(data);
  };
  const handleRemoveColor = (event, i, j) => {
    event.preventDefault();
    let data = [...versions];
    data[i].Color.splice(j, 1);
    setVersions(data);
  };
  const handleAddVersion = (event) => {
    event.preventDefault();
    let newVersion = {
      VersionName: "",
      Color: [],
      VersionPrice: "",
    };
    setVersions([...versions, newVersion]);
  };
  const handleRemoveVersion = (e, index) => {
    e.preventDefault();
    let data = [...versions];
    data.splice(index, 1);
    setVersions(data);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (images.length < 4 && images.length > 0) setError(true);
    else {
      setLoading(true);
      const data = new FormData(event.currentTarget);
      const formData = {
        Id: id,
        ProductName: data.get("ProductName"),
        Brand: data.get("Brand"),
        Category: data.get("Category"),
        Description: data.get("Description"),
        Memory: parseInt(data.get("Memory")),
        RAM: parseInt(data.get("RAM")),
        ScreenSize: parseFloat(data.get("ScreenSize")),
        Price: parseInt(data.get("Price")),
        Image1:
          images.length === 0
            ? productData.Image1.split("/")[6]
            : images[0].filename,
        Image2:
          images.length === 0
            ? productData.Image2.split("/")[6]
            : images[1].filename,
        Image3:
          images.length === 0
            ? productData.Image3.split("/")[6]
            : images[2].filename,
        Image4:
          images.length === 0
            ? productData.Image4.split("/")[6]
            : images[3].filename,
      };
      for (let index = 0; index < images.length; ++index) {
        let imageForm = new FormData();
        imageForm.append("files", images[index].file);
        Request.post("ProductController/UploadProductImage", imageForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((res) => Promise.resolve(res.status));
      }
      Request.post("ProductController/UpdateProduct", formData)
        .then((res1) => {
          for (let i = 0; i < versions.length; i++) {
            Request.post("ProductController/AddProductVersion", {
              ProductId: id,
              VersionName: versions[i].VersionName,
              Color: versions[i].Color.join("|"),
              Price: versions[i].VersionPrice,
            })
              .then((res) => console.log("Add version:" + res.data))
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setImages([]);
          setChanged((prev) => !prev);
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    Request.get("ProductController/GetProductByID/" + id)
      .then((res) => {
        setCategory(res.data.Category);
        setProductData(res.data);
        Request.get("ProductController/GetProductVersionByProductId/" + id)
          .then((res) => {
            setProductVersions(
              res.data.map(({ Color, ...rest }) => {
                return {
                  Color: Color.split("|"),
                  ...rest,
                };
              })
            );
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id, isChanged]);

  return !isLoading ? (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
      <Box component='form' autoComplete='off' onSubmit={handleSubmit}>
        <Typography variant='h5' component='h2' sx={{ mb: 2 }}>
          Thông tin sản phẩm
        </Typography>
        <Stack spacing={3}>
          <TextField
            fullWidth
            name='ProductName'
            label='Tên sản phẩm'
            defaultValue={productData?.ProductName}
          />
          <Stack direction='row' spacing={3}>
            <TextField
              name='Brand'
              label='Hãng'
              sx={{ flex: 0.9 }}
              defaultValue={productData?.Brand}
            />
            <TextField
              name='Category'
              label='Phân loại'
              sx={{ flex: 0.9 }}
              select
              defaultValue={productData?.Category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              sx={{ flex: 1.88 }}
              name='Description'
              label='Mô tả sản phẩm'
              defaultValue={productData?.Description}
              multiline
              minRows={3}
              maxRows={6}
            />
          </Stack>
          <Stack
            direction='row'
            spacing={3}
            sx={{ "& .MuiTextField-root": { flex: 1 } }}
          >
            <TextField
              name='Memory'
              type='number'
              label='Bộ nhớ trong'
              defaultValue={productData?.Memory}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 9999,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
                endAdornment: (
                  <InputAdornment position='end'>GB</InputAdornment>
                ),
              }}
            />
            <TextField
              name='RAM'
              type='number'
              label='RAM'
              defaultValue={productData?.RAM}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 9999,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
                endAdornment: (
                  <InputAdornment position='end'>GB</InputAdornment>
                ),
              }}
            />
            <TextField
              name='Price'
              label='Giá'
              type='number'
              defaultValue={productData?.Price}
              InputProps={{
                inputProps: {
                  min: 0,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
                endAdornment: <InputAdornment position='end'>đ</InputAdornment>,
              }}
            />
            <TextField
              name='ScreenSize'
              label='Kích cỡ màn hình'
              type='number'
              defaultValue={productData?.ScreenSize}
              InputProps={{
                inputProps: {
                  min: 0,
                  inputMode: "decimal",
                  pattern: "[0-9]*",
                  step: "0.01",
                },
                endAdornment: (
                  <InputAdornment position='end'>inch</InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Typography variant='h5' component='h2' sx={{ mb: 2 }} mt={4}>
            Hình ảnh sản phẩm
          </Typography>

          <ImageList
            sx={{ width: "100%", height: 350, mb: 4 }}
            cols={4}
            rowHeight={164}
          >
            <ImageListItem>
              <img src={productData?.Image1} alt='' loading='lazy' />
            </ImageListItem>
            <ImageListItem>
              <img src={productData?.Image2} alt='' loading='lazy' />
            </ImageListItem>
            <ImageListItem>
              <img src={productData?.Image3} alt='' loading='lazy' />
            </ImageListItem>
            <ImageListItem>
              <img src={productData?.Image4} alt='' loading='lazy' />
            </ImageListItem>
          </ImageList>
          <FilePond
            className={error === true ? "error" : ""}
            files={images}
            onupdatefiles={setImages}
            allowMultiple={true}
            maxFiles={4}
            checkValidity={true}
            name='images'
            itemInsertLocation='after'
            acceptedFileTypes={["image/png", "image/jpeg"]}
            credits={false}
            labelIdle='Kéo thả 4 hình ảnh hoặc <span class="filepond--label-action">Tải ảnh lên</span>'
          />
          {error === true && (
            <FormHelperText sx={{ marginTop: "0 !important" }} error>
              Bạn cần chọn đủ 4 hình ảnh
            </FormHelperText>
          )}
          <Typography variant='h5' component='h2' sx={{ mb: 2 }} mt={4}>
            Phiên bản sản phẩm
          </Typography>
          <Stack spacing={2}>
            {productVersions?.map((version, index) => (
              <div key={index}>
                <Stack direction={"row"} spacing={2} alignItems='center'>
                  <TextField
                    name='VersionName'
                    defaultValue={version.VersionName}
                    label='Tên phiên bản'
                    inputProps={{ readOnly: true }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    name='VersionPrice'
                    label='Giá'
                    defaultValue={version.Price}
                    type='number'
                    sx={{ flex: 1 }}
                    InputProps={{
                      inputProps: {
                        readOnly: true,
                        min: 0,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      },
                      endAdornment: (
                        <InputAdornment position='end'>đ</InputAdornment>
                      ),
                    }}
                  />
                  <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    sx={{ mt: 2, flex: 2.15 }}
                  >
                    {version.Color.map((col, i) => (
                      <Chip key={i} label={col} />
                    ))}
                  </Stack>
                </Stack>
              </div>
            ))}
          </Stack>
          <Typography variant='h6' component='h3' mb={1} mt={2}>
            Thêm Tuỳ chọn
          </Typography>
          <Stack spacing={2}>
            {versions.map((version, index) => (
              <div key={index}>
                <Stack direction={"row"} spacing={2} alignItems='center'>
                  <TextField
                    name='VersionName'
                    onChange={(e) => handleChangeVersion(index, e)}
                    value={version.VersionName}
                    label='Tên phiên bản'
                    sx={{ flex: 1.5 }}
                  />
                  <TextField
                    name='VersionPrice'
                    label='Giá'
                    value={version.VersionPrice}
                    onChange={(e) => handleChangeVersion(index, e)}
                    type='number'
                    sx={{ flex: 1.5 }}
                    InputProps={{
                      inputProps: {
                        min: 0,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      },
                      endAdornment: (
                        <InputAdornment position='end'>đ</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    name='VersionColor'
                    value={version.VersionColor}
                    onChange={(e) => handleChangeVersion(index, e)}
                    label='Tên màu'
                    sx={{ flex: 1.5 }}
                  />
                  <Button
                    disabled={!version.VersionColor}
                    variant='outlined'
                    sx={{ flex: 1, height: "3.5rem" }}
                    onClick={(e) => handleAddColor(e, index)}
                  >
                    Thêm màu
                  </Button>
                  <Tooltip title='Xoá phiên bản'>
                    <IconButton
                      color='error'
                      variant='outlined'
                      sx={{
                        width: "4rem",
                        aspectRatio: "1/1",
                      }}
                      onClick={(e) => handleRemoveVersion(e, index)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  alignItems={"center"}
                  justifyContent='center'
                  sx={{ mt: 2 }}
                >
                  {version.Color.map((col, i) => (
                    <Chip
                      key={i}
                      label={col}
                      onDelete={(e) => handleRemoveColor(e, index, i)}
                    />
                  ))}
                </Stack>
              </div>
            ))}
          </Stack>
          <Button
            variant='contained'
            size='large'
            sx={{
              width: "fit-content",
              height: "fit-content",
              alignSelf: "flex-end",
            }}
            onClick={handleAddVersion}
          >
            Thêm tuỳ chọn
          </Button>

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
            Sửa sản phẩm
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
