import { Paper, Stack, Typography, LinearProgress } from "@mui/material";
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

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

export default function FormPropsTextFields() {
  const [postData, setPostData] = useState({});
  const [images, setImages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isChanged, setChanged] = useState(false);
  const { id } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const formData = {
      Id: id,
      Title: data.get("Title"),
      Link: data.get("Link"),
      Image:
        images.length === 0 ? postData.Image.split("/")[6] : images[0].filename,
    };
    console.log(formData);
    for (let index = 0; index < images.length; ++index) {
      let imageForm = new FormData();
      imageForm.append("files", images[index].file);
      Request.post("PostController/UploadPostImage", imageForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    Request.post("PostController/UpdatePost", formData)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err))
      .finally(() => {
        setImages([]);
        setChanged((prev) => !prev);
      });
  };

  useEffect(() => {
    setLoading(true);
    Request.get("PostController/GetAllPost")
      .then((res) => {
        setPostData(res.data.find(({ Id }) => Id == id));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id, isChanged]);

  return !isLoading ? (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }} className='new-page'>
      <Box
        component='form'
        autoComplete='off'
        onSubmit={(e) => handleSubmit(e)}
      >
        <Typography variant='h5' component='h2' sx={{ mb: 2 }}>
          Thông tin bài viết
        </Typography>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            name='Title'
            label='Tiêu đề'
            defaultValue={postData.Title}
          />
          <TextField
            required
            fullWidth
            name='Link'
            label='Liên kết'
            defaultValue={postData.Link}
          />
        </Stack>
        <Stack spacing={2}>
          <Typography variant='h5' component='h2' sx={{ mb: 2 }} mt={4}>
            Hình ảnh bài viết
          </Typography>
          <img style={{ padding: "0 10rem" }} src={postData.Image} alt='' />
          <FilePond
            files={images}
            onupdatefiles={setImages}
            allowMultiple={true}
            maxFiles={1}
            checkValidity={true}
            name='images'
            itemInsertLocation='after'
            acceptedFileTypes={["image/png", "image/jpeg"]}
            credits={false}
            labelIdle='Kéo thả 1 hình ảnh hoặc <span class="filepond--label-action">Tải ảnh lên</span>'
          />
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
            Sửa Bài viết
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
