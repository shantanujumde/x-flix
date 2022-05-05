import Videos from "./Videos";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import NavBar from "./NavBar";
import "./VideoPage.css";
import Button from "@mui/material/Button";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import backendUrl from "../backend";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const getTimePassed = (vid) => {
  const currDate = new Date(vid.releaseDate);
  let date = Date.now() - currDate;
  date = date / (1000 * 3600 * 24);
  let dispDate = "";
  if (date > 30) {
    dispDate = `${Math.floor(date / 366)} years ago`;
  } else {
    dispDate = date + " days ago";
  }
  return dispDate;
};
const fetchVideos = async () => {
  try {
    const videos = await axios.get(backendUrl + "v1/videos");
    return await videos.data.videos;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const VideoPage = () => {
  const [dataVideos, setDataVideos] = useState([]);

  useEffect(() => {
    (async () => {
      const dataVideos = await fetchVideos();
      setDataVideos(dataVideos);
    })();
  }, []);
  const navigate = useNavigate();
  let location = useLocation();
  const data = location.state.video;
  const [upVotes, setUpVote] = useState(data.votes.upVotes);
  const [downVotes, setDownVote] = useState(data.votes.downVotes);
  const { id } = useParams();
  console.log(`${backendUrl}/v1/videos/${id}/votes`);
  const updateUpVote = async () => {
    setUpVote(upVotes + 1);
    const voteupdate = {
      votes: {
        upVotes: upVotes,
      },
    };
    try {
      const data = await axios.patch(
        `${backendUrl}v1/videos/${id}/votes`,
        JSON.stringify(voteupdate)
      );
      console.log("done", data);
    } catch (e) {
      console.log(e);
    }
  };
  const updateDownVote = async () => {
    setDownVote(downVotes + 1);
    const voteupdate = {
      votes: {
        downVotes: downVotes,
      },
    };
    try {
      const data = await axios.patch(
        `${backendUrl}v1/videos/${id}/votes`,
        JSON.stringify(voteupdate)
      );
      console.log("done", data);
    } catch (e) {
      console.log(e);
    }
  };
  // console.log(datas);
  const link = "https://www." + data.videoLink;
  return (
    <div className="content">
      <NavBar filterData={null} filterDataVisible={false} />
      <div className="container">
        <Grid
          container
          direction="row"
          spacing={2}
          style={{ marginTop: "-65%", marginBottom: "-5%" }}
          className="video-title"
        >
          <Grid item xs={12} sm={12} md={12}>
            <div className="video-container">
              <iframe
                className="responsive-iframe"
                src={link}
                title={data.title}
              ></iframe>
            </div>
            <br />
          </Grid>
          <Grid item md={9} className="video-title">
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Typography>{data.title}</Typography>
              </Grid>
              <Grid item md={12}>
                <Typography variant="body2" className="video-count">
                  +{data.viewCount} &#8226; {getTimePassed(data)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} justifyContent="end">
            <Button
              startIcon={<ThumbUpIcon />}
              variant="contained"
              style={{
                backgroundColor: "rgba(76, 163, 252, 1)",
                borderRadius: "15px",
              }}
              onClick={updateUpVote}
            >
              {upVotes}
            </Button>
            <Button
              startIcon={<ThumbDownAltIcon />}
              variant="contained"
              style={{
                borderRadius: "15px",
              }}
              onClick={updateDownVote}
            >
              {downVotes}
            </Button>
          </Grid>
        </Grid>
        <hr style={{ marginTop: "10%", color: "white" }} />
        <Grid container spacing={2}>
          {dataVideos.map((video) => {
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
export default VideoPage;
