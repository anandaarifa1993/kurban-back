import express from "express";
import multer from "multer";

import {
  getAllOrders,
  createOrder,
  updateStatusOrder,
  deleteOrder,
} from "../controllers/orderController";
import {
  verifyAddOrder,
  verifyEditStatus,
} from "../middlewares/orderValidation";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get(
  `/get`,
  [verifyToken, verifyRole(["Penjual", "Pelanggan"])],
  getAllOrders
);
app.post(
  `/new`,
  [verifyAddOrder, verifyToken, verifyRole(["Pelanggan"])],
  createOrder
);
app.put(
  `/update/:id`,
  [verifyEditStatus, verifyToken, verifyRole(["Penjual"])],
  updateStatusOrder
);
app.delete(`/delete/:id`, [verifyToken, verifyRole(["Penjual"])], deleteOrder);

export default app;
