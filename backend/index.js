const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const connectMongo = require('./db');
dotenv.config();

// Connect to MongoDB
connectMongo();

// Setup Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = require('http').createServer(app);

// Initialize socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Allows all origins, you can specify specific domains
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/broadcast', require('./routes/broadcast'));
app.use('/trade', require('./routes/trade'));

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for messages from the client
    socket.on('message', (data) => {
        console.log('Message received from client:', data);
        
        // Respond back to the client
        socket.emit('response', `Server received: ${data}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
