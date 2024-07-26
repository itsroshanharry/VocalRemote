import { exec } from "child_process";

export function executeCommand(command: string) {
  const lowerCommand = command.toLowerCase();

  // --- Application Control ---
  if (lowerCommand.includes('open ')) {
    const app = lowerCommand.replace('open ', '');
    exec(`start ${app}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing command", error.message);
        return;
      }
      console.log(`Opened ${app}`);
    });
  } else if (lowerCommand.includes('close ')) {
    const app = lowerCommand.replace('close ', '');
    exec(`taskkill /IM ${app}.exe /F`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error closing application", error.message);
        return;
      }
      console.log(`Closed ${app}`);
    });
  } else if (lowerCommand === 'shutdown') {
    exec('shutdown /s /t 0', (error, stdout, stderr) => {
      if (error) {
        console.error("Error in shutting down", error.message);
        return;
      }
      console.log('Shutting down...');
    });
  }

  // --- Volume Control ---
  else if (lowerCommand === 'increase volume') {
    exec('NirCmd changesysvolume 50000', (error, stdout, stderr) => {
      if (error) {
        console.error("Error increasing volume", error.message);
        return;
      }
      console.log('Increasing volume...');
    });
  } else if (lowerCommand === 'decrease volume') {
    exec('NirCmd changesysvolume -50000', (error, stdout, stderr) => {
      if (error) {
        console.error("Error decreasing volume", error.message);
        return;
      }
      console.log('Decreasing volume...');
    });
  } else if (lowerCommand === 'mute audio') {
    exec('NirCmd mutesysvolume 1', (error, stdout, stderr) => {
      if (error) {
        console.error("Error muting audio", error.message);
        return;
      }
      console.log('Audio muted');
    });
  } else if (lowerCommand === 'unmute audio') {
    exec('NirCmd mutesysvolume 0', (error, stdout, stderr) => {
      if (error) {
        console.error("Error unmuting audio", error.message);
        return;
      }
      console.log('Audio unmuted');
    });
  }

  // --- Brightness Control ---
  else if (lowerCommand === 'increase brightness') {
    exec('nircmd.exe setbrightness -10', (error, stdout, stderr) => {
      if (error) {
        console.error("Error increasing brightness", error.message);
        return;
      }
      console.log("Increased brightness");
    });
  } else if (lowerCommand === 'decrease brightness') {
    exec('nircmd.exe setbrightness 10', (error, stdout, stderr) => {
      if (error) {
        console.error("Error decreasing brightness", error.message);
        return;
      }
      console.log("Decreased brightness");
    });
  }

  // --- Screenshot ---
  else if (lowerCommand === 'take screenshot') {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const screenshotPath = `C:\\path\\to\\screenshot_${timestamp}.png`;
    exec(`NirCmd savescreenshot "${screenshotPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error taking screenshot", error.message);
        return;
      }
      console.log(`Screenshot taken: ${screenshotPath}`);
    });
  }

  // --- Display and System Commands ---
  else if (lowerCommand.includes('change resolution to ')) {
    const [width, height] = lowerCommand.replace('change resolution to ', '').split('x');
    exec(`NirCmd setdisplay ${width} ${height} 32`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error changing resolution", error.message);
        return;
      }
      console.log(`Resolution changed to ${width}x${height}`);
    });
  } else if (lowerCommand === 'check system status') {
    exec('systeminfo', (error, stdout, stderr) => {
      if (error) {
        console.error("Error checking system status", error.message);
        return;
      }
      console.log(`System Status:\n${stdout}`);
    });
  } else if (lowerCommand === 'lock computer') {
    exec('NirCmd lockws', (error, stdout, stderr) => {
      if (error) {
        console.error("Error locking computer", error.message);
        return;
      }
      console.log('Computer locked');
    });
  } else if (lowerCommand === 'turn off monitor') {
    exec('NirCmd monitor off', (error, stdout, stderr) => {
      if (error) {
        console.error("Error turning off monitor", error.message);
        return;
      }
      console.log('Monitor turned off');
    });
  }

  // --- File and Folder Commands ---
  else if (lowerCommand.startsWith('open file ')) {
    const filePath = lowerCommand.replace('open file ', '').trim();
    exec(`NirCmd exec show "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error opening file", error.message);
        return;
      }
      console.log(`Opened file: ${filePath}`);
    });
  } else if (lowerCommand.startsWith('open folder ')) {
    const folderPath = lowerCommand.replace('open folder ', '').trim();
    exec(`NirCmd exec show "${folderPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error opening folder", error.message);
        return;
      }
      console.log(`Opened folder: ${folderPath}`);
    });
  }

  // --- Website Control ---
  else if (lowerCommand.includes('go to ')) {
    const website = lowerCommand.replace('go to ', '');
    exec(`start https://${website}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error opening website", error.message);
        return;
      }
      console.log(`Opened website: ${website}`);
    });
  }

  // --- System Tools ---
  else if (lowerCommand === 'open calculator') {
    exec('calc', (error, stdout, stderr) => {
      if (error) {
        console.error("Error opening calculator", error.message);
        return;
      }
      console.log('Calculator opened');
    });
  } else if (lowerCommand === 'open notepad') {
    exec('notepad', (error, stdout, stderr) => {
      if (error) {
        console.error("Error opening notepad", error.message);
        return;
      }
      console.log('Notepad opened');
    });
  } else if (lowerCommand === 'play sound') {
    exec('NirCmd beep 500 1000', (error, stdout, stderr) => {
      if (error) {
        console.error("Error playing sound", error.message);
        return;
      }
      console.log('Played sound');
    });
  } else if (lowerCommand === 'show volume mixer') {
    exec('NirCmd mixer', (error, stdout, stderr) => {
      if (error) {
        console.error("Error showing volume mixer", error.message);
        return;
      }
      console.log('Volume mixer shown');
    });
  } else if (lowerCommand === 'open control panel') {
    exec('NirCmd exec show "control"', (error, stdout, stderr) => {
      if (error) {
        console.error("Error opening control panel", error.message);
        return;
      }
      console.log('Control panel opened');
    });
  }
  
  // Unknown Command
  else {
    console.log(`Unknown command: ${command}`);
  }
}
