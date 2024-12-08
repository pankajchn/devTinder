const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pankaj_chouhan:9qETGnd9udKI6xiU@namastenode.l3etv.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode/devTinder"
  );
};

module.exports = {
  connectDB,
};
