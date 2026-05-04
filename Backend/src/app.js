import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
const app = express()

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
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
import notificationRoutes from "./routes/notification.route.js";
import companyRoute from "./routes/company.route.js"
import salaryRoutes from "./routes/salary.routes.js";

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/departments",depatrtmentRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/tasks",taskRouter)
app.use("/api/v1/requirements", requirementRoutes)
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/salary", salaryRoutes);



app.use(errorHandler)

export { app }
