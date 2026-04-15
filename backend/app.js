import "dotenv/config"; 
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import cors from "cors";
import { profileRouter } from "./routes/profileRoutes.js";

const PORT = process.env.PORT;

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/posts",postRouter);
app.use("/profile",profileRouter);

app.listen(PORT, () => {
    console.log(`Server is listening to port : ${PORT}`)
})