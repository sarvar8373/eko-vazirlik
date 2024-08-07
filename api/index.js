import express from "express";
import cors from "cors";
import { AdminRouter } from "./routes/AdminRoutes.js";
import { CategoryRouter } from "./routes/CategoryRoutes.js";
import { PostsRouter } from "./routes/PostsRoutes.js";
import { PagesRouter } from "./routes/PagesRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import { Statistics } from "./routes/Statistics.js";

// Your other imports...

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/auth", AdminRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/posts", PostsRouter);
app.use("/category", CategoryRouter);
app.use("/statistics", Statistics);
app.use("/pages", PagesRouter);

app.listen(9000, () => {
  console.log("Server runing");
});
