const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Emp = require("../model/posts");

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store generated OTPs with expiration
const otpMap = new Map();

// OTP expiration time (5 minutes)
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Server-side secret for OTP hashing 
const OTP_SECRET = process.env.OTP_SECRET 

// Hash OTP using HMAC
const hashOTP = (otp) => {
  return crypto.createHmac('sha256', OTP_SECRET).update(otp).digest('hex');
};

// Verify OTP by comparing hashes
const verifyOTP = (otp, hashedOTP) => {
  return hashOTP(otp) === hashedOTP;
};

// Clean up expired OTPs
const cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [email, otpData] of otpMap.entries()) {
    if (now > otpData.expiresAt) {
      otpMap.delete(email);
    }
  }
};

// Clean up expired OTPs every minute
setInterval(cleanupExpiredOTPs, 60 * 1000);

// Nodemailer configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "herbalheaven.pvt.ltd@gmail.com",
//     pass: "kiwh seby gmdu ywmx",
//   },
// });

// Using environment variables for email credentials - IA
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route for sending OTP via email
router.post("/send-otp", (req, res) => {
  try {
    const { email } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    const otp = generateOTP();

    // Log OTP generation attempt
    logOTPAttempt(email, 'OTP_GENERATION', true, clientIP);

    // Send OTP via email
    const mailOptions = {
      //from: "herbalheaven.pvt.ltd@gmail.com",
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for verification is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        logOTPAttempt(email, 'OTP_SEND', false, clientIP);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
      } else {
        // Hash the OTP before storing
        const hashedOTP = hashOTP(otp);
        const expiresAt = Date.now() + OTP_EXPIRY_TIME;
        
        // Store hashed OTP in map with email as key and expiration time
        otpMap.set(email, {
          hashedOTP: hashedOTP,
          expiresAt: expiresAt,
          attempts: 0,
          createdAt: Date.now()
        });
        
        logOTPAttempt(email, 'OTP_SEND', true, clientIP);
        res.json({ success: true, message: "OTP sent successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route for verifying OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    if (!otpMap.has(email)) {
      logOTPAttempt(email, 'OTP_VERIFICATION', false, clientIP);
      res
        .status(400)
        .json({ success: false, message: "OTP not found or expired" });
      return;
    }

    const otpData = otpMap.get(email);
    const now = Date.now();

    // Check if OTP has expired
    if (now > otpData.expiresAt) {
      otpMap.delete(email); // Immediate invalidation
      logOTPAttempt(email, 'OTP_VERIFICATION', false, clientIP);
      res.status(400).json({ success: false, message: "OTP has expired" });
      return;
    }

    // Check attempt limit (max 3 attempts)
    if (otpData.attempts >= 3) {
      otpMap.delete(email); // Immediate invalidation
      logOTPAttempt(email, 'OTP_VERIFICATION', false, clientIP);
      res.status(400).json({ success: false, message: "Too many failed attempts. Please request a new OTP." });
      return;
    }

    // Verify OTP using hash comparison
    if (verifyOTP(otp, otpData.hashedOTP)) {
      // OTP verification successful - immediate invalidation
      otpMap.delete(email);
      logOTPAttempt(email, 'OTP_VERIFICATION', true, clientIP);
      res.json({
        success: true,
        message: "OTP verification successful",
        manager: await Emp.findOne({ email }),
      });
    } else {
      // Increment failed attempts
      otpData.attempts += 1;
      otpMap.set(email, otpData);
      logOTPAttempt(email, 'OTP_VERIFICATION', false, clientIP);
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
