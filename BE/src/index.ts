import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import express, { Express } from "express";
import { connect } from "mongoose";
import routes from "./routes/routes";

const app: Express = express();
dotenv.config();

const port: string = process.env.PORT || "3000";

connect(process.env.DB_CONNECT || "")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log("Error accrued while connecting to DB", error);
  });

app.use(bodyParser.json());
// app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server started at ${port} port`);
});
