import express from "express";
import cors from "cors";
import hewanRoute from "./routers/hewanRouter";
import penjualRoute from "./routers/userRouter";
import orderRoute from "./routers/orderRouter";
import { PORT, BASE_URL } from "./global";

const app = express();
app.use(cors());

app.use(`/hewan`, hewanRoute);
app.use(`/user`, penjualRoute);
app.use(`/order`, orderRoute);

console.log(BASE_URL);

app.listen(PORT, () => {
  console.log(`Server Berjalan Di Port https://localhost:${PORT}`);
});
