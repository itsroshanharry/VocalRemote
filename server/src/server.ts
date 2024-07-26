import express from "express";
import https from "https";
import cors from "cors";
import WebSocket from "ws";
import { exec } from "child_process";
import dotenv from "dotenv";
import { generateSharedCertificate } from "../../shared/generateSharedCertificate";
import { executeCommand } from "./commands/command";

dotenv.config();

const app = express();
app.use(cors({
  origin: '*', // Be more restrictive in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const { key, cert } = generateSharedCertificate();

const server = https.createServer({ key, cert }, app);

const wss = new WebSocket.Server({ server });


wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection');

  ws.on('message', (message: WebSocket.Data) => {
    const messageString = message.toString();
    console.log("A new message received: ", messageString);
    executeCommand(messageString);
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

server.on('error', (error) => {
  console.error('HTTPS server error:', error);
});

const PORT = process.env.PORT || 3000;
const IP = '0.0.0.0'; // This allows connections from any IP

server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
  console.log(`For mobile access, use: https://<your-computer-ip>:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('HTTPS server is working!');
});