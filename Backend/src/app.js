import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
const app = express()

app.use(cookieParser())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))

import authRouter from "./routes/auth.route.js"
import depatrtmentRouter from "./routes/department.routes.js"
import userRouter from "./routes/user.route.js"
import taskRouter from "./routes/tasks.route.js"
import requirementRoutes from "./routes/requirement.route.js"
import errorHandler from "./middlewares/error.middleware.js"


app.use("/api/v1/auth",authRouter)
app.use("/api/v1/departments",depatrtmentRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/tasks",taskRouter)
app.use("/api/v1/requirements", requirementRoutes)


app.use(errorHandler)

export { app }