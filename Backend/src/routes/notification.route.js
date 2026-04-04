import express from "express";
import {
  getMyNotifications,
  markNotificationAsRead
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/notification", verifyJWT, getMyNotifications);
router.patch("/mark-read/:id", verifyJWT, markNotificationAsRead);

export default router;