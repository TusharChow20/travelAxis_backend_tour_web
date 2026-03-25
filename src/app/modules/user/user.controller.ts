import { Request, Response } from "express";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json({
      message: "User Inserted Successfully",
      user,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      message: `Getting error to create user ${error.message}`,
    });
  }
};

export const UserControllers = {
  createUser,
};
