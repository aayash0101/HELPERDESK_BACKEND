const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
require('express-async-errors');

dotenv.config();

const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: "API is running" });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`);
});