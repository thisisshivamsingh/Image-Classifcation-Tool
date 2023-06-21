const express = require("express");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const jimp = require("jimp");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3001;

// Set up Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

app.use(cors({ origin: "*" }));
app.use(express.json());

// Load the MobileNet model
let model;
async function loadModel() {
  model = await mobilenet.load();
  console.log("Model loaded");
}
loadModel();

// Define the image classification route
app.post("/classify", upload.single("image"), async (req, res) => {
  try {
    const imagePath = path.resolve(__dirname, req.file.path);

    // Load and process the image using jimp
    const image = await jimp.read(imagePath);
    image.resize(224, 224); // Resize the image if needed
    const imageData = await image.getBufferAsync(jimp.MIME_JPEG);

    const decodedImage = tf.node.decodeImage(imageData, 3);
    const expandedImage = tf.expandDims(decodedImage);

    const predictions = await model.classify(expandedImage);

    res.json({ predictions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
