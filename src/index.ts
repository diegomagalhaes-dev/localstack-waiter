import express from "express";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 8080;

// simple get route for test
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
