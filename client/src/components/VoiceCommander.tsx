import React, { useEffect, useState } from 'react'

const VoiceCommander: React.FC = () => {
    const [status, setStatus] = useState('Click "Start Listening" to begin');
    const [result, setResult] = useState('');
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const newSocket = new WebSocket("ws://localhost:3000");

        newSocket.onopen = () => {
            console.log("WebSocket Connected");
            setSocket(newSocket);
        };

        newSocket.onclose = () => {
            console.log("WebSocket disconnected")
        };

        return () => {
            newSocket.close();
        }
    }, [])


    const startListening = () => {
        if('webkitSpeechRecognition' in window) {
            const recognition = new (window).webkitSpeechRecognition() as SpeechRecognition;
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setStatus('Listening...')
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const command = event.results[0][0].transcript;
                setResult(`Command: ${command}`);
                if(socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(command);
                } else {
                    console.error('WebSocket is not connected');
                }
            }

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech Recognition Error", event.error);
                setStatus(`error: ${event.error}`)
            };

            recognition.onend = () => {
                setStatus('Click "Start Listening" to begin');
            }

            recognition.start();
        } else {
            setStatus('Speech Recognition not supported in this browser')
        }
    }
  return (
    <div>
        <h1>Voice Command Remote</h1>
        <button onClick={startListening}>Start Listening</button>
        <div>{status}</div>
        <div>{result}</div>
    </div>
  )
}

export default VoiceCommander