import express, { NextFunction, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import cors from "cors";
import { router } from "./app/routes";
import { success } from "zod";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";

import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());
//call the json for getting or sending the jsonb data
app.use(express.json());
//cors implement
app.use(cors());

app.use("/api/v1", router);
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the server sdf",
  });
});

//global error handler
app.use(globalErrorHandler);

app.use(notFound);

export default app;
