const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true }, // stripe provides address object
    status: { type: String, default: "pending" },
  },
  { timestamps: true } //function in mongoose that provides createdAt and updatedAt times
);

module.exports = mongoose.model("Order", OrderSchema);
