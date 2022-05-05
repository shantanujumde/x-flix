import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "./Videos.css";
const Videos = ({ vid ,clickHandle}) => {
  // console.log( vid)
  const currDate = new Date(vid.releaseDate)
  let date = Date.now() - currDate;
  date = date / (1000 * 3600 * 24);
  if (date > 30) {
    date = Math.floor(date / 366) + " years ago";
  } else {
    date = date + " days ago";
  }

  return (
    <Card
      style={{ backgroundColor: "rgba(24, 24, 24, 1)", boxShadow: "none" }}
      square={true}
      className="video-card"
      sx={{ maxWidth: 345 }}
    >
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={vid.previewImage}
      />
      <CardContent className="video-details">
        <Typography
          gutterBottom
          variant="body2"
          className="video-details-title"
        >
          {vid.title}
        </Typography>
        <Typography variant="body2" className="video-details-time">
          {date}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default Videos;
