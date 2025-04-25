import express  from "express";
import { verifyAddUser, verifyAuthentication } from "../middlewares/verifyUser";
import { authentication, createUser, deleteUser, penjualPicture, updateUser } from "../controllers/userController";
import uploadFile from "../middlewares/userUpload";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express()
app.use(express.json())

app.post(`/register/penjual`, [verifyAddUser], createUser)
app.post("/register/pelanggan", [verifyAddUser, verifyToken, verifyRole(["Pelanggan"])], createUser)
app.post(`/login`, [verifyAuthentication], authentication)
app.put(`/update/:idPenjual`, [updateUser, verifyToken, verifyRole(["Penjual", "Pelanggan"])], updateUser)
app.put(`/pic/:idPenjual`, [uploadFile.single("profile"), verifyToken, verifyRole(["Penjual", "Pelanggan"])], penjualPicture)
app.delete(`/delete/:idPenjual`, [verifyToken, verifyRole(["Penjual"])], deleteUser)

export default app