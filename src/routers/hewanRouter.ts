import express  from "express";
import { addHewan, changePicture, deleteHewan, getAllHewan, updateHewan } from "../controllers/hewanController";
import { verifyAddHewan, verifyEditHewan } from "../middlewares/verifyHewan";
import uploadFile from "../middlewares/hewanUpload";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express()
app.use(express.json())

app.get(`/get`,[verifyToken, verifyRole(["Pelanggan", "Penjual"])] , getAllHewan)
app.post(`/add`,[verifyToken, verifyRole(["Penjual"]), verifyAddHewan], addHewan)
app.put(`/update/:idHewan`,[verifyToken, verifyRole(["Penjual"])] ,[verifyEditHewan], updateHewan)
app.put(`/pic/:id`,[verifyToken, verifyRole(["Penjual"])] ,[uploadFile.single("picture")], changePicture)
app.delete(`/:idHewan`,[verifyToken, verifyRole(["Penjual"])] ,deleteHewan)

export default app