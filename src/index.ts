import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

mongoose
//   .connect('mongodb://localhost:27017/csvdata')  
  .connect('mongodb+srv://irfanmustafa2307:irfan2307@cluster0.b6wun.mongodb.net/dbmgitechindo?retryWrites=true&w=majority')  
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
