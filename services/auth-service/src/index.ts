import express, { Request, Response, json } from "express";
import { StatusCodes } from "http-status-codes";

const PORT = 3000;
const app = express();

app.use(json());
app.get("/health", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ status: "UP" });
});

app.listen(PORT, () => {
  console.log(`Auth service is running at port ${PORT}`);
});
