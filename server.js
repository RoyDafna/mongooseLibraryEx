const app = require("./app");
const mongoose = require("mongoose");
const run = async () => {
  try {
    const port = process.env.PORT || "3000";
    await mongoose.connect("mongodb://localhost:27017/my_db");
    app.listen(port, () => console.log(`Listening on port: ${port}`));
  } catch (err) {
    console.log(`FAILED TO START: ${err}`);
  }
};

run();

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
