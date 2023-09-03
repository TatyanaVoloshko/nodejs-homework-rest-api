const app = require('./app')

const dbConnect = require("./db");

async function startServer() {
  try {
    await dbConnect();
app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
})
  } catch (error) {
    console.log(error);
  }
}


startServer();

