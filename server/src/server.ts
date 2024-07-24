import express from "express";
import http from "http";
import cors from "cors";
import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

wss.on('connection', (ws) => {
    console.log("A new client connected");

    ws.on('message', (message:string) => {
        console.log("A new message received: ", message)
    })

    ws.on('close', () => {
        console.log("Client disconnected")
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})