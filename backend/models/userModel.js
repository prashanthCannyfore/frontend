import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        // role: {
        //     type: Number, // 0 = user, 1 = admin
        //     default: 0,
        // },
        role: {
            type: String,
            default: "user",
        },
        pan: {
            number: String,
            name: String,
        },
        avatar: {
            public_id: String,
            url: String,
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

//
// 🔐 HASH PASSWORD (BEST PRACTICE)
//
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return; // no next()
    this.password = await bcrypt.hash(this.password, 10);
});


//
// 🔑 JWT TOKEN
//
userSchema.methods.getJWTToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

//
// 🔍 COMPARE PASSWORD
//
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

//
// 🔁 RESET PASSWORD TOKEN
//
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export default mongoose.model("User", userSchema);
