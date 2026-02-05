// backend/app.js
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/error.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";

const app = express();
app.set("query parser", "extended");
  

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "backend/config/config.env" });
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Proxy working!' });
});

// Error middleware (should be after all routes)
app.use(errorMiddleware);

export default app;
