import express from "express";
import {
  addHewan,
  deleteHewan,
  getAllHewan,
  updateHewan,
} from "../controllers/hewanController";
import { verifyAddHewan, verifyEditHewan } from "../middlewares/verifyHewan";
import uploadFile from "../middlewares/hewanUpload";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get(
  `/get`,
  [verifyToken, verifyRole(["Pelanggan", "Penjual"])],
  getAllHewan
);
app.post(
  `/add`,
  [
    uploadFile.single("foto"),
    verifyAddHewan,
    verifyToken,
    verifyRole(["Penjual"]),
  ],
  addHewan
);
app.put(
  `/update/:idHewan`,
  [uploadFile.single("foto"), verifyToken, verifyRole(["Penjual"])],
  [verifyEditHewan],
  updateHewan
);
app.delete(`/:idHewan`, [verifyToken, verifyRole(["Penjual"])], deleteHewan);

export default app;
