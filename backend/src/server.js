require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `SatQuery backend running on http://localhost:${PORT}`
      );

      console.log(
        `ML Service: ${
          process.env.ML_SERVICE_URL ||
          "http://127.0.0.1:8000"
        }`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start SatQuery backend:",
      error.message
    );

    process.exit(1);
  }
};

startServer();