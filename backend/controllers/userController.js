// backend/controllers/userController.js
import crypto from "crypto";
import cloudinary from "cloudinary";
import User from "../models/userModel.js";
import asyncErrorHandler from "../middlewares/asyncErrorHandler.js";
import sendToken from "../utils/sendToken.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = asyncErrorHandler(async (req, res, next) => {

  if (!req.body.avatar) {
    return next(new ErrorHandler("Avatar is required", 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, gender, password } = req.body;

  const user = await User.create({
    name,
    email,
    gender,
    password,
    avatar: {
      public_id: myCloud.public_id, 
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
}); 

// Login User
export const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorHandler("Please Enter Email And Password", 400);
  }


  const user = await User.findOne({ email }).select("+password");
  console.log("dddd", user);


  if (!user) {
    throw new ErrorHandler("User Not Found", 404);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ErrorHandler("Invalid Email or Password", 401);
  }

  sendToken(user, 201, res);
});

// Logout User
export const logoutUser = asyncErrorHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Details
export const getUserDetails = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Forgot Password
export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ErrorHandler("User Not Found", 404));

  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `https://${req.get("host")}/password/reset/${resetToken}`;
  // const resetPasswordUrl =
  //   `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset your password",
      templateId: process.env.SENDGRID_RESET_TEMPLATEID,
      data: { reset_url: resetPasswordUrl },
    });

    console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);
    console.log("SENDGRID_MAIL:", process.env.SENDGRID_MAIL);
    console.log("Reset URL:", resetPasswordUrl);


    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler("Invalid reset password token", 404));

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  // sendToken(user, 200, res);
   res.status(200).json({
      success: true,
      message: `password changed sueesfilly`,
    });
});

// Update Password
export const updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) return next(new ErrorHandler("Old Password is Invalid", 400));

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 201, res);
});

// Update Profile
export const updateProfile = asyncErrorHandler(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    // Delete old avatar
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    // Upload new avatar
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true });
});

// ---------------- ADMIN ------------------

// Get All Users
export const getAllUsers = asyncErrorHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// Get Single User
export const getSingleUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler(`User not found: ${req.params.id}`, 404));

  res.status(200).json({ success: true, user });
});

// Update User Role
export const updateUserRole = asyncErrorHandler(async (req, res) => {
  const { name, email, gender, role } = req.body;

  await User.findByIdAndUpdate(
    req.params.id,
    { name, email, gender, role },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true });
});

// Delete User
export const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler(`User not found: ${req.params.id}`, 404));

  await user.remove();

  res.status(200).json({ success: true });
});
