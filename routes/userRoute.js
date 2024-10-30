import express from "express";
import {
  getUser,
  getUserById,
  postUser,
  updateUser,
  deleteUser,
} from "../controller/users.js";

import { VerifyUser, AdminOnly } from "../middleware/authUser.js";

import { uploadImageUser } from "../middleware/multer.js";

const router = express.Router();

router.get("/users", VerifyUser, AdminOnly, getUser);
router.post("/users",uploadImageUser, postUser);
router.get("/users/:uuid", VerifyUser, getUserById);
router.patch("/users/:uuid", VerifyUser, uploadImageUser, updateUser);
router.delete("/users/:uuid", VerifyUser, deleteUser);

export default router;
