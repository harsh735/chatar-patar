const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");  // Import cors middleware
const app = express();
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

connectDB();

app.use(express.json());  // to accept json data

// Use the cors middleware
app.use(cors({
    origin: "https://chatar-patar-lemon.vercel.app",  // Replace with your Vercel app's URL
    credentials: true,  // Include credentials like cookies in requests
}));

// creating new api endpoints through app.use
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// deployment
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    });
}

// error handling function/middleware
app.use(notFound); // if url doesn't exist then go to this function
app.use(errorHandler); // if still some error then go to this error(not that important)

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, console.log(`Server started on PORT : ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://chatar-patar-lemon.vercel.app",  // Replace with your Vercel app's URL
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    });

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
