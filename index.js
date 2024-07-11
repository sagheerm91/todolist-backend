import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectDatabase } from "./config/connectDB.js";
import indexRoutes from "./routes/indexRoutes.js"
import cors from "cors";
const app = express();

app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGO_URL;
connectDatabase(MONGOURL);

app.listen(PORT, () => {
    console.log(`Server listening at: ${PORT}`);
});

app.use("/api", indexRoutes);


