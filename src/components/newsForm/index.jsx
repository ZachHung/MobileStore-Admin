import { Paper, Stack, Typography, FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import LoadingButton from "@mui/lab/LoadingButton";
import { Request } from "../../utils";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useNavigate } from "react-router-dom";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);
export default function FormPropsTextFields() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (images.length < 1) setError(true);
    else {
      setLoading(true);
      const data = new FormData(event.currentTarget);
      const formData = {
        Title: data.get("Title"),
        Link: data.get("Link"),
        Image: images[0].filename,
      };
      let imageForm = new FormData();
      imageForm.append("files", images[0].file);
      Request.post("PostController/UploadPostImage", imageForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => Promise.resolve(res.status));
      console.log(formData);
      Request.post("PostController/AddPost", formData)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
          setTimeout(() => navigate("../news"), 250);
        });
    }
  };

  return (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }} className='new-page'>
      <Box component='form' autoComplete='off' onSubmit={handleSubmit}>
        <Typography variant='h5' component='h2' sx={{ mb: 2 }}>
          Th??ng tin b??i vi???t
        </Typography>
        <Stack spacing={3}>
          <TextField required fullWidth name='Title' label='Ti??u ?????' />
          <TextField required fullWidth name='Link' label='Li??n k???t' />
        </Stack>
        <Stack spacing={2}>
          <Typography variant='h5' component='h2' sx={{ mb: 2 }} mt={4}>
            H??nh ???nh b??i vi???t
          </Typography>
          <FilePond
            className={error === true ? "error" : ""}
            files={images}
            onupdatefiles={setImages}
            allowMultiple={true}
            maxFiles={1}
            checkValidity={true}
            name='images'
            itemInsertLocation='after'
            acceptedFileTypes={["image/png", "image/jpeg"]}
            credits={false}
            labelIdle='K??o th??? 1 h??nh ???nh ho???c <span class="filepond--label-action">T???i ???nh l??n</span>'
          />
          {error === true && (
            <FormHelperText sx={{ marginTop: "0 !important" }} error>
              B???n c???n ch???n ????? 1 h??nh ???nh
            </FormHelperText>
          )}
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
            Th??m B??i vi???t
          </LoadingButton>
        </Stack>
      </Box>
    </Paper>
  );
}
