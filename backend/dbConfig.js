const mongoose = require("mongoose");

const db = async () => {
  try {
    const mongodbURI = 'mongodb+srv://testHack:testhack@cluster0.kntw2cr.mongodb.net/'
    // const databaseName = process.env.MONGODB_DATABASE_NAME;
    await mongoose.connect(mongodbURI)

    /* eslint-disable no-console */
    console.log("db connected");
  } catch (e) {
    /* eslint-disable no-console */
    console.log("db not connected : ", e.message);
  }
};

module.exports = db;
