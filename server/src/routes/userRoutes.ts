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
  uploadProfilePhoto
} from "../controllers/userController";
import { authMiddleware } from "../middleware/middleware";
import { deleteUserAndEntries } from "../controllers/entryController";

const router = express.Router();
router.post("/register", register);
router.put("/update/:id", authMiddleware, update); // TODO: Verify works after adding middleware
router.delete("/:id", authMiddleware, deleteUserAndEntries); // TODO: Verify works after adding middleware
router.post("/changePassword", authMiddleware, changePassword); // TODO: Verify works after adding middleware
router.post("/signin", signin);
router.get("/verifyToken", authMiddleware, verifyToken);
router.post("/verifyUser", verifyUser);
router.post("/requestPasswordReset/", requestPasswordReset);
router.post("/resetPassword/", resetPassword);
router.post("/uploadProfilePhoto/", authMiddleware, uploadProfilePhoto)

export default router;
