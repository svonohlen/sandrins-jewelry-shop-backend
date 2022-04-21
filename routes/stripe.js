const router = require("express").Router();
const stripe = require("stripe")("process.env.STRIPE_KEY");
module.exports = router;

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId, // when any payment is done, stripe is returning tokenid
      amount: req.body.amount,
      currency: "cad",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});
