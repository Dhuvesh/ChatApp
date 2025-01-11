import express from 'express';
import dotenv from 'dotenv';
import AuthRoutes from './src/routes/auth.route.js';
import { connectDB } from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './src/routes/message.route.js';
import cors from 'cors';
import { app, server } from './src/lib/socket.js';
import groupRoutes from './src/routes/group.route.js';


dotenv.config();

//setting up the port
const PORT = process.env.PORT || 3000;


app.use(express.json({ limit: '50mb' })); // Increased payload size limit for JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // For URL-encoded data
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true 
}));

app.use('/api/auth', AuthRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/groups', groupRoutes); 


server.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})