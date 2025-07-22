import mongoose, { Document, Schema } from "mongoose";

// Define a TypeScript interface
export interface IUser extends Document {
  // Extending Document allows the interface to include Mongoose's built-in document methods
  // (like .save(), .remove(), and other instance methods) along with the schema fields.
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  refreshToken: string;
  _id: string;
}

// Use interface in the model
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
