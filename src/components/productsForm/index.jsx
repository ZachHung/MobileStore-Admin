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
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import LoadingButton from "@mui/lab/LoadingButton";
import { Request } from "../../utils";
import "../productsFormEdit/style.scss";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { capitalize } from "../../utils";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
  const [category, setCategory] = useState(false);
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [versions, setVersions] = useState([
    {
      VersionName: "",
      VersionColor: "",
      Color: [],
      VersionPrice: "",
    },
  ]);

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
    if (images.length < 4) setError(true);
    else {
      setLoading(true);
      const data = new FormData(event.currentTarget);
      const formData = {
        ProductName: data.get("ProductName"),
        Brand: data.get("Brand"),
        Category: data.get("Category"),
        Description: data.get("Description"),
        Memory: parseInt(data.get("Memory")),
        RAM: parseInt(data.get("RAM")),
        ScreenSize: parseFloat(data.get("ScreenSize")),
        Price: parseInt(data.get("Price")),
        Image1: images[0].filename,
        Image2: images[1].filename,
        Image3: images[2].filename,
        Image4: images[3].filename,
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
      Request.post("ProductController/AddProduct", formData)
        .then((res1) => {
          Request.post("ProductController/AddProductDetail", {
            ProductId: res1.data,
            Screen: data.get("Screen"),
            OS: data.get("OS"),
            FrontCamera: data.get("OS"),
            BackCamera: data.get("OS"),
            Chip: data.get("OS"),
            RAM: data.get("RAM") + "GB",
            Memory: data.get("Memory") + "GB",
            SIM: data.get("SIM"),
            Battery: data.get("Battery"),
          })
            .then((res2) => console.log("Add detail:" + res2.data))
            .catch((err) => console.log(err));
          for (let i = 0; i < versions.length; i++) {
            Request.post("ProductController/AddProductVersion", {
              ProductId: res1.data,
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
          setLoading(false);
          setTimeout(() => navigate("../products"), 250);
        });
    }
  };

  return (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
      <Box component='form' autoComplete='off' onSubmit={handleSubmit}>
        <Typography variant='h5' component='h2' sx={{ mb: 2 }}>
          Thông tin sản phẩm
        </Typography>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            name='ProductName'
            label='Tên sản phẩm'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Stack direction='row' spacing={3}>
            <TextField required name='Brand' label='Hãng' sx={{ flex: 0.9 }} />
            <TextField
              required
              name='Category'
              label='Phân loại'
              sx={{ flex: 0.9 }}
              select
              value={category}
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
              required
              name='Description'
              label='Mô tả sản phẩm'
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
              required
              name='Memory'
              type='number'
              label='Bộ nhớ trong'
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
              required
              name='RAM'
              type='number'
              label='RAM'
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
              required
              name='Price'
              label='Giá'
              type='number'
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
              required
              name='ScreenSize'
              label='Kích cỡ màn hình'
              type='number'
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

        <Typography variant='h5' component='h2' sx={{ mb: 2 }} mt={4}>
          Thông tin chi tiết
        </Typography>
        <Stack spacing={2}>
          <TextField required name='Screen' label='Màn hình' />
          <TextField required name='OS' label='Hệ điều hành' />
          <TextField required name='FrontCamera' label='Camera trước' />
          <TextField required name='BackCamera' label='Camera sau' />
          <TextField required name='Chip' label='Chipset' />
          <TextField required name='SIM' label='SIM' />
          <TextField required name='Battery' label='Pin' />

          <Typography variant='h5' component='h2' sx={{ mb: 2 }} mt={4}>
            Hình ảnh sản phẩm
          </Typography>
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
            {versions.map((version, index) => (
              <div key={index}>
                <Stack direction={"row"} spacing={2} alignItems='center'>
                  <TextField
                    required
                    name='VersionName'
                    onChange={(e) => handleChangeVersion(index, e)}
                    value={version.VersionName}
                    label='Tên phiên bản'
                    sx={{ flex: 1.5 }}
                  />
                  <TextField
                    required
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
                  {index ? (
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
                  ) : (
                    <Box
                      sx={{
                        width: "4rem",
                        aspectRatio: "1/1",
                      }}
                    ></Box>
                  )}
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
            Thêm sản phẩm
          </LoadingButton>
        </Stack>
      </Box>
    </Paper>
  );
}
