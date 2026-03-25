import express, { Request, Response } from "express"
const app = express();
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the server sdf",
  });
});

export default app;
