import React, { useState } from "react";
import axios from "axios";
import { DropzoneArea } from "material-ui-dropzone";
import { Backdrop, Chip, CircularProgress, Grid } from "@mui/material";

function App() {
  const [predictedClass, setPredictedClass] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleImageSubmit = (files) => {
    if (files[0]) {
      const formData = new FormData();
      formData.append("image", files[0]);

      setLoading(true);
      setTimeout(async () => {
        try {
          const response = await axios.post(
            "http://localhost:3001/classify",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setLoading(null);
          setPredictedClass(response.data.predictions[0].className);
          setConfidence(
            Math.round(response.data.predictions[0].probability * 100)
          );
        } catch (error) {
          console.error(error);
          alert("Image classification failed");
          setLoading(null);
        }
      }, 1000);
    } else {
      setPredictedClass(null);
      setConfidence(null);
      setLoading(null);
    }
  };

  return (
    <div>
      <Grid
        container
        className="App"
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginTop="8%"
      >
        <Grid item>
          <h1 style={{ textAlign: "center", marginBottom: "1.5em" }}>
            Image Classification Tool
          </h1>
          <DropzoneArea
            acceptedFiles={["image/*"]}
            dropzoneText={"Add an image"}
            onChange={handleImageSubmit}
            maxFileSize={10000000}
            filesLimit={1}
            showAlerts={["error"]}
          />

          <div style={{ marginTop: "20px" }}>
            <Chip
              label={
                predictedClass === null
                  ? "Prediction:"
                  : `Prediction: ${predictedClass}`
              }
              style={{
                justifyContent: "left",
                width: "100%",
                fontSize: "15px",
                fontWeight: "bold",
              }}
              variant="outlined"
            />
            <Chip
              label={
                confidence === null
                  ? "Confidence:"
                  : `Confidence: ${confidence}%`
              }
              style={{
                justifyContent: "left",
                marginTop: "20px",
                fontSize: "15px",
                fontWeight: "bold",
              }}
              variant="outlined"
            />
          </div>
        </Grid>
      </Grid>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default App;
