import express, { Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import cors from "cors";
import { router } from "./app/routes";
const app = express();
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

export default app;
