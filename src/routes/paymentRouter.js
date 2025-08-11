const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { instance } = require("../utils/razorpay.js");
const { Payment } = require("../models/payment.js");
const { membershipAmount } = require("../utils/constants.js");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { User } = require("../models/user.js");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const { membershipType } = req.body;
  const { firstName, lastName, emailId } = req.user;

  const options = {
    amount: membershipAmount[membershipType],
    currency: "INR",
    receipt: "order_rcptid_11",
    notes: {
      firstName,
      lastName,
      emailId,
      membershipType,
    },
  };

  try {
    const order = await instance.orders.create(options);

    console.log(order);

    const payment = await Payment.create({
      userId: req.user?._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });

    res
      .status(200)
      .json({ ...payment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.log(error);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      secret
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid " });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.orderId });

    payment.status = paymentDetails.status;

    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // if (req.body.event == "payment.captured") {}
    // if (req.body.event == "payment.failed") {}

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user;
  if (user.isPremium) {
    return res.json({ isPremium: true });
  }
  return res.json({ isPremium: false });
});

module.exports = { paymentRouter };
