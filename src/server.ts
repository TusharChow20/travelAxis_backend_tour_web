import "dotenv/config";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
let server: Server;
const PORT = 5000;
const mongo_uri = process.env.MONGO_URI;

const startServer = async () => {
  try {
    await mongoose.connect(mongo_uri);
    console.log("connected to mongoose");

    server = app.listen(PORT, () => {
      console.log("server listening");
    });
  } catch (error) {
    console.log("Error--> ", error);
  }
};
startServer();
