const dotenv = require('dotenv');
dotenv.config(); 
const express = require('express');
const cors = require('cors');
require('express-async-errors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

connectDB();
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://helperdesk-frontend.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked:', origin); // helpful for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.get('/api/health', (req, res) => {
    res.json({ status: "API is running" });
});
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`);
});