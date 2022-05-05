import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import Upload from "./Upload";
import History from "./History";
import "./NavBar.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const fetchVideos = async (filter, setOpen) => {
  try {
    const ipConfig =
      "https://6b308647-52c6-431f-8e62-c759ee3e5bc8.mock.pstmn.io/";

    // console.log(ipConfig + "v1/videos" + filter);
    const videos = await axios.get(ipConfig + "v1/videos" + filter);

    return await videos.data.videos;
  } catch (e) {
    setOpen(true);
    console.log(e);
    return [];
  }
};
export default function Navigation({ filterData, filterDataVisible }) {
  // console.log("filterData", filterDataVisible);

  const [selectedType, setSelectedType] = useState([0, -1, -1, -1, -1]);
  const [selectedAge, setSelectedAge] = useState(0);
  const [sortBy, setsortBy] = useState("releaseDate");
  const [searchVal, setSearchVal] = useState("");
  let filterType = ["All Genere", "Education", "Sport", "Comedy", "Lifestyle"];
  let filterAge = ["Any age group", "7+", "12+", "16+", "18+"];

  useEffect(() => {
    let urlString = "";
    if (searchVal !== "") {
      urlString += "?title=" + searchVal;
    }
    if (selectedType.filter((val) => val > 0).length > 0) {
      urlString += "&genres=";
      for (let i = 0; i < filterType.length; i++) {
        if (selectedType.includes(i)) {
          if (i !== 0) urlString += filterType[i] + ",";
        }
      }
    }
    if (selectedAge !== 0) {
      urlString += "&contentRating=" + filterAge[selectedAge];
    }
    console.log(urlString);
    if (typeof filterDataVisible !== "boolean")
      History.push(urlString);
  }, [searchVal, selectedType, selectedAge]);

  const searchInputVal = async (val) => {
    filterData(await fetchVideos("?title=" + val, setOpen));
  };
  useEffect(() => {
    (async function () {
      filterData(await fetchVideos("?sortBy=" + sortBy, setOpen));
    })();
  }, [sortBy]);
  useEffect(() => {
    let selected = "";
    for (let i = 0; i < filterType.length; i++) {
      if (selectedType.includes(i)) {
        if (i === 0) selected += "All";
        else selected += filterType[i];
      }
    }
    (async function (filterData) {
      let res = await fetchVideos("?genres=" + selected, setOpen);
      await filterData(res);
    })();
  }, [selectedType]);
  useEffect(() => {
    switch (selectedAge) {
      //  case 0: ((async function() {filterData( await fetchVideos("?contentRating=All"))})()); break
      case 1:
        (async function () {
          filterData(await fetchVideos("?contentRating=7+", setOpen));
        })();
        break;
      case 2:
        (async function () {
          filterData(await fetchVideos("?contentRating=12+", setOpen));
        })();
        break;
      case 3:
        (async function () {
          filterData(await fetchVideos("?contentRating=16+", setOpen));
        })();
        break;
      case 4:
        (async function () {
          filterData(await fetchVideos("?contentRating=18+", setOpen));
        })();
        break;
    }
  }, [selectedAge]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [open, setOpen] = useState(false);
  return (
    <Box className="search-bar" sx={{ flexGrow: 1 }} justifyContent="center">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          No videos for this filter
        </Alert>
      </Snackbar>
      <AppBar position="static">
        <Toolbar
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <span id="first-char">X</span>Flix
          </Typography>

          <div className="input-group bg-dark" id="main-search-bar-grp">
            <input
              id="main-search-bar"
              type="search"
              className="form-control rounded"
              placeholder="Search (e.g. top)"
              aria-label="Search"
              aria-describedby="search-addon"
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => searchInputVal(searchVal)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {/* <Button
              startIcon={<FileUploadIcon />}
              style={{
                backgroundColor: "rgba(76, 163, 252, 1)",
              }}
              variant="contained"
            >
              Upload
            </Button> */}
            <Upload />
          </Box>
        </Toolbar>
        {/* ----------------------filterType------------------------------ */}
        {typeof filterDataVisible !== "boolean" ? (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              className="filters"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {filterType.map((val, indx) => {
                return selectedType.includes(indx) ? (
                  <Button
                    key={indx}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      color: "black",
                    }}
                    variant="contained"
                    onClick={() => {
                      if (selectedType.includes(indx)) {
                        setSelectedType([
                          -1,
                          ...selectedType.filter((val) => val !== indx),
                        ]);
                      } else {
                        console.log(val, indx, selectedType.includes(indx));

                        setSelectedType([
                          ...selectedType.splice(selectedType.indexOf(-1), 1),
                          indx,
                        ]);
                      }
                    }}
                  >
                    {val}
                  </Button>
                ) : (
                  <Button
                    key={indx}
                    style={{
                      boxShadow: "none",
                      backgroundColor: "rgba(32, 32, 32, 1)",
                      color: "white",
                    }}
                    variant="contained"
                    onClick={() => {
                      if (selectedType.includes(indx)) {
                        setSelectedType([
                          -1,
                          ...selectedType.filter((val) => val !== indx),
                        ]);
                      } else {
                        selectedType.splice(selectedType.indexOf(-1), 1);
                        setSelectedType([...selectedType, indx]);
                      }
                    }}
                  >
                    {val}
                  </Button>
                );
              })}
              <select
                onChange={(e) => setsortBy(e.target.value)}
                className="form-select"
                style={{ width: "auto", borderRadius: "30px" }}
              >
                <option value="releaseDate">Relese Date</option>
                <option value="viewCount">View Count</option>
              </select>
            </Box>
            {/* ----------------------filterAge------------------------------ */}
            <Box
              mt={1}
              mb={2}
              className="filters"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {filterAge.map((val, indx) => {
                return indx === selectedAge ? (
                  <Button
                    key={indx}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      color: "black",
                    }}
                    variant="contained"
                  >
                    {val}
                  </Button>
                ) : (
                  <Button
                    key={indx}
                    style={{
                      boxShadow: "none",
                      backgroundColor: "rgba(32, 32, 32, 1)",
                      color: "white",
                    }}
                    variant="contained"
                    onClick={() => setSelectedAge(indx)}
                  >
                    {val}
                  </Button>
                );
              })}
            </Box>
          </>
        ) : (
          ""
        )}
      </AppBar>
    </Box>
  );
}
