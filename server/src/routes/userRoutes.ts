import express from "express";
import {
  register,
  update,
  deleteUser,
  changePassword,
  signin,
  verifyToken,
  requestPasswordReset,
  resetPassword,
  verifyUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/middleware";
import { deleteUserAndEntries } from "../controllers/entryController";

const router = express.Router();
router.post("/register", register);
router.put("/update/:id", update);
router.delete("/:id", deleteUserAndEntries);
router.post("/changePassword", changePassword);
router.post("/signin", signin);
router.get("/verifyToken", authMiddleware, verifyToken);
router.post("/verifyUser", verifyUser);
router.post("/requestPasswordReset/", requestPasswordReset);
router.post("/resetPassword/", resetPassword);

export default router;
