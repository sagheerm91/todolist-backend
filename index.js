import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectDatabase } from "./config/connectDB.js";
import indexRoutes from "./routes/indexRoutes.js"
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(cors());

dotenv.config();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGO_URL;
const NAME = process.env.NAME;
connectDatabase(MONGOURL);

app.listen(PORT, () => {
    console.log(`Server listening at: ${PORT}, with Environment : ${NAME}`);
});

app.use("/api", indexRoutes);


