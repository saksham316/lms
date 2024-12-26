// User's Model
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
     
    fullName: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minLength: [2, "Name should contain minimum 2 and maximum 15 characters"],
      maxLength: [
        30,
        "Name should contain minimum 2 and maximum 15 characters",
      ],
    },
    userName: {
      type: String,
      trim: true,
      required: [true, "User Name is required"],
      minLength: [
        2,
        "User Name should contain minimum 2 and maximum 15 characters",
      ],
      maxLength: [
        30,
        "User Name should contain minimum 2 and maximum 15 characters",
      ],
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    phone: {
      type: Number,
      trim: true,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      lowercase: true
    },
    role: String,
    permissions: {
      type: [String],
      required: true,
    },
    disabled: Boolean,
    avatar: String,
    creations: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
        default: null,
      },
    ],
    assignedCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
        default: null,
      },
    ],
    assignedStudyMaterial: [
      {
        type: Schema.Types.ObjectId,
        ref: "studyMaterial",
        default: null,
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema, "user");

export default UserModel;
