import Navigation from "./NavBar";
import Videos from "./Videos";
// import ipConfig from "../ipConfig.json";
import Grid from "@mui/material/Grid";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import backendUrl from "../backend";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./LandingPage.css";
const fetchVideos = async (setOpenSnackBarError) => {
  try {
    const videos = await axios.get(backendUrl + "v1/videos");
    return await videos.data.videos;
  } catch (e) {
    setOpenSnackBarError(true)
    return [];
  }
};

const LandingPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const data = await fetchVideos(setOpenSnackBarError);
      setData(data);
    })();
  }, []);
  const [openSnackBarError, setOpenSnackBarError] = useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBarError(false);
  };
  return (
    <div className="content">
      <Snackbar
        open={openSnackBarError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Backend Problem Please Contact Adminstrator
        </Alert>
      </Snackbar>
      <Navigation filterDataVisible={null} filterData={setData} />
      <div className="container mt-2">
        <Grid container style={{ marginTop: "-65%" }} spacing={2}>
          {data.map((video) => {
            return (
              <Grid key={video._id} item md={3}>
                <Link
                  to={`/videos/${video._id}`}
                  state={{ video, videos: data }}
                >
                  <Videos clickHandle={navigate} vid={video} />
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};
export default LandingPage;
