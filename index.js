const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

// load environment variables from env file into process.env
dotenv.config();

//can fail therefore then catch
mongoose
  .connect(process.env.MONGO_URL) //this url is sensitive data has to be put into env file to protect
  .then(() => console.log("Db connection success"))
  .catch((err) => {
    console.log(err);
  });

//to enable application to accept json objects
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Sandrins server is running");
});
