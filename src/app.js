import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config()

const app = express()

// app.use(cors({
//     origin : process.env.CORS_ORIGIN,
//     credentials : true
// }));

const allowedOrigins = [
    "http://localhost:5173",
    "https://social-app-frontend-seven-tau.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json({limit : "5kb"}))
app.use(express.urlencoded({extended : true , limit : "5kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./router/user.router.js"
import postRouter from "./router/post.router.js"

app.use("/api/v1/users" , userRouter)
app.use("/api/v1/posts" , postRouter)

// Global Error Handler
app.use((err, req , res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Something went wrong",
    errors: err.errors || [],
  });
});


export default app;