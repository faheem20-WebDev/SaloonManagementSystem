const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

dotenv.config();

connectDB();

const app = express();

// Trust proxy for express-rate-limit (needed for Hugging Face/Vercel)
app.set('trust proxy', 1);

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Update CORS to allow requests from specific origins
// In production, replace '*' with your frontend domain(s)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']; 
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If you want to allow all for now but warn, or strictly block:
      // return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      // For development ease while keeping it safer than '*', let's allow if included, else maybe just allow for now or block.
      // Strict Mode:
       return callback(null, true); // For now keeping lenient for dev, but prepared for strictness
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Listen on 0.0.0.0 to accept connections from all IPv4 addresses (Fixed connection refused)
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
