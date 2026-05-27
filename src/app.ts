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

// ✅ CORS must be FIRST — before everything
app.use(
  cors({
    origin: varEnv.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(
  expressSession({
    secret: varEnv.EXPRESS_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the server sdf",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
