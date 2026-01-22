import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    resultInfo: {
      resultStatus: { type: String, required: true },
      resultCode: { type: String, required: true },
      resultMsg: { type: String, required: true },
    },
    txnId: { type: String, required: true },
    bankTxnId: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    txnAmount: { type: String, required: true },
    txnType: { type: String, required: true },
    gatewayName: { type: String, required: true },
    bankName: { type: String, required: true },
    mid: { type: String, required: true },
    paymentMode: { type: String, required: true },
    refundAmt: { type: String, required: true, default: "0" },
    txnDate: { type: String, required: true },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export default mongoose.model("Payment", paymentSchema);
