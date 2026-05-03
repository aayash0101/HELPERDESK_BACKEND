import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

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