// interface Window {
//     webkitSpeechRecognition: unknown;
//   }
  
  interface SpeechRecognitionEvent {
    results: {
      [index: number]: {
        [index: number]: {
          transcript: string;
        };
      };
    };
  }
  
  interface SpeechRecognitionErrorEvent {
    error: string;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    onstart: (event: Event) => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: (event: Event) => void;
    start: () => void;
  }