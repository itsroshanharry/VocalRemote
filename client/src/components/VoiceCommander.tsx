import React, { useEffect, useState, useRef } from 'react';

const VoiceCommander: React.FC = () => {
  const [status, setStatus] = useState('Choose an action');
  const [result, setResult] = useState('');
  const [response, setResponse] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const wsUrl = `wss://${window.location.hostname}:3000`;
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log("WebSocket Connected");
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'answer') {
        setResponse(`Answer: ${data.content}`);
        if (data.audio) {
          const audio = `data:audio/mp3;base64,${data.audio}`;
          if (audioRef.current) {
            audioRef.current.src = audio;
            audioRef.current.play();
          }
        }
      } else if (data.type === 'command') {
        setResponse(data.content);
      }
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

  const startListening = (type: 'command' | 'ai') => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window.webkitSpeechRecognition)() as SpeechRecognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setStatus(`Listening for ${type}...`);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const input = event.results[0][0].transcript;
        setResult(`You said: ${input}`);
        
        if (socket && socket.readyState === WebSocket.OPEN) {
          if (type === 'command') {
            socket.send(JSON.stringify({ type: 'command', content: input }));
            setStatus('Executing command...');
          } else {
            socket.send(JSON.stringify({ type: 'question', content: input }));
            setStatus('Asking AI...');
          }
        } else {
          console.error('WebSocket is not connected');
          setStatus('Error: WebSocket not connected');
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Recognition Error", event.error);
        setStatus(`Error: ${event.error}`);
      };

      recognition.onend = () => {
        setStatus('Waiting for response...');
      };

      recognition.start();
    } else {
      setStatus('Speech Recognition not supported in this browser');
    }
  };

  return (
    <div>
      <h1>Voice Command Remote</h1>
      <button onClick={() => startListening('command')}>Listen for Command</button>
      <button onClick={() => startListening('ai')}>Ask AI</button>
      <p>{status}</p>
      <p>{result}</p>
      <p>{response}</p>
      <audio ref={audioRef} />
    </div>
  );
};

export default VoiceCommander;