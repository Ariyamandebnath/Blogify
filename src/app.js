import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';


const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}));

app.use(express.json({
    limit: "16 kb"
}))
app.use(express.urlencoded({
    extended: true,
    limit:"16kb"
}))
app.use(express.static("public "))
app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import commentRoutes from './routes/comments.routes.js';
//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/post",postRoutes)
app.use("/api/v1/comment",commentRoutes)



export default app;