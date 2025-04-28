import express from "express";
import {
  verifyAddUser,
  verifyAuthentication,
  verifyEditUser,
} from "../middlewares/verifyUser";
import {
  authentication,
  createUser,
  deleteUser,
  penjualPicture,
  updateUser,
} from "../controllers/userController";
import uploadFile from "../middlewares/userUpload";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.post(`/register`, [uploadFile.single(""), verifyAddUser], createUser);
app.post(
  `/login`,
  [uploadFile.single(""), verifyAuthentication],
  authentication
);
app.put(
  `/update/:idPenjual`,
  [
    uploadFile.single("profile"), // Move this to the beginning
    verifyEditUser,
    verifyToken,
    verifyRole(["Penjual"]),
  ],
  updateUser
);
app.delete(
  `/delete/:idPenjual`,
  [verifyToken, verifyRole(["Penjual"])],
  deleteUser
);

export default app;
