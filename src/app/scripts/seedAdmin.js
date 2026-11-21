import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/User.js";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME || "pizzahub" });
  const email = process.env.ADMIN_EMAIL || "admin@pizzahub.com";
  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = "admin";
    existing.isBlocked = false;
    await existing.save();
    console.log(`[seed] promoted existing user to admin: ${email}`);
  } else {
    console.log(`[seed] user ${email} does NOT exist yet.`);
    console.log(`[seed] 1) Go to /sign-up and register ${email} with your desired password.`);
    console.log(`[seed] 2) Run this script again to promote them to admin.`);
  }

  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });