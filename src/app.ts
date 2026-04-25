import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./app/config/passport";
import varEnv from "./app/config/env";

const app = express();

app.use(cookieParser());
app.use(
  expressSession({
    secret: "Your Secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

//call the json for getting or sending the jsonb data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//cors implement
app.use(
  cors({
    origin: varEnv.FRONTEND_URL,
    credentials: true,
  }),
);

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
