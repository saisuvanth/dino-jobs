const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;
const server = require("./app");

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
