import React, { useState } from 'react'

const VoiceCommander: React.FC = () => {
    const [status, setStatus] = useState('Click "Start Listening" to begin');

    const startListening = () => {
        setStatus('Listening...');
    }
  return (
    <div>
        <h1>Voice Command Remote</h1>
        <button onClick={startListening}>Start Listening</button>
        <div>{status}</div>
    </div>
  )
}

export default VoiceCommander