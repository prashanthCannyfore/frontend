process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cloudinary from 'cloudinary';
import app from './backend/app.js';
import connectDatabase from './backend/config/database.js';

// ----------------------------
// 3️⃣ Constants
// ----------------------------
const PORT = process.env.PORT || 4000;

// ----------------------------
// 4️⃣ Fix __dirname for ES Modules
// ----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------
// 5️⃣ Connect Database
// ----------------------------
connectDatabase();

// ----------------------------
// 6️⃣ Configure Cloudinary
// ----------------------------
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ----------------------------
// 7️⃣ Deployment / Serving Frontend
// ----------------------------
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend', 'build')));

    app.use((req, res, next) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
        } else {
            next();
        }
    });
} else {
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}

// ----------------------------
// 8️⃣ Start Server
// ----------------------------
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// ----------------------------
// 9️⃣ Handle Unhandled Promise Rejections
// ----------------------------
process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
