import express from "express";
import {
  signIn,
  signOut,
  refreshToken,
} from "../controllers/users/authControllers.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/refresh", refreshToken);
export default router;
