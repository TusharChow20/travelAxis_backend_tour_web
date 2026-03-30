import dotenv from "dotenv";
dotenv.config();
const varEnv = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
};
export default varEnv;
