const router = require("express").Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId, // when any payment is done, stripe is returning tokenid
      amount: req.body.amount,
      currency: "cad",
    }, //after this stripe is gonna return either error or charge object if charge successful
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
