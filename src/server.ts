import express from "express";
import connectDB from "./config/db";
import router from "./router";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());


app.use('/api', router)

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
