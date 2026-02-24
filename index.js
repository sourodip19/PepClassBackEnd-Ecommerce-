import express from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './config/dbConnect.js';
import { userRouter } from './routes/userRoutes.js';
dotenv.config();
const app = express();

dbConnect();
app.use(express.json());
app.use('/api/users', userRouter);
const PORT = process.env.port || 3000;
app.listen(PORT, () =>
  console.log(`The server is up and running on port ${PORT}`),
);
