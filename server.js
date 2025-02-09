import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Import your route files
import booksRoutes from './my-app/src/routes/books.js';
import usersRoutes from './my-app/src/routes/users.js';
import ordersRoutes from './my-app/src/routes/orders.js';
//import config from './path/to/configNode.js';
// Load environment variables
dotenv.config({ path: './dbconf.env' });
const app = express();
const PORT = process.env.PORT || 3000;
const adress = process.env.DB_ADR;
// Middleware
app.use(cors({
  origin: `http://${adress}:5173`,
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use routes
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Bookstore API');
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://${adress}:${PORT}`);
});