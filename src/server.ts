import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import varEnv from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
let server: Server;
const PORT = varEnv.PORT;
const mongo_uri = varEnv.MONGO_URI;

if (!mongo_uri) {
  throw new Error("MONGO_URI is not defined");
}


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
(async () => {
  startServer();
  seedSuperAdmin();
})();

process.on("unhandledRejection", () => {
  console.log("Server shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("Uncaught Exception! Server shutting down (local error)");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("Uncaught Exception! Server shutting down (local error)");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
