import connectDB from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config()

const PORT = process.env.PORT 

connectDB()
.then(() => {
    app.listen(PORT , () => {
        console.log(`Server is running on : http://localhost:${PORT}`);
    });
})
.catch((error) => {
    console.log("MongoDB connection error is : " , error);
})