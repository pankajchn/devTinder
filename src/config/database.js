const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://pankaj_chouhan:vdZuPYazWWalkycf@namastenode.l3etv.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode");
};

module.exports = {
  connectDB,
};
