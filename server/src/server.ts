import express from "express";
import http from "http";
import cors from "cors";
import WebSocket from "ws";
import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

function executeCommand (command: string) {
    const lowerCommand = command.toLowerCase();

    if(lowerCommand.startsWith('open ')){
        const app = lowerCommand.slice(5);
        exec(`start ${app}`, (error, stdout, stderr) => {
            if(error) {
                console.error("Error executing command", error.message);
                return;
            } 
                console.log(`Opened ${app}`)
        })
    } else if(lowerCommand === 'shutdown') {
        exec('shutdown /s /t 0', (error, stdout, stderr) => {
            if(error) {
                console.log(`Error in shutting down: ${error} `)
                return;
            }
            console.log('Shutting down...')
        })
    } else {
        console.log(`Unknown Command: ${command}`)
    }
}

wss.on('connection', (ws) => {
    console.log("A new client connected");

    ws.on('message', (message: WebSocket.Data) => {
        const messageString = message.toString();
        console.log("A new message received: ", messageString)

        executeCommand(messageString);
    })

    ws.on('close', () => {
        console.log("Client disconnected")
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})