const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect("mongodb+srv://shopIt:ekikWdY5RV8WmW1o@cluster0.owuslab.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((con) => {
      console.log(
        `Mongodb Database connected with HOST: ${con.connection.host} mode.`
      );
    });
};
module.exports = connectDatabase;
