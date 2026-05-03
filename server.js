const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
require('express-async-errors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: "API is running" });
})

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`);
});