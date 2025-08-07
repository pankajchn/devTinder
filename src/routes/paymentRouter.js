const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { instance } = require("../utils/razorpay.js");
const { Payment } = require("../models/payment.js");
const { membershipAmount } = require("../utils/constants.js");

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

module.exports = { paymentRouter };
