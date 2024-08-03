const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./userRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/api', userRoute);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
