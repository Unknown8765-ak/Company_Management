import { Router } from "express";
import { getCurrentUser, login, logout } from "../controllers/auth.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/me").get(verifyJWT,getCurrentUser)


export default router





