const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 4602;
const corsPolice = cors({
  origin: "http://127.0.0.1:5500",
  optionsSuccessStatus: 200,
});

app.set("view engine", "ejs");
app.use(
  corsPolice,
  express.json(),
  express.urlencoded({ extended: true }),
  express.static("public")
);

routes(app);

// Start
app.listen(port, (error) => {
  console.log("Server listening on PORT", port);
});
