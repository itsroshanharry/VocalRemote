import React, { useEffect, useState } from 'react';

const VoiceCommander: React.FC = () => {
  const [status, setStatus] = useState('Click "Start Listening" to begin');
  const [result, setResult] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `wss://${window.location.hostname}:3000`;
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log("WebSocket Connected");
      setSocket(newSocket);
    };

    newSocket.onclose = (event) => {
      console.log("WebSocket Disconnected", event);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window.webkitSpeechRecognition)() as SpeechRecognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setStatus('Listening...');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const command = event.results[0][0].transcript;
        setResult(`Command: ${command}`);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(command);
        } else {
          console.error('WebSocket is not connected');
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Recognition Error", event.error);
        setStatus(`error: ${event.error}`);
      };

      recognition.onend = () => {
        setStatus('Click "Start Listening" to begin');
      };

      recognition.start();
    } else {
      setStatus('Speech Recognition not supported in this browser');
    }
  };

  return (
    <div>
      <h1>Voice Command Remote</h1>
      <button onClick={startListening}>Start Listening</button>
      <div>{status}</div>
      <div>{result}</div>
    </div>
  );
};

export default VoiceCommander;
