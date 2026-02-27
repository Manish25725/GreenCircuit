import app from './backend/app.js';
import { connectDB } from './backend/config/db.js';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3001;
// Connect to Database
connectDB();
app.listen(PORT, () => {
});
