// Smart dev server starter
// Kills any existing process on port 5173 before starting the dev server

import { spawn } from 'child_process';
import { execSync } from 'child_process';
import { platform } from 'os';

// Kill any existing process on the given port using fuser
function killPort(port) {
   try {
      const cmd = 'fuser -k ' + port + '/tcp';
      execSync(cmd, { stdio: 'ignore' });
      console.log('Killed existing process(es) on port ' + port);
   } catch (e) {
      // fuser may not be available, that's okay
      console.log('No process found on port ' + port + ' (or fuser not available)');
   }
}

// Open the default browser
function openBrowser(url) {
   try {
      let command;
      const plat = platform();
      if (plat === 'darwin') {
         command = 'open ' + url;
      } else if (plat === 'win32') {
         command = 'start "" "' + url + '"';
      } else {
         command = 'xdg-open ' + url;
      }
   
      execSync(command, { stdio: 'ignore' });
      console.log('Opened browser to ' + url);
   } catch (e) {
      console.log('Could not auto-open browser: ' + e.message);
      console.log('Please open ' + url + ' manually');
   }
}

// Check if port is in use
function checkPort(port) {
   try {
      const { execSync } = require('child_process');
      execSync('fuser ' + port + '/tcp >/dev/null 2>&1', { stdio: 'ignore' });
      return true; // Port in use
   } catch (e) {
      return false; // Port available
   }
}

async function main() {
   console.log('Starting development server...');
   
   // Kill any existing process on port 5173
   console.log('Checking port 5173...');
   killPort(5173);
   await new Promise(r => setTimeout(r, 1000));
   
   // Check if port is available
   const portAvailable = checkPort(5173);
   if (!portAvailable) {
      console.log('Port 5173 is now available');
   } else {
      console.log('Port 5173 still in use - proceeding anyway');
   }
   
   // Start the dev server (stdio: ignore so we don't capture output)
   console.log('Starting Vite dev server...');
   const vite = spawn('bun', ['run', 'dev'], {
      stdio: 'ignore',
      cwd: process.cwd()
   });
   
   // Wait for dev server to start
   await new Promise(r => setTimeout(r, 3000));
   
   // Browser auto-open is now handled by Vite config (open: false)
   // User can manually open at http://localhost:5173/
   console.log('Dev server started');
   console.log('Visit http://localhost:5173/ in your browser');
   console.log('(Auto-browser launch is disabled per your configuration)');
}

main().catch(console.error);