const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config();
const connectDB = require('./config/dbConfig');
const Cardrouter = require('./routes/PaymnetRoutes');
const CashRouter = require('./routes/CashRoutes');

const colors = require('colors');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');

const path = require('path');

const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 8070;

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});


//Welcome ebdpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the App' });
});

// Routes

app.use('/api/user/cart', require('./routes/cartRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/directorders', require('./routes/directOrderRoute'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/reorders', require('./routes/ReOrderSup'));
app.use('/api/directcart', require('./routes/directCart'));

app.use('/sup', require('./routes/supplierRouter'));

app.use('/', require('./routes/PaymnetRoutes'));
app.use('/api/transports', require('./routes/transports'));
app.use('/api/deliveries', require('./routes/delivery'));
app.use('/', Cardrouter);
app.use('/cash', CashRouter);

app.use(bodyParser.json());

app.use('/api/customer', require('./routes/customerRoutes'));

// Use routes

app.use('/api', require('./routes/otpRoutes'));
app.use('/api/orders', require('./routes/orders'));

app.use('/api', require('./routes/otpRoutes'));

app.use('/inventory', require('./routes/inventoryRoutes'));

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('Port Connected ' + PORT);

  console.log('Connect To Mongo db');

  console.log(`Server is running on port ${PORT}`.yellow.bold);
});
