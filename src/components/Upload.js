import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "axios";
import backendUrl from "../backend";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
export default function FormDialog() {
  const [formValues, setFormValues] = useState({
    videoLink: "",
    previewImage: "",
    title: "",
    genre: "",
    contentRating: "",
    releaseDate: "",
  });
  const ValidateLink = (link) => {
    if (link.includes("https://www.youtube.com/watch")) {
      const vidId = link.split("=")[1];
      setFormValues({
        ...formValues,
        ["videoLink"]: "youtube.com/embed/" + vidId,
      });

      return true;
    }
    return false;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    if (ValidateLink(formValues.videoLink)) {
      console.log(formValues);
      const headers = {
        "Content-Type": "application/json",
        Authorization: "*",
      };
      try {
         await axios.post(backendUrl + "v1/videos", formValues, {
          headers: headers,
        });
        setOpenSnackBarSuccess(true)
        // console.log(res);
      } catch (e) {
        setOpenSnackBarError(true)
      console.log("error");
        // console.log(e);
      }
    } else {
      setOpenSnackBarError(true)
      console.log("error");
    }
    
  };
  const handleInputChange = (e) => {
    const name = e.target.name;
    console.log(name, e.target.value);

    setFormValues({ ...formValues, [name]: e.target.value });
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFormValues({
      videoLink: "",
      previewImage: "",
      title: "",
      genre: "",
      contentRating: "",
      releaseDate: "",
    });
    setOpenSnackBarSuccess(false);
    setOpenSnackBarError(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [openSnackBarError, setOpenSnackBarError] = useState(false);
  const [openSnackBarSuccess, setOpenSnackBarSuccess] = useState(false);
  return (
    <>
       <Snackbar open={openSnackBarError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Invalid Video Link/Upload Error
        </Alert>
      </Snackbar>
      <Snackbar open={openSnackBarSuccess} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Upload Success
        </Alert>
      </Snackbar>
      <Button
        startIcon={<FileUploadIcon />}
        style={{
          backgroundColor: "rgba(76, 163, 252, 1)",
        }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Upload
      </Button>
      <Dialog open={open} onClose={handleClose} sx={{ color: "primary" }}>
        <DialogTitle color="primary">Upload</DialogTitle>

        <Box
          sx={{
            // display: "flex",
            alignItems: "center",
            "& > :not(style)": { m: 1 },
          }}
        >
          <form onSubmit={onSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  label="Video Link"
                  type="text"
                  required
                  fullWidth
                  name="videoLink"
                  helperText={`This link will be used to derive the video ${formValues.videoLink}`}
                  value={formValues.videoLink}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Thumbnail Image Link"
                  type="text"
                  name="previewImage"
                  required
                  fullWidth
                  helperText="This link will be used to preview the thumbnail image"
                  value={formValues.previewImage}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  type="text"
                  name="title"
                  required
                  fullWidth
                  helperText="The title will be the representative text for video"
                  value={formValues.title}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">genre</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formValues.genre}
                    label="genre"
                    name="genre"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={"Education"}>Education</MenuItem>
                    <MenuItem value={"Sport"}>Sport</MenuItem>
                    <MenuItem value={"Comedy"}>Comedy</MenuItem>
                    <MenuItem value={"Lifestyle"}>Lifestyle</MenuItem>
                  </Select>
                  <FormHelperText>
                    Genre will help in categorizing your videos
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label1">
                    Suitable age group for the clip
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label1"
                    id="demo-simple-select"
                    value={formValues.contentRating}
                    label="Suitable age group for the clip"
                    name="contentRating"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={"+7"}>+7</MenuItem>
                    <MenuItem value={"+12"}>+12</MenuItem>
                    <MenuItem value={"+16"}>+16</MenuItem>
                    <MenuItem value={"+18"}>+18</MenuItem>
                  </Select>
                  <FormHelperText>
                    This will be used to filter videos on age group suitability
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Release date"
                  type="date"
                  required
                  name="releaseDate"
                  fullWidth
                  helperText="This will be used to sort videos"
                  value={formValues.releaseDate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <Button
                  variant="contained"
                  onClick={() => setShowRegisterForm(false)}
                  disableElevation
                >
                  {" "}
                  Close
                </Button> */}
              </Grid>
            </Grid>
            <DialogActions color="primary">
              <Button
                style={{ marginLeft: "15px", backgroundColor: "red" }}
                variant="contained"
                color="primary"
                type="submit"
                disableElevation
              >
                Upload
              </Button>{" "}
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>{" "}
          </form>
        </Box>
      </Dialog>
    </>
  );
}
