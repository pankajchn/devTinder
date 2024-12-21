const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pankaj_chouhan:xRu81tmMLPhC6NGj@namastenode.l3etv.mongodb.net/devTinder?retryWrites=true&w=majority&appName=NamasteNode"
  );
};

module.exports = {
  connectDB,
};
