import AWS from 'aws-sdk';
import { Readable } from 'stream';
import express from "express";
import https from "https";
import cors from "cors";
import WebSocket from "ws";
import dotenv from "dotenv";
import { generateSharedCertificate } from "../../shared/generateSharedCertificate";
import { executeCommand } from "./commands/command";
import { answerQuestion } from './ai/voicegpt';
import fetch from "node-fetch";

dotenv.config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const polly = new AWS.Polly();

console.log('PORT:', process.env.PORT);
console.log('HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY);

const app = express();

app.use(cors({
  origin: '*', // Be more restrictive in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const { key, cert } = generateSharedCertificate();
const server = https.createServer({ key, cert }, app);

const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
if (!huggingfaceApiKey) {
  console.error('HUGGINGFACE_API_KEY is not set');
  process.exit(1);
}

async function textToSpeech(text: string): Promise<Buffer> {
  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Joanna' // You can choose different voices
  };

  const data = await polly.synthesizeSpeech(params).promise();
  return data.AudioStream as Buffer;
}

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection');
  
  ws.on('message', async (message: WebSocket.Data) => {
    const messageString = message.toString();
    console.log("A new message received: ", messageString);
    
    try {
      const { type, content } = JSON.parse(messageString);
      
       if (type === 'question') {
      const answer = await answerQuestion(content);
      const audioBuffer = await textToSpeech(answer);
      // Convert Buffer to Base64
      const audioBase64 = audioBuffer.toString('base64');

        ws.send(JSON.stringify({ type: 'answer', content: answer, audio: audioBase64 }));
      } else if (type === 'command') {
        executeCommand(content);
        ws.send(JSON.stringify({ type: 'command', content: `Executed command: ${content}` }));
      } else {
        console.log(`Unknown message type: ${type}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({ type: 'error', content: 'Error processing your request' }));
    }
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
const IP = '0.0.0.0';

server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
  console.log(`For mobile access, use: https://<your_ip_address>:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('HTTPS server is working!');
});
