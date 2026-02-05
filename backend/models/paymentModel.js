import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    resultInfo: {
      resultStatus: { type: String, required: true },
      resultCode: { type: String, required: true },
      resultMsg: { type: String, required: true },
    },
    txnId: { type: String, required: false },
    bankTxnId: { type: String, required: false },
    orderId: { type: String, required: true, unique: true },
    txnAmount: { type: String, required: true },
    txnType: { type: String, required: false },
    gatewayName: { type: String, required: false },
    bankName: { type: String, required: false },
    mid: { type: String, required: true },
    paymentMode: { type: String, required: false },
    refundAmt: { type: String, required: false, default: "0" },
    txnDate: { type: String, required: false },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export default mongoose.model("Payment", paymentSchema);
