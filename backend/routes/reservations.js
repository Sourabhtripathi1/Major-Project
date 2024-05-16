const express = require("express");
const { verifyJwtToken } = require("../middleware/jwt.js");
const {
  getStripePublishableKey,
  createPaymentIntent,
  newReservation,
  getAllReservations,
  getAuthorsReservations,
  getCustomerReservations,
} = require("../controllers/reservationController.js");
const router = express.Router();

router.use(express.json());

router.get("/config", getStripePublishableKey);
router.get("/get_author_reservations", verifyJwtToken, getAuthorsReservations);
router.get(
  "/get_customer_reservations",
  verifyJwtToken,
  getCustomerReservations
);
router.post("/get_reservations", getAllReservations);
router.post("/create_payment_intent", createPaymentIntent);
router.post("/booking", verifyJwtToken, newReservation);

module.exports = router;
