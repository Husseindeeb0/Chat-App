import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../config/utils";
import { IUser } from "../models/user.model";
import imagekit from "../config/imageKit";

// Response type means returning value like this which is an http response object: return res.status(...).json(...)
export const Signup = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const {
    fullName,
    email,
    password,
  }: { fullName: string; email: string; password: string } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: IUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateAccessToken(newUser._id, res);
      const refreshToken = generateRefreshToken(newUser._id, res);
      newUser.refreshToken = refreshToken;
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(500).json({ message: "Invalid user data" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in signup controller: ", error.message);
    } else {
      console.log("Unknown error in signup controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateAccessToken(user._id, res);
    const refreshToken = generateRefreshToken(user._id, res);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in login controller: ", error.message);
    } else {
      console.log("Unknown error in login controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Logout = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User is not found in database");
    }
    user.refreshToken = "";
    await user.save();
    res.cookie("access_token", "", { maxAge: 0 });
    res.cookie("refresh_token", "", { maxAge: 0 });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in logout controller: ", error.message);
    } else {
      console.log("Unknown error in logout controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { profilePic } = req.body;
  const userId = req.userId;
  try {
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await imagekit.upload({
      file: profilePic,
      fileName: `${userId}_profile`,
      useUniqueFileName: true,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in update profile controller: ", error.message);
    } else {
      console.log("Unknown error in update profile controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById({ _id: userId });
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in check authentication controller: ", error.message);
    } else {
      console.log("Unknown error in check authentication controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
