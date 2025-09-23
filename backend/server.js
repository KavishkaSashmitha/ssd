const express = require("express");

require("dotenv").config();
const connectDB = require("./config/dbConfig");
const Cardrouter = require("./routes/PaymnetRoutes");
const CashRouter = require("./routes/CashRoutes");

const colors = require("colors");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");

const path = require("path");

const bodyParser = require("body-parser");

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 8070;

// Connect to MongoDB
connectDB();

// Middleware

// Secure CORS configuration

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment variables
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:3000',           // React development server
          'http://localhost:3001',           // Alternative React port
        ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));

app.use(express.urlencoded({ extended: false }));

// Routes

app.use("/api/user/cart", require("./routes/cartRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/directorders", require("./routes/directOrderRoute"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/reorders", require("./routes/ReOrderSup"));
app.use("/api/directcart", require("./routes/directCart"));

app.use("/sup", require("./routes/supplierRouter"));

app.use("/", require("./routes/PaymnetRoutes"));
app.use("/api/transports", require("./routes/transports"));
app.use("/api/deliveries", require("./routes/delivery"));
app.use("/", Cardrouter);
app.use("/cash", CashRouter);

app.use(bodyParser.json());

app.use("/api/customer", require("./routes/customerRoutes"));

// Use routes

app.use("/api", require("./routes/otpRoutes"));
app.use("/api/orders", require("./routes/orders"));

app.use("/api", require("./routes/otpRoutes"));

app.use("/inventory", require("./routes/inventoryRoutes"));

//app.use('/backend/img/inventory', express.static('backend/img/inventory'));

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log("Port Connected " + PORT);

  console.log("Connect To Mongo db");

  console.log(`Server is running on port ${PORT}`.yellow.bold);
});
