const express = require("express");
const cors = require("cors");
const routers = require("./routers");

const app = express();
const port = process.env.PORT || 4602;
const corsPolice = cors({
  origin: "http://127.0.0.1:5500",
  optionsSuccessStatus: 200,
});

app.use(
  corsPolice,
  express.static("src/publci"),
  express.json(),
  express.urlencoded({ extended: true })
);

routers(app);

// Start
app.listen(port, (error) => {
  console.log("Server listening on PORT", port);
});
