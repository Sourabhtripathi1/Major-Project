const mongoose = require("mongoose");
const House = require("../models/house.model.js");
const reservationDB = require("../models/reservation.model.js");
require("dotenv").config();

// stripe controller & payment process
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getStripePublishableKey = async (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const payload = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      description: "RoomEase Hotels",
      shipping: {
        name: "Sourabh Tripathi",
        address: {
          line1: "3B9 Kansua, Udhyog puri",
          postal_code: "324004",
          city: "Kota",
          state: "Rajasthan",
          country: "India",
        },
      },
      amount: payload.amount * 100,
      currency: "inr",
      payment_method_types: ["card"],
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log("=========error===============");
    console.log(e.message);
    console.log("====================================");
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};

// save new reservation
exports.newReservation = async (req, res) => {
  try {
    const payload = req.body;
    const listingId = payload.listingId;
    const authorId = payload.authorId;
    const guestNumber = payload.guestNumber;
    const checkIn = payload.checkIn;
    const checkOut = payload.checkOut;
    const nightStaying = payload.nightStaying;
    const orderId = payload.orderId;
    const user = payload.user;

    const findCriteria = {
      _id: new mongoose.Types.ObjectId(listingId),
    };

    const listingDetails = await House.findById(findCriteria);

    const basePrice = parseInt(listingDetails.basePrice);
    const tax = Math.round((parseInt(basePrice) * 14) / 100);
    const authorEarnedPrice =
      basePrice - Math.round((parseInt(basePrice) * 3) / 100);

    let newReservation = {
      listingId: listingId,
      authorId: authorId,
      guestNumber: parseInt(guestNumber),
      checkIn: checkIn,
      checkOut: checkOut,
      nightStaying: parseInt(nightStaying),
      basePrice: basePrice,
      taxes: tax,
      authorEarnedPrice: authorEarnedPrice,
      orderId: orderId,
      user: user,
    };

    const findSavedListingReservation = await reservationDB.find({
      listingId: listingId,
    });
    // console.log(findSavedListingReservation);

    const listing = findSavedListingReservation.map((reservation, i) => {
      return reservation.checkIn === checkIn;
    });

    console.log(listing, "line 80");

    if (!listing.includes(true)) {
      const saveReservation = new reservationDB(newReservation).save();
      res.status(200).send("Payment confirmed.");
    } else {
      res.status(404).send("Something went wrong try again later.");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const payload = req.body;
    const listingId = payload.id;

    const findCriteria = {
      listingId: listingId,
    };

    const reservationsData = await reservationDB.find(findCriteria);

    res.status(200).send(reservationsData);
  } catch (error) {
    console.log(error);
  }
};

exports.getAuthorsReservations = async (req, res) => {
  try {
    const authorId = req.user;

    const findCriteria = {
      authorId: authorId,
    };

    const authorsListingReservations = await reservationDB.find(findCriteria);

    if (!authorsListingReservations) {
      res.json({ message: "No listing booked yet" });
    }

    res.status(200).send(authorsListingReservations);
  } catch (error) {
    console.log(error);
  }
};

exports.getCustomerReservations = async (req, res) => {
  try {
    const user = req.user;

    const findCriteria = {
      user: user,
    };

    const userReservations = await reservationDB.find(findCriteria);

    if (!userReservations) {
      res.json({ message: "No listing booked yet" });
    }

    res.status(200).send(userReservations);
  } catch (error) {
    console.log(error);
  }
};
