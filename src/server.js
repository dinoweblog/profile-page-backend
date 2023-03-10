const app = require("./index");
const database = require("./configs/database");

const port = process.env.PORT || 5000;

app.listen(port, () => {
  try {
    console.log(`Running on Port Number ${port}`);
    database();
  } catch (error) {
    console.log(error.message);
  }
});
