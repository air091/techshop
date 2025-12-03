require("dotenv/config");
const express = require("express");
const cors = require("cors");
const databaseConnection = require("./storage/database");
const userRoute = require("./routes/user.routes");

const app = express();
const PORT =process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoute);

async function startServer() {
    try {
        await databaseConnection();
        app.listen(PORT, () => {
            console.log("Server running...", PORT);
        })
    } catch (error) {
        console.error(`Start server ${error}`);
        process.exit(1);
    }
}

startServer();